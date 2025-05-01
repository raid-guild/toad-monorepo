import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const RATE_LIMIT = 10; // requests per minute
const WINDOW_MS = 60 * 1000; // 1 minute
const MAX_TOKENS_PER_MINUTE = 30000; // OpenAI's token limit

const requestCounts = new Map<string, { count: number; resetTime: number }>();
const tokenCounts = new Map<string, { tokens: number; resetTime: number }>();

export function rateLimitMiddleware(request: NextRequest) {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';
    const now = Date.now();

    // Clean up old entries
    for (const [key, value] of requestCounts.entries()) {
        if (value.resetTime < now) {
            requestCounts.delete(key);
        }
    }
    for (const [key, value] of tokenCounts.entries()) {
        if (value.resetTime < now) {
            tokenCounts.delete(key);
        }
    }

    // Check request rate limit
    const current = requestCounts.get(ip) || { count: 0, resetTime: now + WINDOW_MS };
    if (current.count >= RATE_LIMIT) {
        return NextResponse.json(
            { 
                error: 'Rate limit exceeded', 
                message: 'Too many requests. Please try again later.',
                retryAfter: Math.ceil((current.resetTime - now) / 1000) 
            },
            { 
                status: 429, 
                headers: { 
                    'Retry-After': String(Math.ceil((current.resetTime - now) / 1000)),
                    'X-RateLimit-Limit': String(RATE_LIMIT),
                    'X-RateLimit-Remaining': String(RATE_LIMIT - current.count),
                    'X-RateLimit-Reset': String(current.resetTime)
                } 
            }
        );
    }

    // Check token rate limit
    const tokenUsage = tokenCounts.get(ip) || { tokens: 0, resetTime: now + WINDOW_MS };
    if (tokenUsage.tokens >= MAX_TOKENS_PER_MINUTE) {
        return NextResponse.json(
            { 
                error: 'Token limit exceeded', 
                message: 'Token usage limit reached. Please try again later.',
                retryAfter: Math.ceil((tokenUsage.resetTime - now) / 1000)
            },
            { 
                status: 429, 
                headers: { 
                    'Retry-After': String(Math.ceil((tokenUsage.resetTime - now) / 1000)),
                    'X-TokenLimit-Limit': String(MAX_TOKENS_PER_MINUTE),
                    'X-TokenLimit-Remaining': String(MAX_TOKENS_PER_MINUTE - tokenUsage.tokens),
                    'X-TokenLimit-Reset': String(tokenUsage.resetTime)
                } 
            }
        );
    }

    // Update request count
    requestCounts.set(ip, { count: current.count + 1, resetTime: current.resetTime });

    // Update token count (this will be updated by the API response handler)
    tokenCounts.set(ip, { tokens: tokenUsage.tokens, resetTime: tokenUsage.resetTime });

    return null;
}

// Helper function to update token usage
export function updateTokenUsage(ip: string, tokens: number) {
    const now = Date.now();
    const tokenUsage = tokenCounts.get(ip) || { tokens: 0, resetTime: now + WINDOW_MS };
    tokenCounts.set(ip, { tokens: tokenUsage.tokens + tokens, resetTime: tokenUsage.resetTime });
} 