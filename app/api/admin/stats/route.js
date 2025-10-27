import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { isAdmin } from '@/lib/auth-utils';
import { connectDB } from '@/lib/mongodb';

/**
 * API برای دریافت آمار پنل ادمین
 * GET /api/admin/stats
 */
export async function GET(request) {
  try {
    // بررسی احراز هویت
    const session = await auth();

    if (!session) {
      return NextResponse.json(
        { success: false, error: 'لطفاً وارد شوید' },
        { status: 401 }
      );
    }

    if (!isAdmin(session.user)) {
      return NextResponse.json(
        { success: false, error: 'دسترسی غیرمجاز - فقط مدیران' },
        { status: 403 }
      );
    }

    // اتصال به دیتابیس
    const { db } = await connectDB();

    // دریافت آمارها به صورت موازی با استفاده از native driver
    const [usersCount, messagesCount, projectsCount] = await Promise.all([
      db.collection('users').countDocuments(),
      db.collection('contact_messages').countDocuments(),
      db.collection('portfolio_projects').countDocuments(),
    ]);

    const stats = {
      users: usersCount,
      messages: messagesCount,
      projects: projectsCount,
    };

    return NextResponse.json({
      success: true,
      stats,
    });
  } catch (error) {
    // Log only in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error fetching admin stats:', error);
    }

    return NextResponse.json(
      {
        success: false,
        error: 'خطا در دریافت آمار',
        details:
          process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}
