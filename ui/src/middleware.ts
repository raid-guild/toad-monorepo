import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { rateLimitMiddleware, updateTokenUsage } from './middleware/rateLimit';

export async function middleware(request: NextRequest) {
    // Apply rate limiting to the chat API
    if (request.nextUrl.pathname.startsWith('/api/chat')) {
        const rateLimitResponse = rateLimitMiddleware(request);
        if (rateLimitResponse) {
            return rateLimitResponse;
        }

        // Clone the request to read the body
        const clonedRequest = request.clone();
        try {
            const body = await clonedRequest.json();
            // Estimate token count (rough estimate: 4 chars per token)
            const estimatedTokens = Math.ceil(JSON.stringify(body).length / 4);

            // Update token usage
            const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';
            updateTokenUsage(ip, estimatedTokens);
        } catch (error) {
            console.error('Error processing request body:', error);
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: '/api/chat/:path*',
}; 