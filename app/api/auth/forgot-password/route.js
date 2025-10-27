import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

// ایجاد توکن تصادفی امن
function generateToken(length = 48) {
  const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
  let token = '';
  for (let i = 0; i < length; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
}

export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { message: 'ایمیل الزامی است' },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    const db = await getDatabase();
    const users = db.collection('users');

    const user = await users.findOne({ email: normalizedEmail });

    // برای جلوگیری از افشای وجود/عدم وجود کاربر، همیشه پاسخ موفق بده
    if (!user) {
      return NextResponse.json({
        message: 'اگر ایمیل معتبر باشد، لینک بازنشانی ارسال شد',
      });
    }

    // تولید توکن بازنشانی و زمان انقضا (1 ساعت)
    const resetToken = generateToken(48);
    const resetTokenExpires = new Date(Date.now() + 60 * 60 * 1000);

    await users.updateOne(
      { _id: user._id },
      {
        $set: {
          resetPasswordToken: resetToken,
          resetPasswordExpires: resetTokenExpires,
          updatedAt: new Date(),
        },
      }
    );

    // ارسال ایمیل: در محیط واقعی باید ایمیل ارسال شود
    // اینجا فقط لینک را برمی‌گردانیم برای توسعه
    const baseUrl =
      process.env.NEXTAUTH_URL ||
      process.env.BASE_URL ||
      'http://localhost:3000';
    const resetUrl = `${baseUrl}/auth/reset-password?token=${encodeURIComponent(resetToken)}`;

    return NextResponse.json({
      message: 'اگر ایمیل معتبر باشد، لینک بازنشانی ارسال شد',
      resetUrl: process.env.NODE_ENV === 'development' ? resetUrl : undefined,
    });
  } catch (error) {
    console.error('Forgot Password Error:', error);
    return NextResponse.json(
      { message: 'خطا در پردازش درخواست. لطفاً دوباره تلاش کنید' },
      { status: 500 }
    );
  }
}
