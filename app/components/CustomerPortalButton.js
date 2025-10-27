import Link from 'next/link';

/**
 * کامپوننت دکمه پورتال مشتریان
 * این کامپوننت lazy load می‌شه تا عملکرد بهتر باشه
 */

export default function CustomerPortalButton() {
  return (
    <Link
      href="/customer-portal"
      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-lg font-medium text-sm transition-colors duration-200"
      aria-label="ورود به پورتال مشتریان"
    >
      پورتال مشتریان
    </Link>
  );
}
