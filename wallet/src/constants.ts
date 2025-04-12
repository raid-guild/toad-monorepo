import dotenv from 'dotenv';
import { config } from 'dotenv';

// Load environment variables
console.log('Loading environment variables...');
const result = config();
if (result.error) {
    console.error('Error loading .env file:', result.error);
} else {
    console.log('Environment variables loaded successfully');
}

/**
 * Validates that all required environment variables are set
 * @throws {Error} If any required environment variable is missing
 */
function validateEnv() {
    const requiredEnvVars = [
        'TOAD_WALLET_PRIVATE_KEY',
        'CHAIN_ID',
        'RPC_URL',
        'TOAD',
        'GOVERNOR_ADDRESS',
        'TOAD_API_ENDPOINT',
        'DEBUG_MODE'
    ] as const;

    console.log('\nValidating environment variables...');
    for (const envVar of requiredEnvVars) {
        if (!process.env[envVar]) {
            console.error(`Missing required environment variable: ${envVar}`);
            throw new Error(`Missing required environment variable: ${envVar}`);
        } else {
            // Don't log sensitive values
            if (envVar === 'TOAD_WALLET_PRIVATE_KEY') {
                console.log(`${envVar}: [REDACTED]`);
            } else {
                console.log(`${envVar}: ${process.env[envVar]}`);
            }
        }
    }
    console.log('All environment variables validated successfully\n');
}

// Validate environment variables
validateEnv();

// Export constants
export const TOAD_WALLET_PRIVATE_KEY = process.env.TOAD_WALLET_PRIVATE_KEY!;
export const CHAIN_ID = parseInt(process.env.CHAIN_ID!, 10);
export const RPC_URL = process.env.RPC_URL!;
export const TOAD = process.env.TOAD!;
export const GOVERNOR_ADDRESS = process.env.GOVERNOR_ADDRESS!;
export const TOAD_API_ENDPOINT = process.env.TOAD_API_ENDPOINT!;
export const DEBUG_MODE = process.env.DEBUG_MODE === 'true';
export const RATE_LIMIT = process.env.RATE_LIMIT ? parseInt(process.env.RATE_LIMIT) : 100; // Default to 100 requests per hour if not set 