import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export async function PUT(request) {
  try {
    // Check authentication
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, message: 'لطفاً وارد حساب کاربری خود شوید' },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { name, phone, currentPassword, newPassword } = body;

    // Connect to database with Mongoose
    await connectDB();

    // Find user (include password field for credentials users)
    const user = await User.findOne({ email: session.user.email }).select(
      '+password'
    );
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'کاربر یافت نشد' },
        { status: 404 }
      );
    }

    // Update name
    if (name && name.trim()) {
      user.name = name.trim();
    }

    // Update phone
    if (phone !== undefined) {
      user.phone = phone.trim() || null;
    }

    // Update password if provided
    if (newPassword) {
      // Check if user is OAuth user (Google/GitHub)
      if (user.provider && user.provider !== 'credentials') {
        return NextResponse.json(
          {
            success: false,
            message:
              'شما با OAuth وارد شده‌اید و نمی‌توانید رمز عبور تنظیم کنید',
          },
          { status: 400 }
        );
      }

      // Verify current password (only if user has a password)
      if (!currentPassword) {
        return NextResponse.json(
          { success: false, message: 'لطفاً رمز عبور فعلی را وارد کنید' },
          { status: 400 }
        );
      }

      // Check if user has existing password
      if (!user.password) {
        return NextResponse.json(
          {
            success: false,
            message: 'کاربر شما رمز عبور ندارد. لطفاً با پشتیبانی تماس بگیرید',
          },
          { status: 400 }
        );
      }

      const isPasswordValid = await bcrypt.compare(
        currentPassword,
        user.password
      );
      if (!isPasswordValid) {
        return NextResponse.json(
          { success: false, message: 'رمز عبور فعلی اشتباه است' },
          { status: 400 }
        );
      }

      // Validate new password
      if (newPassword.length < 8) {
        return NextResponse.json(
          {
            success: false,
            message: 'رمز عبور جدید باید حداقل 8 کاراکتر باشد',
          },
          { status: 400 }
        );
      }

      // Set new password (will be hashed by pre-save hook)
      user.password = newPassword;
    }

    // Save user
    await user.save();

    return NextResponse.json({
      success: true,
      message: 'اطلاعات با موفقیت به‌روزرسانی شد',
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
    });
  } catch (error) {
    console.error('Update profile error:', error);
    console.error('Error details:', error.message);

    // Check for validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return NextResponse.json(
        { success: false, message: messages.join(', ') },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: 'خطایی در به‌روزرسانی اطلاعات رخ داد',
        details:
          process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}
