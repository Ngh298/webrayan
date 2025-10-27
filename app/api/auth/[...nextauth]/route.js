import { handlers } from '@/auth';

export async function GET(request) {
  try {
    return await handlers.GET(request);
  } catch (error) {
    // لاگ بیشتر برای production
    const errorDetails = {
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      timestamp: new Date().toISOString(),
      url: request.url,
    };

    console.error('🔴 NextAuth GET Error:', errorDetails);

    return new Response(
      JSON.stringify({
        error: 'خطا در احراز هویت',
        message:
          process.env.NODE_ENV === 'development'
            ? error.message
            : 'لطفاً دوباره تلاش کنید',
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}

export async function POST(request) {
  try {
    return await handlers.POST(request);
  } catch (error) {
    const errorDetails = {
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      timestamp: new Date().toISOString(),
      url: request.url,
      method: request.method,
    };

    console.error('🔴 NextAuth POST Error:', errorDetails);

    return new Response(
      JSON.stringify({
        error: 'خطا در احراز هویت',
        message:
          process.env.NODE_ENV === 'development'
            ? error.message
            : 'لطفاً دوباره تلاش کنید',
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}
