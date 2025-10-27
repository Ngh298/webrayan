import { NextResponse } from 'next/server';

/**
 * Rate Limiting ساده بدون Redis - فقط برای Development
 * در Production باید از Redis استفاده کنید
 */

// ذخیره موقت درخواست‌ها در Memory (فقط برای Development)
const requestStore = new Map();

// پاکسازی خودکار هر 1 ساعت
setInterval(
  () => {
    const now = Date.now();
    for (const [key, value] of requestStore.entries()) {
      if (now > value.resetTime) {
        requestStore.delete(key);
      }
    }
  },
  60 * 60 * 1000
); // هر 1 ساعت

/**
 * Rate Limiter ساده
 */
class SimpleRateLimiter {
  constructor({ maxRequests, windowMs }) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }

  async limit(identifier) {
    const now = Date.now();
    const key = `rate_limit:${identifier}`;

    // دریافت اطلاعات قبلی
    let record = requestStore.get(key);

    // اگه رکورد نداره یا منقضی شده
    if (!record || now > record.resetTime) {
      record = {
        count: 0,
        resetTime: now + this.windowMs,
      };
    }

    // افزایش تعداد درخواست
    record.count++;
    requestStore.set(key, record);

    const remaining = Math.max(0, this.maxRequests - record.count);
    const success = record.count <= this.maxRequests;

    return {
      success,
      limit: this.maxRequests,
      remaining,
      reset: Math.ceil(record.resetTime / 1000), // به ثانیه تبدیل
    };
  }
}

/**
 * تنظیمات مختلف Rate Limiting
 */
export const authRateLimit = new SimpleRateLimiter({
  maxRequests: 5, // 5 درخواست
  windowMs: 15 * 60 * 1000, // در 15 دقیقه
});

export const generalApiRateLimit = new SimpleRateLimiter({
  maxRequests: 100, // 100 درخواست
  windowMs: 60 * 60 * 1000, // در 1 ساعت
});

export const contactFormRateLimit = new SimpleRateLimiter({
  maxRequests: 3, // 3 درخواست
  windowMs: 60 * 60 * 1000, // در 1 ساعت
});

// Aliases برای سازگاری با کدهای موجود
export const contactRateLimit = contactFormRateLimit;
export const apiRateLimit = generalApiRateLimit;

/**
 * دریافت IP کاربر
 */
export function getClientIP(request) {
  const forwarded = request.headers.get('x-forwarded-for');
  const real = request.headers.get('x-real-ip');

  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }

  if (real) {
    return real.trim();
  }

  return 'unknown';
}

/**
 * استفاده از Rate Limiter
 */
export async function withRateLimit(rateLimit, request, identifier = null) {
  const ip = identifier || getClientIP(request);
  const { success, limit, reset, remaining } = await rateLimit.limit(ip);

  return {
    success,
    limit,
    reset,
    remaining,
    headers: {
      'X-RateLimit-Limit': limit.toString(),
      'X-RateLimit-Remaining': remaining.toString(),
      'X-RateLimit-Reset': reset.toString(),
    },
  };
}

/**
 * ساخت پاسخ Rate Limit
 */
export function createRateLimitResponse(rateLimitResult) {
  const retryAfter = rateLimitResult.reset - Math.floor(Date.now() / 1000);

  return NextResponse.json(
    {
      error: 'خیلی زیاد درخواست فرستادی!',
      message: `لطفاً ${Math.ceil(retryAfter / 60)} دقیقه دیگه دوباره تلاش کن`,
      retryAfter,
    },
    {
      status: 429,
      headers: {
        'Retry-After': retryAfter.toString(),
        ...rateLimitResult.headers,
      },
    }
  );
}

console.log('✅ Rate Limiting (Memory-based) بارگذاری شد');
