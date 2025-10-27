import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

export async function POST(request) {
  try {
    const { name, email, password } = await request.json();

    // Validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: 'تمام فیلدها الزامی هستند' },
        { status: 400 }
      );
    }

    // اعتبارسنجی پیشرفته رمز عبور
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

    // اعتبارسنجی نام
    if (name.trim().length < 2) {
      return NextResponse.json(
        { message: 'نام باید حداقل 2 کاراکتر باشد' },
        { status: 400 }
      );
    }

    // اعتبارسنجی ایمیل
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: 'فرمت ایمیل صحیح نیست' },
        { status: 400 }
      );
    }

    // اتصال به دیتابیس
    const db = await getDatabase();
    const usersCollection = db.collection('users');

    // چک کردن وجود کاربر
    const existingUser = await usersCollection.findOne({ email });

    if (existingUser) {
      return NextResponse.json(
        { message: 'کاربری با این ایمیل قبلاً ثبت‌نام کرده است' },
        { status: 400 }
      );
    }

    // Hash کردن رمز عبور - استفاده از dynamic import
    const bcrypt = (await import('bcryptjs')).default;
    const hashedPassword = await bcrypt.hash(password, 12);

    // ساخت کاربر جدید
    const result = await usersCollection.insertOne({
      name,
      email,
      password: hashedPassword,
      role: email === process.env.ADMIN_EMAIL ? 'admin' : 'user',
      emailVerified: null,
      image: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json(
      {
        success: true,
        message: 'ثبت‌نام با موفقیت انجام شد',
        user: {
          id: result.insertedId.toString(),
          name,
          email,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('❌ Register Error:', error);
    return NextResponse.json(
      { message: error.message || 'خطا در ثبت‌نام. لطفاً دوباره تلاش کنید' },
      { status: 500 }
    );
  }
}
