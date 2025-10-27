import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

export async function POST(request) {
  try {
    const { token, password } = await request.json();

    if (!token || !password) {
      return NextResponse.json(
        { message: 'توکن و رمز عبور الزامی است' },
        { status: 400 }
      );
    }

    // قوانین رمز عبور (همان قوانین UI)
    if (password.length < 8) {
      return NextResponse.json(
        { message: 'رمز عبور باید حداقل 8 کاراکتر باشد' },
        { status: 400 }
      );
    }
    if (!/(?=.*[a-z])/.test(password)) {
      return NextResponse.json(
        { message: 'رمز عبور باید حداقل یک حرف کوچک داشته باشد' },
        { status: 400 }
      );
    }
    if (!/(?=.*[A-Z])/.test(password)) {
      return NextResponse.json(
        { message: 'رمز عبور باید حداقل یک حرف بزرگ داشته باشد' },
        { status: 400 }
      );
    }
    if (!/(?=.*\d)/.test(password)) {
      return NextResponse.json(
        { message: 'رمز عبور باید حداقل یک عدد داشته باشد' },
        { status: 400 }
      );
    }

    const db = await getDatabase();
    const users = db.collection('users');

    // یافتن کاربر با توکن معتبر و غیرمنقضی
    const user = await users.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!user) {
      return NextResponse.json(
        { message: 'توکن نامعتبر یا منقضی شده است' },
        { status: 400 }
      );
    }

    // Hash کردن رمز عبور جدید
    const bcrypt = (await import('bcryptjs')).default;
    const hashedPassword = await bcrypt.hash(password, 12);

    // بروزرسانی رمز و پاک کردن توکن
    await users.updateOne(
      { _id: user._id },
      {
        $set: {
          password: hashedPassword,
          updatedAt: new Date(),
        },
        $unset: {
          resetPasswordToken: '',
          resetPasswordExpires: '',
        },
      }
    );

    return NextResponse.json({ message: 'رمز عبور با موفقیت بروزرسانی شد' });
  } catch (error) {
    console.error('Reset Password Error:', error);
    return NextResponse.json(
      { message: 'خطا در بازنشانی رمز عبور. لطفاً دوباره تلاش کنید' },
      { status: 500 }
    );
  }
}
