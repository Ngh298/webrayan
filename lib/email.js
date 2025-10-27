/**
 * Email Service
 * سرویس ارسال ایمیل (آماده برای پیاده‌سازی)
 */

import { logger } from './logger';

/**
 * Email Configuration
 * برای استفاده واقعی، باید یکی از این سرویس‌ها را پیکربندی کنید:
 * - Resend (توصیه می‌شود): https://resend.com
 * - SendGrid: https://sendgrid.com
 * - Mailgun: https://mailgun.com
 * - Amazon SES: https://aws.amazon.com/ses
 */

/**
 * Send Email (Template Method)
 */
export async function sendEmail({ to, subject, html, text }) {
  try {
    // TODO: پیاده‌سازی ارسال ایمیل
    // مثال با Resend:
    // const { Resend } = await import('resend');
    // const resend = new Resend(process.env.RESEND_API_KEY);
    // const { data, error } = await resend.emails.send({
    //   from: 'وب‌رایان <noreply@webrayandev.ir>',
    //   to,
    //   subject,
    //   html,
    //   text,
    // });
    //
    // if (error) {
    //   throw error;
    // }
    //
    // return { success: true, data };

    // در حال حاضر فقط لاگ می‌کنیم
    logger.info('📧 Email would be sent (not configured):', { to, subject });

    return {
      success: false,
      message: 'Email service not configured',
    };
  } catch (error) {
    logger.error('خطا در ارسال ایمیل', error);
    throw error;
  }
}

/**
 * Send Contact Form Notification to Admin
 */
export async function sendContactNotificationToAdmin(contactData) {
  const { name, email, subject, message } = contactData;

  const html = `
    <div dir="rtl" style="font-family: Tahoma, Arial, sans-serif; padding: 20px; background-color: #f5f5f5;">
      <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        <h2 style="color: #3b82f6; border-bottom: 2px solid #3b82f6; padding-bottom: 10px;">
          📬 پیام جدید از فرم تماس
        </h2>
        <div style="margin: 20px 0;">
          <p><strong>نام:</strong> ${name}</p>
          <p><strong>ایمیل:</strong> ${email}</p>
          <p><strong>موضوع:</strong> ${subject}</p>
          <p><strong>پیام:</strong></p>
          <div style="background-color: #f9fafb; padding: 15px; border-right: 4px solid #3b82f6; margin: 10px 0;">
            ${message}
          </div>
        </div>
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; color: #6b7280;">
          <p>این ایمیل از سیستم مدیریت فرم تماس وب‌رایان ارسال شده است.</p>
        </div>
      </div>
    </div>
  `;

  const text = `
پیام جدید از فرم تماس

نام: ${name}
ایمیل: ${email}
موضوع: ${subject}

پیام:
${message}
  `;

  return await sendEmail({
    to: process.env.ADMIN_EMAIL || 'admin@webrayandev.ir',
    subject: `📬 پیام جدید از ${name}`,
    html,
    text,
  });
}

/**
 * Send Contact Form Confirmation to User
 */
export async function sendContactConfirmationToUser(contactData) {
  const { name, email } = contactData;

  const html = `
    <div dir="rtl" style="font-family: Tahoma, Arial, sans-serif; padding: 20px; background-color: #f5f5f5;">
      <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        <h2 style="color: #10b981; border-bottom: 2px solid #10b981; padding-bottom: 10px;">
          ✅ پیام شما دریافت شد
        </h2>
        <div style="margin: 20px 0;">
          <p>سلام ${name} عزیز،</p>
          <p>پیام شما با موفقیت دریافت شد و در اسرع وقت به آن پاسخ خواهیم داد.</p>
          <p>تیم وب‌رایان</p>
        </div>
        <div style="margin-top: 30px; padding: 20px; background-color: #eff6ff; border-radius: 8px;">
          <p style="margin: 0; color: #1e40af;">
            <strong>💡 نکته:</strong> معمولاً ظرف ۲۴ ساعت پاسخ می‌دهیم.
          </p>
        </div>
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; color: #6b7280;">
          <p>با تشکر از اعتماد شما</p>
          <p><a href="https://webrayandev.ir" style="color: #3b82f6; text-decoration: none;">webrayandev.ir</a></p>
        </div>
      </div>
    </div>
  `;

  const text = `
سلام ${name} عزیز،

پیام شما با موفقیت دریافت شد و در اسرع وقت به آن پاسخ خواهیم داد.

تیم وب‌رایان
https://webrayandev.ir
  `;

  return await sendEmail({
    to: email,
    subject: '✅ پیام شما در وب‌رایان دریافت شد',
    html,
    text,
  });
}

