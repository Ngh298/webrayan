'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function AdminPortfolioPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-blue-900 mb-2">
              📁 مدیریت پروژه‌ها
            </h1>
            <p className="text-blue-700">افزودن، ویرایش و مدیریت نمونه کارها</p>
          </div>
          <Link
            href="/admin"
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-2xl hover:from-indigo-600 hover:to-blue-500 transition-all duration-300 shadow-lg hover:shadow-xl font-semibold transform hover:scale-105"
          >
            بازگشت به داشبورد
          </Link>
        </div>

        {/* Add New Project Button */}
        <div className="mb-8">
          <button className="px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-2xl hover:from-blue-600 hover:to-indigo-700 transition-all shadow-xl hover:shadow-2xl font-bold text-lg transform hover:scale-105">
            ➕ افزودن پروژه جدید
          </button>
        </div>

        {/* Projects Grid */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-blue-100">
          <h2 className="text-2xl font-bold text-blue-900 mb-6 flex items-center gap-3">
            <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
            لیست پروژه‌ها
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
                d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <p className="text-xl font-bold text-blue-800 mb-2">
              هنوز پروژه‌ای ثبت نشده
            </p>
            <p className="text-base text-blue-600">
              برای شروع، پروژه جدید اضافه کنید
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
