import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { logger } from '@/lib/logger';

/**
 * پیکربندی NextAuth v5
 * احراز هویت با استفاده از Credentials (ایمیل/رمز عبور)
 * بدون OAuth - تمرکز بر امنیت و کنترل کامل
 */
export const { handlers, auth, signIn, signOut } = NextAuth({
  // استراتژی session بر پایه JWT
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 روز
  },

  // صفحات سفارشی احراز هویت
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
    newUser: '/auth/register',
  },

  providers: [
    /**
     * Credentials Provider
     * احراز هویت با ایمیل و رمز عبور
     */
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: {
          label: 'Email',
          type: 'email',
          placeholder: 'example@email.com',
        },
        password: {
          label: 'Password',
          type: 'password',
        },
      },

      /**
       * تابع authorize - بررسی اعتبار کاربر
       * @param {Object} credentials - اطلاعات ورودی کاربر
       * @returns {Object|null} - اطلاعات کاربر یا null
       */
      async authorize(credentials) {
        // اعتبارسنجی ورودی
        if (!credentials?.email || !credentials?.password) {
          throw new Error('لطفاً ایمیل و رمز عبور را وارد کنید.');
        }

        try {
          // اتصال به دیتابیس
          const { getDatabase } = await import('@/lib/mongodb');
          const db = await getDatabase();
          const usersCollection = db.collection('users');

          // جستجوی کاربر
          const user = await usersCollection.findOne({
            email: credentials.email.toLowerCase().trim(),
          });

          if (!user) {
            throw new Error('کاربری با این ایمیل یافت نشد.');
          }

          // بررسی وجود رمز عبور (برای کاربرانی که با OAuth ثبت‌نام کرده‌اند)
          if (!user.password) {
            throw new Error('این حساب از طریق روش دیگری ایجاد شده است.');
          }

          // بررسی رمز عبور
          const bcrypt = (await import('bcryptjs')).default;
          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!isPasswordValid) {
            throw new Error('رمز عبور اشتباه است.');
          }

          // بررسی وضعیت حساب (اگر سیستم مسدودسازی داشته باشید)
          if (user.status === 'blocked') {
            throw new Error('حساب کاربری شما مسدود شده است.');
          }

          // بروزرسانی آخرین زمان ورود
          await usersCollection.updateOne(
            { _id: user._id },
            {
              $set: {
                lastLogin: new Date(),
                updatedAt: new Date(),
              },
            }
          );

          // بازگشت اطلاعات کاربر
          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            role: user.role ? user.role.toLowerCase() : 'user',
            image: user.image || null,
          };
        } catch (error) {
          logger.error('Authorization Error', error);
          throw error;
        }
      },
    }),
  ],

  callbacks: {
    /**
     * Callback JWT
     * مدیریت توکن JWT
     */
    async jwt({ token, user, trigger, session }) {
      // اولین بار که login می‌شود
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.email = user.email;
        token.name = user.name;
        token.picture = user.image;
      }

      // وقتی session آپدیت می‌شود
      if (trigger === 'update' && session) {
        token = { ...token, ...session };
      }

      return token;
    },

    /**
     * Callback Session
     * مدیریت session کاربر
     */
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.email = token.email;
        session.user.name = token.name;
        session.user.image = token.picture;
      }
      return session;
    },

    /**
     * Callback Redirect
     * تعیین مسیر بعد از ورود/خروج
     */
    async redirect({ url, baseUrl }) {
      // اگر URL نسبی است، با baseUrl ترکیب شود
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      // اگر URL با baseUrl شروع می‌شود، اجازه redirect بده
      else if (new URL(url).origin === baseUrl) return url;
      // در غیر این صورت به صفحه اصلی برو
      return baseUrl;
    },
  },

  // امنیت
  secret: process.env.NEXTAUTH_SECRET,

  // Debug mode فقط در development
  debug: process.env.NODE_ENV === 'development',

  // تنظیمات JWT
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 روز
  },

  // Events - برای لاگ کردن رویدادها
  events: {
    async signIn({ user }) {
      logger.auth('کاربر وارد شد:', user.email);
    },
    async signOut({ token }) {
      logger.auth('کاربر خارج شد:', token?.email);
    },
    async createUser({ user }) {
      logger.auth('کاربر جدید ایجاد شد:', user.email);
    },
  },
});
