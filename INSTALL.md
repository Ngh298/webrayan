# 📦 دستورالعمل نصب و راه‌اندازی

## نصب Dependencies جدید

پس از اعمال بهبودها، این package های جدید را نصب کنید:

### 1️⃣ Testing Dependencies (ضروری)

```bash
npm install --save-dev jest jest-environment-jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

### 2️⃣ Email Service (اختیاری - یکی را انتخاب کنید)

**گزینه 1: Resend (توصیه می‌شود)**
```bash
npm install resend
```

**گزینه 2: SendGrid**
```bash
npm install @sendgrid/mail
```

**گزینه 3: Mailgun**
```bash
npm install mailgun.js form-data
```

### 3️⃣ Monitoring (توصیه می‌شود)

**Sentry برای Error Tracking**
```bash
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

### 4️⃣ نصب همه به صورت یکجا

```bash
# نصب تمام dependencies ضروری
npm install

# نصب testing dependencies
npm install --save-dev jest jest-environment-jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event

# اختیاری: Email service
npm install resend

# اختیاری: Monitoring
npm install @sentry/nextjs
```

---

## تنظیمات متغیرهای محیطی

### فایل `.env.local` را ایجاد کنید:

```bash
cp env.template .env.local
```

### متغیرهای ضروری:

```env
# MongoDB (ضروری)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/webrayan

# NextAuth (ضروری)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-super-secret-key-minimum-32-characters

# Admin Email (اختیاری)
ADMIN_EMAIL=admin@webrayandev.ir

# Node Environment
NODE_ENV=development
```

### متغیرهای اختیاری (توصیه می‌شود):

```env
# Upstash Redis (برای Rate Limiting در Production)
UPSTASH_REDIS_REST_URL=https://your-redis-url.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-redis-token

# Email Service (Resend)
RESEND_API_KEY=re_your_api_key

# Google Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# OAuth (اختیاری)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
```

---

## تولید NEXTAUTH_SECRET

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

یا از این سایت استفاده کنید:
https://generate-secret.vercel.app/32

---

## بررسی نصب

### 1. بررسی Dependencies

```bash
npm list jest
npm list zod
npm list next
```

### 2. اجرای تست‌ها

```bash
npm test
```

باید خروجی مشابه این را ببینید:
```
 PASS  __tests__/lib/logger.test.js
 PASS  __tests__/lib/validation.test.js

Test Suites: 2 passed, 2 total
Tests:       20 passed, 20 total
```

### 3. بررسی Linter

```bash
npm run lint
```

### 4. اجرای Development Server

```bash
npm run dev
```

و مراجعه به: http://localhost:3000

---

## مشکلات رایج و راه‌حل

### مشکل 1: خطای MongoDB Connection

```
❌ خطا در اتصال به MongoDB
```

**راه‌حل**:
- بررسی کنید `MONGODB_URI` در `.env.local` درست است
- IP خود را به MongoDB Atlas اضافه کنید
- بررسی کنید password در URI escape شده باشد

### مشکل 2: خطای NEXTAUTH_SECRET

```
NEXTAUTH_SECRET باید حداقل 32 کاراکتر باشد
```

**راه‌حل**:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```
و نتیجه را در `.env.local` قرار دهید

### مشکل 3: خطای Jest

```
Cannot find module 'jest-environment-jsdom'
```

**راه‌حل**:
```bash
npm install --save-dev jest-environment-jsdom
```

### مشکل 4: Warning در Rate Limiting

```
⚠️ PRODUCTION WARNING: استفاده از Memory-based Rate Limiting!
```

**راه‌حل**:
این warning عادی است در development. برای production:
1. ثبت‌نام در Upstash: https://upstash.com
2. ایجاد Redis Database
3. اضافه کردن credentials به `.env.local`

### مشکل 5: Email ارسال نمی‌شود

```
Email service not configured
```

**راه‌حل**:
این طبیعی است. Email service آماده است اما باید یک provider را فعال کنید:
1. ثبت‌نام در Resend: https://resend.com
2. دریافت API Key
3. اضافه کردن به `.env.local`:
```env
RESEND_API_KEY=re_your_api_key
```

---

## فعال‌سازی Email Service

### گزینه 1: Resend (ساده‌ترین)

1. ثبت‌نام در https://resend.com
2. دریافت API Key
3. اضافه کردن به `.env.local`:
```env
RESEND_API_KEY=re_your_api_key
```

4. بروزرسانی `lib/email.js`:
```javascript
// Uncomment این خطوط:
const { Resend } = await import('resend');
const resend = new Resend(process.env.RESEND_API_KEY);
// ... کد ارسال ایمیل
```

### گزینه 2: SendGrid

1. ثبت‌نام در https://sendgrid.com
2. دریافت API Key
3. نصب package:
```bash
npm install @sendgrid/mail
```

4. استفاده در `lib/email.js`:
```javascript
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
```

---

## راه‌اندازی Redis (Production)

### استفاده از Upstash (رایگان)

1. ثبت‌نام در https://console.upstash.com
2. ایجاد Redis Database
3. کپی کردن REST URL و Token
4. اضافه کردن به `.env.local`:
```env
UPSTASH_REDIS_REST_URL=https://your-redis.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-token
```

5. Rate Limiter خودکار از Redis استفاده می‌کند

---

## بررسی نهایی

### Checklist قبل از Deploy:

- [ ] تمام dependencies نصب شده
- [ ] `.env.local` با تمام متغیرهای ضروری
- [ ] `npm test` بدون خطا اجرا می‌شود
- [ ] `npm run build` موفقیت‌آمیز است
- [ ] MongoDB connection کار می‌کند
- [ ] Redis برای production پیکربندی شده (Upstash)
- [ ] Email service فعال است (اختیاری)
- [ ] Sentry نصب شده (توصیه می‌شود)
- [ ] متغیرهای production در platform deploy تنظیم شده

---

## دستورات مفید

```bash
# Development
npm run dev

# Testing
npm test
npm run test:watch
npm run test:coverage

# Build
npm run build

# Production
npm start

# Linting & Formatting
npm run lint
npm run lint:fix
npm run format

# Clean
npm run clean
```

---

## مستندات بیشتر

- [README.testing.md](./README.testing.md) - راهنمای Testing
- [IMPROVEMENTS.md](./IMPROVEMENTS.md) - خلاصه بهبودها
- [env.template](./env.template) - نمونه متغیرهای محیطی

---

## پشتیبانی

در صورت بروز مشکل:
1. بررسی کنید تمام dependencies نصب شده باشند
2. `.env.local` را بررسی کنید
3. `npm run clean` و سپس `npm install`
4. لاگ‌های console را بررسی کنید

---

**موفق باشید!** 🚀

