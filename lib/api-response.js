/**
 * API Response Utilities
 * استانداردسازی پاسخ‌های API
 */

import { NextResponse } from 'next/server';

/**
 * Success Response Builder
 */
export function successResponse(data, message = 'عملیات با موفقیت انجام شد', status = 200) {
  return NextResponse.json(
    {
      success: true,
      message,
      data,
      timestamp: new Date().toISOString(),
    },
    { status }
  );
}

/**
 * Error Response Builder
 */
export function errorResponse(
  message = 'خطایی رخ داده است',
  errors = null,
  status = 400
) {
  return NextResponse.json(
    {
      success: false,
      message,
      errors,
      timestamp: new Date().toISOString(),
    },
    { status }
  );
}

/**
 * Validation Error Response
 */
export function validationErrorResponse(errors) {
  return NextResponse.json(
    {
      success: false,
      message: 'خطای اعتبارسنجی',
      errors,
      timestamp: new Date().toISOString(),
    },
    { status: 422 }
  );
}

/**
 * Unauthorized Response
 */
export function unauthorizedResponse(message = 'دسترسی غیرمجاز') {
  return NextResponse.json(
    {
      success: false,
      message,
      timestamp: new Date().toISOString(),
    },
    { status: 401 }
  );
}

/**
 * Forbidden Response
 */
export function forbiddenResponse(message = 'شما اجازه دسترسی به این بخش را ندارید') {
  return NextResponse.json(
    {
      success: false,
      message,
      timestamp: new Date().toISOString(),
    },
    { status: 403 }
  );
}

/**
 * Not Found Response
 */
export function notFoundResponse(message = 'موردی یافت نشد') {
  return NextResponse.json(
    {
      success: false,
      message,
      timestamp: new Date().toISOString(),
    },
    { status: 404 }
  );
}

/**
 * Server Error Response
 */
export function serverErrorResponse(
  message = 'خطای سرور',
  error = null
) {
  const response = {
    success: false,
    message,
    timestamp: new Date().toISOString(),
  };

  // فقط در development جزئیات خطا را نمایش بده
  if (process.env.NODE_ENV === 'development' && error) {
    response.error = {
      message: error.message,
      stack: error.stack,
    };
  }

  return NextResponse.json(response, { status: 500 });
}

/**
 * Paginated Response
 */
export function paginatedResponse(data, pagination, message = 'Success') {
  const { page = 1, limit = 10, total = 0 } = pagination;
  const totalPages = Math.ceil(total / limit);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  return NextResponse.json(
    {
      success: true,
      message,
      data,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage,
        hasPrevPage,
      },
      timestamp: new Date().toISOString(),
    },
    { status: 200 }
  );
}

/**
 * Response with Headers
 */
export function responseWithHeaders(response, headers = {}) {
  Object.entries(headers).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  return response;
}

/**
 * Created Response (for POST requests)
 */
export function createdResponse(data, message = 'با موفقیت ایجاد شد') {
  return successResponse(data, message, 201);
}

/**
 * No Content Response (for DELETE requests)
 */
export function noContentResponse() {
  return new NextResponse(null, { status: 204 });
}

/**
 * Accepted Response (for async operations)
 */
export function acceptedResponse(message = 'درخواست پذیرفته شد') {
  return NextResponse.json(
    {
      success: true,
      message,
      timestamp: new Date().toISOString(),
    },
    { status: 202 }
  );
}

/**
 * Rate Limit Response
 */
export function rateLimitResponse(retryAfter, message = 'تعداد درخواست‌ها بیش از حد مجاز است') {
  return NextResponse.json(
    {
      success: false,
      message,
      retryAfter,
      timestamp: new Date().toISOString(),
    },
    {
      status: 429,
      headers: {
        'Retry-After': retryAfter.toString(),
      },
    }
  );
}

/**
 * Method Not Allowed Response
 */
export function methodNotAllowedResponse(allowedMethods = []) {
  return NextResponse.json(
    {
      success: false,
      message: 'متد HTTP مجاز نیست',
      allowedMethods,
      timestamp: new Date().toISOString(),
    },
    {
      status: 405,
      headers: {
        Allow: allowedMethods.join(', '),
      },
    }
  );
}

/**
 * Conflict Response
 */
export function conflictResponse(message = 'تضاد در داده‌ها') {
  return NextResponse.json(
    {
      success: false,
      message,
      timestamp: new Date().toISOString(),
    },
    { status: 409 }
  );
}

