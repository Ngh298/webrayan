'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Fetch users from API
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mb-4"></div>
          <p className="text-xl font-semibold text-blue-900">
            در حال بارگذاری کاربران...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-blue-900 mb-2">
              👥 مدیریت کاربران
            </h1>
            <p className="text-blue-700">مشاهده و مدیریت کاربران ثبت‌نام شده</p>
          </div>
          <Link
            href="/admin"
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-2xl hover:from-indigo-600 hover:to-blue-500 transition-all duration-300 shadow-lg hover:shadow-xl font-semibold transform hover:scale-105"
          >
            بازگشت به داشبورد
          </Link>
        </div>

        {/* Search and Filter */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-blue-100 mb-8">
          <div className="flex gap-4">
            <input
              type="text"
              placeholder="جستجوی کاربر..."
              className="flex-1 px-6 py-3 border-2 border-blue-200 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none text-blue-900 font-semibold"
            />
            <button className="px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-2xl hover:from-blue-600 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl font-semibold">
              جستجو
            </button>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-blue-100">
          <h2 className="text-2xl font-bold text-blue-900 mb-6 flex items-center gap-3">
            <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
            لیست کاربران
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
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
            <p className="text-xl font-bold text-blue-800 mb-2">در حال توسعه</p>
            <p className="text-base text-blue-600 mb-6">
              این بخش به زودی فعال خواهد شد
            </p>
            <Link
              href="/admin/tools"
              className="inline-block px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-2xl hover:from-blue-600 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl font-semibold"
            >
              ابزارهای مدیریتی
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
