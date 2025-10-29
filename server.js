// Import core modules
const next = require('next');
const http = require('http');

// تنظیم اینکه اپ در حالت production اجرا بشه
const app = next({ dev: false });
const handle = app.getRequestHandler();

// آماده‌سازی اپ
app.prepare().then(() => {
  // ایجاد سرور HTTP ساده برای هندل کردن درخواست‌ها
  http.createServer((req, res) => {
    handle(req, res);
  }).listen(3000, () => {
    console.log('✅ Next.js app running on port 3000');
  });
});
