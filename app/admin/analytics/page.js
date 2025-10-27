'use client';

import Link from 'next/link';

export default function AdminAnalyticsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-blue-900 mb-2">
              📈 آمار و گزارشات
            </h1>
            <p className="text-blue-700">مشاهده آمار بازدید و عملکرد سایت</p>
          </div>
          <Link
            href="/admin"
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-2xl hover:from-indigo-600 hover:to-blue-500 transition-all duration-300 shadow-lg hover:shadow-xl font-semibold transform hover:scale-105"
          >
            بازگشت به داشبورد
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-100 to-indigo-200 p-6 rounded-2xl shadow-lg">
            <div className="text-3xl font-bold text-blue-700 mb-2">-</div>
            <div className="text-sm text-blue-600">بازدیدکنندگان امروز</div>
          </div>
          <div className="bg-gradient-to-br from-green-100 to-emerald-200 p-6 rounded-2xl shadow-lg">
            <div className="text-3xl font-bold text-green-700 mb-2">-</div>
            <div className="text-sm text-green-600">بازدید این ماه</div>
          </div>
          <div className="bg-gradient-to-br from-purple-100 to-pink-200 p-6 rounded-2xl shadow-lg">
            <div className="text-3xl font-bold text-purple-700 mb-2">-</div>
            <div className="text-sm text-purple-600">کل بازدیدها</div>
          </div>
          <div className="bg-gradient-to-br from-orange-100 to-amber-200 p-6 rounded-2xl shadow-lg">
            <div className="text-3xl font-bold text-orange-700 mb-2">-</div>
            <div className="text-sm text-orange-600">نرخ بازگشت</div>
          </div>
        </div>

        {/* Analytics Content */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-blue-100">
          <h2 className="text-2xl font-bold text-blue-900 mb-6 flex items-center gap-3">
            <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
            گزارشات تحلیلی
          </h2>

          <div className="text-center py-16 text-blue-600">
            <svg
              className="w-20 h-20 mx-auto mb-6 text-blue-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            <p className="text-xl font-bold text-blue-800 mb-2">در حال توسعه</p>
            <p className="text-base text-blue-600 mb-6">
              برای فعال‌سازی آمار، Google Analytics را پیکربندی کنید
            </p>
            <div className="max-w-md mx-auto bg-blue-50 rounded-2xl p-6 text-right">
              <h3 className="font-bold text-blue-900 mb-3">راهنما:</h3>
              <ol className="text-sm text-blue-700 space-y-2">
                <li>1. کد Google Analytics را دریافت کنید</li>
                <li>2. در فایل .env.local تنظیم کنید</li>
                <li>3. سایت را rebuild کنید</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
