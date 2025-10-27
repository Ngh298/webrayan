'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

/**
 * پنل مدیریت مدرن با Sidebar
 * طراحی حرفه‌ای و جذاب
 */
export default function AdminDashboard() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [stats, setStats] = useState({
    projects: 0,
    messages: 0,
    users: 0,
  });
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleSignOut = async () => {
    await signOut({
      callbackUrl: '/',
      redirect: true,
    });
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/admin/stats');
        console.log('📡 Stats API Response Status:', response.status);

        const data = await response.json();
        console.log('📦 Stats API Response Data:', data);

        if (data.success && data.stats) {
          setStats({
            projects: data.stats.projects || 0,
            messages: data.stats.messages || 0,
            users: data.stats.users || 0,
          });
          console.log('✅ Stats loaded:', data.stats);
        } else {
          console.error('❌ Stats API returned error:', data);
          console.error('Response status was:', response.status);
        }
      } catch (error) {
        console.error('❌ Error fetching admin stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // منوهای Sidebar
  const menuItems = [
    {
      id: 'dashboard',
      title: 'داشبورد',
      icon: '📊',
      link: '/admin',
      badge: null,
    },
    {
      id: 'portfolio',
      title: 'مدیریت پروژه‌ها',
      icon: '📁',
      link: '/admin/portfolio',
      badge: stats.projects,
    },
    {
      id: 'messages',
      title: 'پیام‌های تماس',
      icon: '💬',
      link: '/admin/messages',
      badge: stats.messages,
    },
    {
      id: 'users',
      title: 'مدیریت کاربران',
      icon: '👥',
      link: '/admin/users',
      badge: stats.users,
    },
    {
      id: 'analytics',
      title: 'آمار و گزارشات',
      icon: '📈',
      link: '/admin/analytics',
      badge: null,
    },
    {
      id: 'settings',
      title: 'تنظیمات سایت',
      icon: '⚙️',
      link: '/admin/settings',
      badge: null,
    },
    {
      id: 'tools',
      title: 'ابزارهای مدیریتی',
      icon: '🛠️',
      link: '/admin/tools',
      badge: null,
    },
  ];

  // اگر در حال loading است، صفحه کامل loading نمایش بده
  if (loading) {
    return (
      <div className="fixed inset-0 bg-gray-50 flex items-center justify-center z-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mb-4"></div>
          <p className="text-xl font-semibold text-blue-900">
            در حال بارگذاری پنل مدیریت...
          </p>
          <p className="text-sm text-blue-700 mt-2">لطفاً صبر کنید</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      {/* Top Header - Hero Style */}
      <header className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white sticky top-0 z-40 shadow-xl">
        <div className="flex items-center justify-between px-6 py-5">
          {/* Right Side - Logo & Menu Toggle */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-white/10 rounded-xl transition-all backdrop-blur-sm"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-lg border border-white/30">
                <span className="text-2xl">👑</span>
              </div>
              <div>
                <h1 className="text-xl font-bold">پنل مدیریت</h1>
                <p className="text-xs text-blue-100">به پنل مدیریت خوش آمدید</p>
              </div>
            </div>
          </div>

          {/* Left Side - User Info */}
          <div className="flex items-center gap-3 px-4 py-2.5 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
            <div className="text-right">
              <p className="text-sm font-semibold">
                {session?.user?.name || 'مدیر'}
              </p>
              <p className="text-xs text-blue-100">{session?.user?.email}</p>
            </div>
            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center font-bold border-2 border-white/40 shadow-lg">
              {(session?.user?.name || 'م').charAt(0).toUpperCase()}
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`${
            sidebarOpen ? 'w-80' : 'w-0'
          } bg-white/80 backdrop-blur-xl border-l border-blue-100 transition-all duration-300 overflow-hidden sticky top-[81px] h-[calc(100vh-81px)] shadow-lg`}
        >
          <div className="p-6">
            {/* Stats Overview */}
            <div className="mb-8 space-y-3">
              <h3 className="text-xs font-bold text-blue-600 uppercase tracking-wider px-2 flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                آمار کلی
              </h3>
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-gradient-to-br from-blue-100 to-indigo-200 p-4 rounded-2xl text-center shadow-md hover:shadow-lg transition-all hover:scale-105">
                  <div className="text-2xl font-bold text-blue-700">
                    {stats.users}
                  </div>
                  <div className="text-xs mt-1 text-blue-600">کاربران</div>
                </div>
                <div className="bg-gradient-to-br from-green-100 to-emerald-200 p-4 rounded-2xl text-center shadow-md hover:shadow-lg transition-all hover:scale-105">
                  <div className="text-2xl font-bold text-green-700">
                    {stats.messages}
                  </div>
                  <div className="text-xs mt-1 text-green-600">پیام‌ها</div>
                </div>
                <div className="bg-gradient-to-br from-purple-100 to-pink-200 p-4 rounded-2xl text-center shadow-md hover:shadow-lg transition-all hover:scale-105">
                  <div className="text-2xl font-bold text-purple-700">
                    {stats.projects}
                  </div>
                  <div className="text-xs mt-1 text-purple-600">پروژه‌ها</div>
                </div>
              </div>
            </div>

            {/* Navigation Menu */}
            <nav className="space-y-2">
              <h3 className="text-xs font-bold text-blue-600 uppercase tracking-wider px-2 mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                منوی اصلی
              </h3>
              {menuItems.map(item => {
                const isActive = pathname === item.link;
                return (
                  <Link
                    key={item.id}
                    href={item.link}
                    className={`flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-300 group ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-xl shadow-blue-500/40 scale-105'
                        : 'hover:bg-blue-50 text-blue-700 hover:text-blue-900 hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl transform group-hover:scale-125 transition-transform duration-300">
                        {item.icon}
                      </span>
                      <span className="font-semibold text-sm">
                        {item.title}
                      </span>
                    </div>
                    {item.badge !== null && item.badge > 0 && (
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-bold shadow-sm ${
                          isActive
                            ? 'bg-white/20 text-white'
                            : 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Logout Button */}
            <div className="mt-8 pt-6 border-t border-blue-100">
              <button
                onClick={handleSignOut}
                className="w-full flex items-center justify-center gap-2 px-4 py-3.5 bg-gradient-to-r from-red-500 to-pink-600 text-white hover:from-red-600 hover:to-pink-700 rounded-2xl transition-all font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
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
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                <span>خروج از حساب</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {/* Welcome Section */}
          <div className="mb-10">
            <h2 className="text-4xl font-bold text-blue-900 mb-3">
              سلام، {session?.user?.name || 'مدیر'}! 👋
            </h2>
            <p className="text-lg text-blue-700">
              خوش آمدید به پنل مدیریت. آماده کار هستید؟
            </p>
          </div>

          {/* Quick Actions */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-blue-100">
            <h3 className="text-2xl font-bold text-blue-900 mb-6 flex items-center gap-3">
              <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
              دسترسی سریع
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <Link
                href="/admin/portfolio"
                className="flex flex-col items-center justify-center p-8 bg-gradient-to-br from-blue-50 to-indigo-100 hover:from-blue-100 hover:to-indigo-200 rounded-3xl transition-all transform hover:scale-110 hover:shadow-2xl border-2 border-blue-200 hover:border-blue-400"
              >
                <span className="text-5xl mb-3">➕</span>
                <span className="text-sm font-bold text-blue-900">
                  افزودن پروژه
                </span>
              </Link>
              <Link
                href="/admin/messages"
                className="flex flex-col items-center justify-center p-8 bg-gradient-to-br from-green-50 to-emerald-100 hover:from-green-100 hover:to-emerald-200 rounded-3xl transition-all transform hover:scale-110 hover:shadow-2xl border-2 border-green-200 hover:border-green-400"
              >
                <span className="text-5xl mb-3">📬</span>
                <span className="text-sm font-bold text-green-900">
                  مشاهده پیام‌ها
                </span>
              </Link>
              <Link
                href="/admin/users"
                className="flex flex-col items-center justify-center p-8 bg-gradient-to-br from-purple-50 to-pink-100 hover:from-purple-100 hover:to-pink-200 rounded-3xl transition-all transform hover:scale-110 hover:shadow-2xl border-2 border-purple-200 hover:border-purple-400"
              >
                <span className="text-5xl mb-3">👤</span>
                <span className="text-sm font-bold text-purple-900">
                  مدیریت کاربران
                </span>
              </Link>
              <Link
                href="/admin/settings"
                className="flex flex-col items-center justify-center p-8 bg-gradient-to-br from-orange-50 to-amber-100 hover:from-orange-100 hover:to-amber-200 rounded-3xl transition-all transform hover:scale-110 hover:shadow-2xl border-2 border-orange-200 hover:border-orange-400"
              >
                <span className="text-5xl mb-3">⚙️</span>
                <span className="text-sm font-bold text-orange-900">
                  تنظیمات
                </span>
              </Link>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="mt-8 bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-blue-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-blue-900 flex items-center gap-3">
                <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
                آخرین فعالیت‌ها
              </h3>
              <span className="text-sm font-semibold text-blue-600 bg-blue-100 px-4 py-2 rounded-full">
                امروز
              </span>
            </div>
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
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              <p className="text-xl font-bold text-blue-800 mb-2">
                هنوز فعالیتی ثبت نشده
              </p>
              <p className="text-base text-blue-600">
                فعالیت‌های اخیر اینجا نمایش داده می‌شوند
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
