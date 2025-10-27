'use client';

import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { USER_ROLES, hasPermission, isAdmin } from '@/lib/auth-utils';
import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';

export default function DashboardClient({ session }) {
  const router = useRouter();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = event => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Helper functions for role checking
  const userRole = session?.user?.role || USER_ROLES.USER;
  const canManageUsers = hasPermission(userRole, 'manage_users');
  const canViewAnalytics = hasPermission(userRole, 'view_analytics');
  const canManageContent = hasPermission(userRole, 'manage_content');
  const isUserAdmin = isAdmin(userRole);

  const handleSignOut = async () => {
    await signOut({
      callbackUrl: '/',
      redirect: true,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Header Section */}
      <div
        className="relative bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 text-white"
        style={{ overflow: 'visible' }}
      >
        <div className="absolute inset-0 opacity-10 overflow-hidden">
          <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-yellow-300 to-orange-300 rounded-full mix-blend-multiply filter blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-cyan-300 to-blue-300 rounded-full mix-blend-multiply filter blur-3xl transform translate-x-1/2 translate-y-1/2"></div>
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10">
          <div className="flex justify-between items-center">
            {/* Right Side - Welcome Message */}
            <div>
              <h1 className="text-2xl font-bold text-white">
                <span className="text-cyan-300">
                  {session?.user?.name || 'کاربر عزیز'}
                </span>{' '}
                عزیز به وب رایان خوش آمدید! 👋
              </h1>
              <p className="text-sm text-blue-100 mt-1">
                امیدوارم روز خوبی داشته باشید
              </p>
            </div>

            {/* Left Side - User Menu */}
            <div className="flex items-center gap-3">
              {/* Admin Panel Button */}
              {isUserAdmin && (
                <Link
                  href="/admin"
                  className="px-4 py-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl text-white font-medium transition-all duration-300 flex items-center gap-2 border border-white/20 hover:border-white/40"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span>پنل مدیریت</span>
                </Link>
              )}

              {/* User Dropdown Menu */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 backdrop-blur-sm transition-all duration-300 border border-white/20 hover:border-white/40"
                >
                  <div className="text-center">
                    <p className="text-sm font-medium text-white">
                      {session?.user?.name || 'کاربر'}
                    </p>
                    <p className="text-xs text-white/80 font-medium">
                      {session?.user?.email}
                    </p>
                  </div>
                  <div className="w-11 h-11 bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-sm rounded-full flex items-center justify-center text-white font-bold text-lg border-2 border-white/30 shadow-lg">
                    {(session?.user?.name || 'کاربر').charAt(0).toUpperCase()}
                  </div>
                  <svg
                    className={`w-5 h-5 text-white transition-transform duration-300 ${showDropdown ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {showDropdown && (
                  <div
                    className="absolute left-0 mt-3 w-full bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden animate-fade-in"
                    style={{ zIndex: 9999 }}
                  >
                    {/* User Info Header */}
                    <div className="bg-gradient-to-br from-blue-600 to-indigo-700 px-4 py-4">
                      <div className="flex flex-col items-center gap-3 text-center">
                        <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white font-bold text-2xl border-2 border-white/40 shadow-lg">
                          {(session?.user?.name || 'کاربر')
                            .charAt(0)
                            .toUpperCase()}
                        </div>
                        <div className="w-full min-w-0">
                          <p className="text-white font-semibold text-base truncate">
                            {session?.user?.name || 'کاربر'}
                          </p>
                          <p className="text-white/80 text-xs truncate mt-1">
                            {session?.user?.email}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="py-2">
                      <Link
                        href="/dashboard/edit-profile"
                        className="w-full px-4 py-3 text-right hover:bg-blue-50 transition-all duration-200 flex items-center gap-3 text-blue-900 group"
                        onClick={() => setShowDropdown(false)}
                      >
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                          <svg
                            className="w-4 h-4 text-blue-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </div>
                        <span className="font-medium">ویرایش پروفایل</span>
                      </Link>

                      <div className="border-t border-gray-100 my-2 mx-3"></div>

                      <button
                        onClick={handleSignOut}
                        className="w-full px-4 py-3 text-right hover:bg-red-50 transition-all duration-200 flex items-center gap-3 text-red-600 group"
                      >
                        <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center group-hover:bg-red-200 transition-colors">
                          <svg
                            className="w-4 h-4 text-red-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                            />
                          </svg>
                        </div>
                        <span className="font-medium">خروج از حساب</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Actions Grid - Centered */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {/* درخواست طراحی سایت */}
          <div className="standard-card w-full">
            <div className="p-6 text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-3xl">🌐</span>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-blue-900 mb-2">
                درخواست طراحی سایت
              </h3>
              <p className="text-blue-700 mb-4 text-sm">
                سفارش طراحی و توسعه وب‌سایت حرفه‌ای و اختصاصی
              </p>
              <Link
                href="/contact"
                className="btn-primary-sm inline-flex items-center justify-center w-full"
              >
                ثبت درخواست
                <span className="mr-2">←</span>
              </Link>
            </div>
          </div>

          {/* درخواست داشبورد و پنل ادمین */}
          <div className="standard-card w-full">
            <div className="p-6 text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center">
                  <span className="text-3xl">📊</span>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-blue-900 mb-2">
                درخواست داشبورد و پنل ادمین
              </h3>
              <p className="text-blue-700 mb-4 text-sm">
                ساخت پنل مدیریت قدرتمند برای کسب و کار شما
              </p>
              <Link
                href="/contact"
                className="btn-primary-sm inline-flex items-center justify-center w-full"
              >
                ثبت درخواست
                <span className="mr-2">←</span>
              </Link>
            </div>
          </div>

          {/* درخواست چت بات تلگرام و سایت */}
          <div className="standard-card w-full">
            <div className="p-6 text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-3xl">🤖</span>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-blue-900 mb-2">
                درخواست چت بات تلگرام و سایت
              </h3>
              <p className="text-blue-700 mb-4 text-sm">
                توسعه ربات هوشمند برای پاسخگویی خودکار
              </p>
              <Link
                href="/contact"
                className="btn-primary-sm inline-flex items-center justify-center w-full"
              >
                ثبت درخواست
                <span className="mr-2">←</span>
              </Link>
            </div>
          </div>

          {/* درخواست لندینگ پیج */}
          <div className="standard-card w-full">
            <div className="p-6 text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-orange-100 rounded-lg flex items-center justify-center">
                  <span className="text-3xl">🚀</span>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-blue-900 mb-2">
                درخواست لندینگ پیج
              </h3>
              <p className="text-blue-700 mb-4 text-sm">
                صفحه فرود حرفه‌ای برای افزایش نرخ تبدیل
              </p>
              <Link
                href="/contact"
                className="btn-primary-sm inline-flex items-center justify-center w-full"
              >
                ثبت درخواست
                <span className="mr-2">←</span>
              </Link>
            </div>
          </div>

          {/* نمونه کارها */}
          <div className="standard-card w-full">
            <div className="p-6 text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <span className="text-3xl">📁</span>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-blue-900 mb-2">
                نمونه کارها
              </h3>
              <p className="text-blue-700 mb-4 text-sm">
                مشاهده آخرین پروژه‌های انجام شده ما
              </p>
              <Link
                href="/portfolio"
                className="btn-primary-sm inline-flex items-center justify-center w-full"
              >
                مشاهده پروژه‌ها
                <span className="mr-2">←</span>
              </Link>
            </div>
          </div>

          {/* تماس با ما */}
          <div className="standard-card w-full">
            <div className="p-6 text-center">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-pink-100 rounded-lg flex items-center justify-center">
                  <span className="text-3xl">📞</span>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-blue-900 mb-2">
                تماس با ما
              </h3>
              <p className="text-blue-700 mb-4 text-sm">
                ارتباط مستقیم با تیم پشتیبانی و مشاوره
              </p>
              <Link
                href="/contact"
                className="btn-primary-sm inline-flex items-center justify-center w-full"
              >
                فرم تماس
                <span className="mr-2">←</span>
              </Link>
            </div>
          </div>

          {/* Content Management - For Content Managers */}
          {canManageContent && (
            <div className="standard-card border-l-4 border-yellow-500 w-full">
              <div className="p-6 text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <span className="text-3xl">📝</span>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-blue-900 mb-2">
                  مدیریت محتوا
                </h3>
                <p className="text-blue-700 mb-4 text-sm">
                  ویرایش پروژه‌ها و محتوای سایت
                </p>
                <button
                  disabled
                  className="inline-flex items-center justify-center px-4 py-2 bg-gray-400 text-white rounded-lg cursor-not-allowed w-full"
                >
                  به زودی
                  <span className="mr-2">⏳</span>
                </button>
              </div>
            </div>
          )}

          {/* Analytics - For Analytics Viewers */}
          {canViewAnalytics && (
            <div className="standard-card border-l-4 border-cyan-500 w-full">
              <div className="p-6 text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-cyan-100 rounded-lg flex items-center justify-center">
                    <span className="text-3xl">📈</span>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-blue-900 mb-2">
                  آمار و گزارشات
                </h3>
                <p className="text-blue-700 mb-4 text-sm">
                  مشاهده آمار بازدید و عملکرد سایت
                </p>
                <button
                  disabled
                  className="inline-flex items-center justify-center px-4 py-2 bg-gray-400 text-white rounded-lg cursor-not-allowed w-full"
                >
                  به زودی
                  <span className="mr-2">⏳</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="mt-8 standard-card">
          <div className="standard-card-content">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">
              فعالیت‌های اخیر
            </h3>
            <div className="text-center py-8">
              <span className="text-4xl mb-4 block">📋</span>
              <p className="text-blue-700">هنوز فعالیتی ثبت نشده است</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
