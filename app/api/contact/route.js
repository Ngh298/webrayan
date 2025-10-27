import { NextResponse } from 'next/server';
import {
  contactRateLimit,
  withRateLimit,
  createRateLimitResponse,
} from '@/lib/rate-limit';
import { connectDB } from '@/lib/mongodb';

export async function POST(request) {
  try {
    // Rate limiting check
    const rateLimitResult = await withRateLimit(contactRateLimit, request);

    if (!rateLimitResult.success) {
      console.log('🚫 Rate limit exceeded for contact form:', rateLimitResult);
      return createRateLimitResponse(rateLimitResult);
    }

    // دریافت داده‌های فرم
    const {
      name,
      email,
      subject,
      message,
      phone,
      projectType,
      budget,
      priority,
      timeline,
    } = await request.json();

    // اعتبارسنجی ورودی‌ها
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        {
          error: 'Validation Error',
          message: 'تمام فیلدها الزامی هستند',
          fields: { name, email, subject, message },
        },
        {
          status: 400,
          headers: rateLimitResult.headers,
        }
      );
    }

    // بررسی طول فیلدها
    if (name.trim().length < 2) {
      return NextResponse.json(
        {
          error: 'Validation Error',
          message: 'نام باید حداقل 2 کاراکتر باشد',
        },
        {
          status: 400,
          headers: rateLimitResult.headers,
        }
      );
    }

    if (subject.trim().length < 5) {
      return NextResponse.json(
        {
          error: 'Validation Error',
          message: 'موضوع باید حداقل 5 کاراکتر باشد',
        },
        {
          status: 400,
          headers: rateLimitResult.headers,
        }
      );
    }

    if (message.trim().length < 10) {
      return NextResponse.json(
        {
          error: 'Validation Error',
          message: 'پیام باید حداقل 10 کاراکتر باشد',
        },
        {
          status: 400,
          headers: rateLimitResult.headers,
        }
      );
    }

    // بررسی فرمت ایمیل
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        {
          error: 'Validation Error',
          message: 'فرمت ایمیل صحیح نیست',
        },
        {
          status: 400,
          headers: rateLimitResult.headers,
        }
      );
    }

    // اتصال به دیتابیس
    const { db } = await connectDB();

    // ذخیره پیام در دیتابیس
    const contactMessage = {
      name: name.trim(),
      email: email.toLowerCase().trim(),
      subject: subject.trim(),
      message: message.trim(),
      // Additional form data
      phone: phone?.trim() || null,
      projectType: projectType || 'website',
      budget: budget || null,
      priority: priority || 'medium',
      timeline: timeline || null,
      // System metadata
      createdAt: new Date(),
      isRead: false,
      status: 'new',
      ip:
        request.headers.get('x-forwarded-for') ||
        request.headers.get('x-real-ip') ||
        'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
      source: 'contact_form',
    };

    const result = await db
      .collection('contact_messages')
      .insertOne(contactMessage);

    console.log('✅ Contact message saved:', result.insertedId);

    // TODO: ارسال ایمیل اطلاع‌رسانی به مدیر
    // TODO: ارسال ایمیل تأیید به کاربر

    // برگرداندن پاسخ موفق
    return NextResponse.json(
      {
        success: true,
        message:
          'پیام شما با موفقیت ارسال شد. به زودی با شما تماس خواهیم گرفت.',
        id: result.insertedId,
        timestamp: new Date().toISOString(),
      },
      {
        status: 201,
        headers: {
          ...rateLimitResult.headers,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('❌ خطا در ارسال پیام تماس:', error);

    // خطای عمومی سرور
    return NextResponse.json(
      {
        error: 'Server Error',
        message: 'خطای داخلی سرور. لطفاً دوباره تلاش کنید',
        timestamp: new Date().toISOString(),
      },
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}

// GET endpoint برای مدیران (مشاهده پیام‌ها)
export async function GET(request) {
  try {
    // Rate limiting برای GET requests
    const rateLimitResult = await withRateLimit(contactRateLimit, request);

    if (!rateLimitResult.success) {
      return createRateLimitResponse(rateLimitResult);
    }

    // TODO: بررسی احراز هویت مدیر
    // const session = await auth();
    // if (!session?.user || session.user.role !== 'admin') {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const { db } = await connectDB();

    // دریافت پیام‌های تماس
    const messages = await db
      .collection('contact_messages')
      .find({})
      .sort({ createdAt: -1 })
      .limit(50)
      .toArray();

    return NextResponse.json(
      {
        success: true,
        messages,
        count: messages.length,
      },
      {
        status: 200,
        headers: rateLimitResult.headers,
      }
    );
  } catch (error) {
    console.error('❌ خطا در دریافت پیام‌ها:', error);

    return NextResponse.json(
      {
        error: 'Server Error',
        message: 'خطا در دریافت پیام‌ها',
      },
      { status: 500 }
    );
  }
}
