#!/usr/bin/env node

/**
 * 🚀 Production Preparation Script
 * آماده‌سازی خودکار پروژه برای Deploy
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

console.log('\n🚀 شروع آماده‌سازی برای Production...\n');

// Colors
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[36m',
};

function log(message, color = colors.reset) {
  console.log(color + message + colors.reset);
}

function generateSecret() {
  return crypto.randomBytes(32).toString('base64');
}

// چک کردن فایل‌های ضروری
function checkRequiredFiles() {
  log('📋 بررسی فایل‌های ضروری...', colors.blue);

  const requiredFiles = [
    'package.json',
    'next.config.js',
    'app/layout.js',
    'middleware.js',
  ];

  let allExist = true;

  requiredFiles.forEach(file => {
    const filePath = path.join(process.cwd(), file);
    if (fs.existsSync(filePath)) {
      log(`  ✅ ${file}`, colors.green);
    } else {
      log(`  ❌ ${file} یافت نشد!`, colors.red);
      allExist = false;
    }
  });

  return allExist;
}

// تولید فایل .env.production
function generateEnvProduction() {
  log('\n🔐 تولید فایل .env.production...', colors.blue);

  const envPath = path.join(process.cwd(), '.env.production');

  if (fs.existsSync(envPath)) {
    log('  ⚠️  فایل .env.production از قبل وجود دارد', colors.yellow);
    log('  💡 برای ساخت فایل جدید، ابتدا فایل قبلی را حذف کنید', colors.yellow);
    return;
  }

  const secret = generateSecret();

  const envContent = `# ===============================================
# 🔐 Production Environment Variables
# Generated: ${new Date().toISOString()}
# ===============================================

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/webrayan?retryWrites=true&w=majority

# NextAuth
NEXTAUTH_URL=https://webrayandev.ir
NEXTAUTH_SECRET=${secret}

# Google OAuth (اختیاری)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# GitHub OAuth (اختیاری)
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# Upstash Redis (اختیاری)
UPSTASH_REDIS_REST_URL=https://your-redis-url
UPSTASH_REDIS_REST_TOKEN=your-redis-token

# Admin
ADMIN_EMAIL=admin@webrayandev.ir

# Environment
NODE_ENV=production

# ===============================================
# ⚠️ IMPORTANT:
# 1. این فایل را هرگز commit نکنید
# 2. MONGODB_URI را با connection string واقعی جایگزین کنید
# 3. OAuth credentials را (در صورت نیاز) تنظیم کنید
# ===============================================
`;

  fs.writeFileSync(envPath, envContent);
  log('  ✅ فایل .env.production ساخته شد', colors.green);
  log(`  🔑 NEXTAUTH_SECRET: ${secret}`, colors.yellow);
  log('  💾 این secret را در جای امنی ذخیره کنید', colors.yellow);
}

// چک کردن Dependencies
function checkDependencies() {
  log('\n📦 بررسی Dependencies...', colors.blue);

  const packageJsonPath = path.join(process.cwd(), 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

  const requiredDeps = [
    'next',
    'react',
    'react-dom',
    'mongodb',
    'mongoose',
    'next-auth',
  ];

  let allInstalled = true;

  requiredDeps.forEach(dep => {
    if (packageJson.dependencies[dep]) {
      log(`  ✅ ${dep}`, colors.green);
    } else {
      log(`  ❌ ${dep} نصب نیست`, colors.red);
      allInstalled = false;
    }
  });

  return allInstalled;
}

// تولید checklist
function generateChecklist() {
  log('\n📝 تولید Production Checklist...', colors.blue);

  const checklistPath = path.join(process.cwd(), 'PRODUCTION_CHECKLIST.txt');

  const checklist = `
🚀 PRODUCTION DEPLOYMENT CHECKLIST - webrayandev.ir
====================================================

پیش از Deploy:
--------------
[ ] Build موفق اجرا شد: npm run build
[ ] تمام تست‌ها پاس شدند
[ ] .env.production ساخته شد
[ ] MONGODB_URI تنظیم شد
[ ] NEXTAUTH_SECRET تولید شد
[ ] ADMIN_EMAIL تنظیم شد
[ ] فایل‌های .env در .gitignore هستند

Database:
---------
[ ] MongoDB Atlas cluster ساخته شد
[ ] Database User با username/password ساخته شد
[ ] Network Access: 0.0.0.0/0 تنظیم شد
[ ] Connection String کپی شد

Deployment Platform:
-------------------
[ ] Vercel/Railway account ساخته شد
[ ] پروژه import شد
[ ] Environment Variables تنظیم شدند
[ ] Build موفق بود
[ ] سایت باز می‌شود

Domain Configuration:
--------------------
[ ] Custom domain اضافه شد
[ ] DNS records تنظیم شدند
[ ] SSL certificate فعال شد
[ ] www redirect کار می‌کند

Post-Deploy Testing:
-------------------
[ ] صفحه اصلی لود می‌شود
[ ] API Health Check: /api/health
[ ] Admin registration کار می‌کند
[ ] Admin panel دسترسی دارد
[ ] فرم تماس submit می‌شود
[ ] Mobile responsive است

Security:
---------
[ ] HTTPS فعال است
[ ] Security headers تنظیم شدند
[ ] Rate limiting کار می‌کند
[ ] Admin access محدود است

SEO:
----
[ ] Sitemap در دسترس است: /sitemap.xml
[ ] Robots.txt کار می‌کند: /robots.txt
[ ] Meta tags تنظیم شدند
[ ] Google Search Console تنظیم شد

تاریخ: ${new Date().toLocaleDateString('fa-IR')}
====================================================
`;

  fs.writeFileSync(checklistPath, checklist);
  log('  ✅ فایل PRODUCTION_CHECKLIST.txt ساخته شد', colors.green);
}

// نمایش دستورات بعدی
function showNextSteps() {
  log('\n📋 مراحل بعدی:', colors.blue);
  log('\n1️⃣  ویرایش فایل .env.production:', colors.yellow);
  log('   - MONGODB_URI را با connection string واقعی جایگزین کنید');
  log('   - ADMIN_EMAIL را تنظیم کنید');
  log('   - OAuth credentials (در صورت نیاز) اضافه کنید');

  log('\n2️⃣  تست Build:', colors.yellow);
  log('   npm run build');

  log('\n3️⃣  Deploy:', colors.yellow);
  log('   روش A) Vercel:');
  log('     npm i -g vercel');
  log('     vercel login');
  log('     vercel --prod');
  log('\n   روش B) Railway:');
  log('     npm i -g @railway/cli');
  log('     railway login');
  log('     railway init');
  log('     railway up');

  log('\n4️⃣  مستندات:', colors.yellow);
  log('   - راهنمای کامل: DEPLOY_WEBRAYANDEV.md');
  log('   - شروع سریع: DEPLOY_QUICK_START.md');
  log('   - Checklist: PRODUCTION_CHECKLIST.txt');

  log('\n✅ آماده برای Deploy هستید!\n', colors.green);
}

// اجرای اسکریپت
async function main() {
  try {
    // بررسی فایل‌ها
    const filesExist = checkRequiredFiles();
    if (!filesExist) {
      log('\n❌ برخی فایل‌های ضروری یافت نشدند', colors.red);
      process.exit(1);
    }

    // بررسی Dependencies
    const depsInstalled = checkDependencies();
    if (!depsInstalled) {
      log('\n❌ برخی dependencies نصب نیستند', colors.red);
      log('اجرا کنید: npm install', colors.yellow);
      process.exit(1);
    }

    // تولید .env.production
    generateEnvProduction();

    // تولید checklist
    generateChecklist();

    // نمایش مراحل بعدی
    showNextSteps();

    log('✨ آماده‌سازی با موفقیت انجام شد!\n', colors.green);
  } catch (error) {
    log(`\n❌ خطا: ${error.message}`, colors.red);
    process.exit(1);
  }
}

main();
