'use client';

import Link from 'next/link';

export default function AuthButton() {
  return (
    <div className="flex items-center gap-3">
      <Link
        href="/auth/signin"
        className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-5 py-2 rounded-lg font-bold text-base transition-all duration-300 hover:from-cyan-500 hover:to-blue-500"
        style={{
          fontFamily: 'Vazirmatn, sans-serif',
        }}
      >
        ورود / ثبت‌نام
      </Link>
    </div>
  );
}