/**
 * Send Welcome Email
 */
export async function sendWelcomeEmail(user) {
  const { name, email } = user;

  const html = `
    <div dir="rtl" style="font-family: Tahoma, Arial, sans-serif; padding: 20px; background-color: #f5f5f5;">
      <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        <h2 style="color: #3b82f6; border-bottom: 2px solid #3b82f6; padding-bottom: 10px;">
          🎉 خوش آمدید ${name}!
        </h2>
        <div style="margin: 20px 0;">
          <p>از اینکه به وب‌رایان پیوستید بسیار خوشحالیم!</p>
          <p>حساب کاربری شما با موفقیت ایجاد شد.</p>
        </div>
        <div style="margin: 20px 0; text-align: center;">
          <a href="https://webrayandev.ir/dashboard" 
             style="display: inline-block; background-color: #3b82f6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold;">
            ورود به داشبورد
          </a>
        </div>
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; color: #6b7280;">
          <p>تیم وب‌رایان</p>
          <p><a href="https://webrayandev.ir" style="color: #3b82f6; text-decoration: none;">webrayandev.ir</a></p>
        </div>
      </div>
    </div>
  `;

  const text = `
خوش آمدید ${name}!

از اینکه به وب‌رایان پیوستید بسیار خوشحالیم!
حساب کاربری شما با موفقیت ایجاد شد.

ورود به داشبورد: https://webrayandev.ir/dashboard

تیم وب‌رایان
https://webrayandev.ir
  `;

  return await sendEmail({
    to: email,
    subject: '🎉 خوش آمدید به وب‌رایان',
    html,
    text,
  });
}

/**
 * Send Password Reset Email
 */
export async function sendPasswordResetEmail(user, resetToken) {
  const { name, email } = user;
  const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${resetToken}`;

  const html = `
    <div dir="rtl" style="font-family: Tahoma, Arial, sans-serif; padding: 20px; background-color: #f5f5f5;">
      <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        <h2 style="color: #ef4444; border-bottom: 2px solid #ef4444; padding-bottom: 10px;">
          🔐 بازیابی رمز عبور
        </h2>
        <div style="margin: 20px 0;">
          <p>سلام ${name} عزیز،</p>
          <p>درخواست بازیابی رمز عبور شما دریافت شد.</p>
          <p>برای تنظیم رمز عبور جدید، روی دکمه زیر کلیک کنید:</p>
        </div>
        <div style="margin: 20px 0; text-align: center;">
          <a href="${resetUrl}" 
             style="display: inline-block; background-color: #ef4444; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold;">
            بازیابی رمز عبور
          </a>
        </div>
        <div style="margin: 20px 0; padding: 15px; background-color: #fef2f2; border-right: 4px solid #ef4444;">
          <p style="margin: 0; color: #991b1b;">
            <strong>⚠️ توجه:</strong> این لینک فقط ۱ ساعت معتبر است.
          </p>
        </div>
        <div style="margin-top: 20px; color: #6b7280; font-size: 14px;">
          <p>اگر شما این درخواست را نداده‌اید، این ایمیل را نادیده بگیرید.</p>
        </div>
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; color: #6b7280;">
          <p>تیم وب‌رایان</p>
        </div>
      </div>
    </div>
  `;

  const text = `
بازیابی رمز عبور

سلام ${name} عزیز،

درخواست بازیابی رمز عبور شما دریافت شد.
برای تنظیم رمز عبور جدید، از لینک زیر استفاده کنید:

${resetUrl}

⚠️ این لینک فقط ۱ ساعت معتبر است.

اگر شما این درخواست را نداده‌اید، این ایمیل را نادیده بگیرید.

تیم وب‌رایان
  `;

  return await sendEmail({
    to: email,
    subject: '🔐 بازیابی رمز عبور - وب‌رایان',
    html,
    text,
  });
}

/**
 * Check if email service is configured
 */
export function isEmailConfigured() {
  // بررسی کنید که آیا سرویس ایمیل پیکربندی شده است یا نه
  return !!(
    process.env.RESEND_API_KEY ||
    process.env.SENDGRID_API_KEY ||
    process.env.MAILGUN_API_KEY ||
    (process.env.AWS_SES_REGION && process.env.AWS_ACCESS_KEY_ID)
  );
}

export default {
  sendEmail,
  sendContactNotificationToAdmin,
  sendContactConfirmationToUser,
  sendWelcomeEmail,
  sendPasswordResetEmail,
  isEmailConfigured,
};

