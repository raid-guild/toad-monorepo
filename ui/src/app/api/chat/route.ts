import { openai } from '@ai-sdk/openai';
import { createOpenAICompatible } from '@ai-sdk/openai-compatible';
import { LanguageModelV1, streamText } from 'ai';
import { tally } from "../../../plugins/tally/src";
import { discourse } from "../../../plugins/discourse/src";
import { toad } from "../../../plugins/toad/src";
import { createWalletClient, http } from "viem";
import { polygon } from "viem/chains";
import { getOnChainTools } from "@goat-sdk/adapter-vercel-ai";
import { viem } from "@goat-sdk/wallet-viem";
import { privateKeyToAccount } from 'viem/accounts';
import { apiKeys, config, openaiConfig, discourseConfig, hasRequiredEnvVars, contracts } from '@/config/constants';
import dotenv from 'dotenv'
dotenv.config()

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

interface RateLimitError extends Error {
    responseHeaders?: {
        'retry-after-ms'?: string;
    };
}

export async function POST(req: Request) {
    console.log('Chat API request received');

    // Get the messages from the request
    const { messages } = await req.json();
    console.log('Received messages:', JSON.stringify(messages, null, 2));

    // Check for required environment variables
    if (!hasRequiredEnvVars()) {
        console.error('Missing required environment variables');
        console.log('Current environment variables:', JSON.stringify(process.env));
        throw new Error('Missing required environment variables');
    }

    // Initialize wallet client
    console.log('Initializing wallet client...');
    const account = privateKeyToAccount(config.walletPrivateKey);
    const walletClient = createWalletClient({
        account: account,
        transport: http(config.rpcProviderUrl),
        chain: polygon,
    });
    console.log('Wallet client initialized');

    let provider = null;
    console.log('Checking for OpenAI compatible provider...');
    if (openaiConfig.baseUrl && openaiConfig.model) {
        console.log('Using OpenAI compatible provider:', openaiConfig.baseUrl);
        provider = createOpenAICompatible({
            name: 'compatible',
            apiKey: apiKeys.openai,
            baseURL: openaiConfig.baseUrl
        });
        const response = await fetch(`${openaiConfig.baseUrl}/v1/models`, {
            headers: {
                'Authorization': `Bearer ${apiKeys.openai}`,
            },
        });
        console.log("OpenAI Compatible Provider Response Status:", response.status);
        if (response.status != 200) {
            console.error("OpenAI Compatible Provider Error Response:", await response.text());
            throw new Error('Failed to connect to model provider');
        }
    } else {
        console.log('Using standard OpenAI provider');
        const response = await fetch(`https://api.openai.com/v1/models`, {
            headers: {
                'Authorization': `Bearer ${apiKeys.openai}`,
            },
        });
        console.log("OpenAI Provider Response Status:", response.status);
        if (response.status != 200) {
            console.error("OpenAI Provider Error Response:", await response.text());
            throw new Error('Failed to connect to openai');
        }
    }

    console.log('Initializing model with config:', {
        model: openaiConfig.model,
        provider: provider ? 'compatible' : 'openai'
    });
    const model = provider ? provider(openaiConfig.model) : openai(openaiConfig.model || 'gpt-4');

    // Initialize tools
    console.log('Initializing on-chain tools...');
    const tools = await getOnChainTools({
        wallet: viem(walletClient),
        plugins: [
            discourse({
                apiKey: apiKeys.discourse,
                apiUsername: discourseConfig.apiUsername,
                baseUrl: discourseConfig.baseUrl,
            }),
            tally({
                apiKey: apiKeys.tally,
                organizationName: config.organizationName,
                chainId: config.chainId,
            }),
            toad({
                contractAddress: contracts.toad,
                chainId: config.chainId,
            }),
        ],
    });
    console.log('Tools initialized successfully:', {
        discourse: !!apiKeys.discourse,
        tally: !!apiKeys.tally,
        toad: !!contracts.toad
    });

    // Stream the response from the OpenAI API
    console.log('Starting text stream...');
    console.log('Messages being processed:', JSON.stringify(messages, null, 2));

    const result = streamText({
        model: model as LanguageModelV1,
        tools: tools,
        maxSteps: 10,
        system: `You are a helpful assistant that can answer questions about the governance organization: ${config.organizationName}. ${config.organizationDescription}`,
        messages,
    });

    try {
        console.log('Converting stream to response...');
        const response = await result.toDataStreamResponse();

        if (!response) {
            console.error('No response object received from stream');
            throw new Error('No response received from AI model');
        }

        if (!response.body) {
            console.error('Response body is empty');
            throw new Error('Empty response from AI model');
        }

        console.log('Successfully generated response');
        return response;
    } catch (error) {
        console.error('Error in chat API:', error);

        // Handle rate limit errors specifically
        if (error instanceof Error && error.message.includes('rate_limit_exceeded')) {
            const rateLimitError = error as RateLimitError;
            const retryAfter = rateLimitError.responseHeaders?.['retry-after-ms'] || '18000';
            return new Response(
                JSON.stringify({
                    error: 'Rate limit exceeded',
                    message: 'TOAD is currently processing too many requests. Please try again in a few moments.',
                    retryAfter: parseInt(retryAfter)
                }),
                {
                    status: 429,
                    headers: {
                        'Content-Type': 'application/json',
                        'Retry-After': retryAfter
                    }
                }
            );
        }

        if (error instanceof Error) {
            console.error('Error details:', {
                message: error.message,
                stack: error.stack,
                name: error.name
            });
        }
        throw error;
    }
}