/**
 * CSRF Protection Utilities
 * محافظت در برابر حملات Cross-Site Request Forgery
 */

import { randomBytes, createHash, timingSafeEqual } from 'crypto';
import { headers } from 'next/headers';
import React from 'react';

// CSRF Token Configuration
const CSRF_TOKEN_LENGTH = 32;
const CSRF_TOKEN_LIFETIME = 60 * 60 * 1000; // 1 hour
const CSRF_HEADER_NAME = 'x-csrf-token';
const CSRF_COOKIE_NAME = '__Host-csrf-token';

/**
 * Generate CSRF Token
 */
export function generateCSRFToken() {
  const token = randomBytes(CSRF_TOKEN_LENGTH).toString('hex');
  const timestamp = Date.now();

  // Create token with timestamp
  const tokenData = {
    token,
    timestamp,
    hash: createTokenHash(token, timestamp),
  };

  return Buffer.from(JSON.stringify(tokenData)).toString('base64');
}

/**
 * Create Token Hash
 */
function createTokenHash(token, timestamp) {
  const secret =
    process.env.CSRF_SECRET || process.env.NEXTAUTH_SECRET || 'default-secret';
  return createHash('sha256')
    .update(`${token}:${timestamp}:${secret}`)
    .digest('hex');
}

/**
 * Verify CSRF Token
 */
export function verifyCSRFToken(providedToken, storedToken) {
  if (!providedToken || !storedToken) {
    return false;
  }

  try {
    // Decode stored token
    const tokenData = JSON.parse(Buffer.from(storedToken, 'base64').toString());
    const { token, timestamp, hash } = tokenData;

    // Check if token is expired
    if (Date.now() - timestamp > CSRF_TOKEN_LIFETIME) {
      return false;
    }

    // Verify hash
    const expectedHash = createTokenHash(token, timestamp);
    if (
      !timingSafeEqual(
        Buffer.from(hash, 'hex'),
        Buffer.from(expectedHash, 'hex')
      )
    ) {
      return false;
    }

    // Compare provided token with stored token
    return timingSafeEqual(
      Buffer.from(providedToken, 'hex'),
      Buffer.from(token, 'hex')
    );
  } catch (error) {
    console.error('CSRF token verification error:', error);
    return false;
  }
}

/**
 * Middleware for CSRF Protection
 */
export async function csrfProtection(request) {
  const method = request.method;

  // Skip CSRF check for safe methods
  if (['GET', 'HEAD', 'OPTIONS'].includes(method)) {
    return { success: true };
  }

  try {
    // Get CSRF token from header
    const headersList = headers();
    const csrfToken = headersList.get(CSRF_HEADER_NAME);

    // Get CSRF token from cookies
    const cookies = request.cookies;
    const csrfCookie = cookies.get(CSRF_COOKIE_NAME);

    if (!csrfToken || !csrfCookie) {
      return {
        success: false,
        error: 'CSRF token missing',
        status: 403,
      };
    }

    // Verify token
    const isValid = verifyCSRFToken(csrfToken, csrfCookie.value);

    if (!isValid) {
      return {
        success: false,
        error: 'Invalid CSRF token',
        status: 403,
      };
    }

    return { success: true };
  } catch (error) {
    console.error('CSRF protection error:', error);
    return {
      success: false,
      error: 'CSRF validation failed',
      status: 500,
    };
  }
}

/**
 * Get CSRF Token for Client
 */
export function getCSRFToken(request) {
  try {
    const cookies = request.cookies;
    const csrfCookie = cookies.get(CSRF_COOKIE_NAME);

    if (csrfCookie) {
      const tokenData = JSON.parse(
        Buffer.from(csrfCookie.value, 'base64').toString()
      );

      // Check if token is still valid
      if (Date.now() - tokenData.timestamp < CSRF_TOKEN_LIFETIME) {
        return tokenData.token;
      }
    }

    // Generate new token if none exists or expired
    return null;
  } catch (error) {
    console.error('Error getting CSRF token:', error);
    return null;
  }
}

/**
 * Create CSRF Cookie Options
 */
export function createCSRFCookieOptions() {
  return {
    name: CSRF_COOKIE_NAME,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: CSRF_TOKEN_LIFETIME / 1000, // Convert to seconds
    path: '/',
  };
}

/**
 * CSRF Token API Route Handler
 */
export async function handleCSRFTokenRequest(request) {
  try {
    const token = generateCSRFToken();
    const cookieOptions = createCSRFCookieOptions();

    // Parse token to get the actual token value for client
    const tokenData = JSON.parse(Buffer.from(token, 'base64').toString());

    return {
      success: true,
      token: tokenData.token,
      cookie: {
        ...cookieOptions,
        value: token,
      },
    };
  } catch (error) {
    console.error('CSRF token generation error:', error);
    return {
      success: false,
      error: 'Failed to generate CSRF token',
    };
  }
}

/**
 * Double Submit Cookie Pattern
 */
export class CSRFProtector {
  constructor(secret = process.env.CSRF_SECRET) {
    this.secret = secret || process.env.NEXTAUTH_SECRET || 'default-secret';
  }

  generateToken() {
    return generateCSRFToken();
  }

  verifyToken(providedToken, storedToken) {
    return verifyCSRFToken(providedToken, storedToken);
  }

  async protect(request) {
    return await csrfProtection(request);
  }

  getTokenFromRequest(request) {
    return getCSRFToken(request);
  }

  createCookieOptions() {
    return createCSRFCookieOptions();
  }
}

/**
 * React Hook for CSRF Protection
 */
export function useCSRF() {
  const [csrfToken, setCSRFToken] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const fetchCSRFToken = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/csrf-token');

        if (response.ok) {
          const data = await response.json();
          setCSRFToken(data.token);
        } else {
          throw new Error('Failed to fetch CSRF token');
        }
      } catch (err) {
        setError(err.message);
        console.error('CSRF token fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCSRFToken();
  }, []);

  const refreshToken = React.useCallback(async () => {
    const response = await fetch('/api/csrf-token');
    if (response.ok) {
      const data = await response.json();
      setCSRFToken(data.token);
      return data.token;
    }
    throw new Error('Failed to refresh CSRF token');
  }, []);

  return { csrfToken, loading, error, refreshToken };
}

/**
 * Fetch with CSRF Protection
 */
export async function csrfFetch(url, options = {}) {
  // Get CSRF token
  const csrfResponse = await fetch('/api/csrf-token');
  if (!csrfResponse.ok) {
    throw new Error('Failed to get CSRF token');
  }

  const { token } = await csrfResponse.json();

  // Add CSRF token to headers
  const headers = {
    ...options.headers,
    [CSRF_HEADER_NAME]: token,
    'Content-Type': 'application/json',
  };

  return fetch(url, {
    ...options,
    headers,
  });
}

export { CSRF_HEADER_NAME, CSRF_COOKIE_NAME };
