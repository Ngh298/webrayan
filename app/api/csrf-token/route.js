import { NextResponse } from 'next/server';
import { handleCSRFTokenRequest } from '@/lib/csrf';

/**
 * GET /api/csrf-token
 * Generate and return CSRF token
 */
export async function GET(request) {
  try {
    const result = await handleCSRFTokenRequest(request);

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    const response = NextResponse.json({
      success: true,
      token: result.token,
    });

    // Set CSRF cookie
    response.cookies.set(result.cookie);

    return response;
  } catch (error) {
    console.error('CSRF token API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
