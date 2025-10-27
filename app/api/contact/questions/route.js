import { NextResponse } from 'next/server';
import { connectMongoDB } from '@/lib/mongodb';
import FaqQuestion from '@/models/FaqQuestion';

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, question } = body || {};

    // Basic validation
    if (!name || !email || !question) {
      return NextResponse.json(
        {
          success: false,
          message: 'تمام فیلدها الزامی هستند',
          errors: {
            name: !name ? 'نام الزامی است' : null,
            email: !email ? 'ایمیل الزامی است' : null,
            question: !question ? 'سوال الزامی است' : null,
          },
        },
        { status: 400 }
      );
    }

    // Trim inputs
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedQuestion = question.trim();

    // Additional validation
    if (trimmedName.length < 2 || trimmedName.length > 100) {
      return NextResponse.json(
        { success: false, message: 'نام باید بین 2 تا 100 کاراکتر باشد' },
        { status: 400 }
      );
    }

    if (trimmedQuestion.length < 10 || trimmedQuestion.length > 500) {
      return NextResponse.json(
        { success: false, message: 'سوال باید بین 10 تا 500 کاراکتر باشد' },
        { status: 400 }
      );
    }

    // Connect to database
    await connectMongoDB();

    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    const doc = new FaqQuestion({
      name: trimmedName,
      email: trimmedEmail,
      question: trimmedQuestion,
      ip,
      userAgent,
    });

    const saved = await doc.save();

    return NextResponse.json(
      {
        success: true,
        message: 'سوال شما با موفقیت ثبت شد و به زودی بررسی خواهد شد',
        id: saved._id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('FAQ Question POST error:', error);

    if (error?.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(e => e.message);
      return NextResponse.json(
        {
          success: false,
          message: messages.join(', '),
          errors: error.errors,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: 'خطای داخلی سرور. لطفاً دوباره تلاش کنید',
      },
      { status: 500 }
    );
  }
}
