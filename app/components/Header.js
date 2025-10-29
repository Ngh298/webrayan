'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import AuthButton from './AuthButton';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);

  const navigation = [
    { name: 'صفحه اصلی', href: '/' },
    { name: 'خدمات', href: '#', hasSubmenu: true },
    { name: 'نمونه کارها', href: '/portfolio' },
    { name: 'وبلاگ', href: '/blog' },
    { name: 'درباره من', href: '/about' },
    { name: 'ارتباط با من', href: '/contact' },
  ];

  // دسته‌بندی شده انواع وب‌سایت - فقط نمایشی
  const servicesMenu = {
    'خدمات شخصی و کسب‌وکار': [
      { name: 'سایت شخصی', icon: '👤' },
      { name: 'سایت شرکتی', icon: '🏢' },
      { name: 'لندینگ پیج', icon: '🎯' },
      { name: 'داشبورد و پنل ادمین', icon: '📊' },
    ],
    'فروشگاه و تجارت': [
      { name: 'فروشگاه اینترنتی', icon: '🛒' },
      { name: 'سایت رستوران و کافه', icon: '🍽️' },
      { name: 'سایت املاک', icon: '🏠' },
    ],
    'خدمات تخصصی': [
      { name: 'سایت آموزشی', icon: '🎓' },
      { name: 'سایت پزشکی', icon: '🏥' },
      { name: 'سایت حقوقی', icon: '⚖️' },
      { name: 'سایت مالی', icon: '💰' },
    ],
    'فرهنگ و سرگرمی': [
      { name: 'سایت فرهنگی/مذهبی', icon: '🕌' },
      { name: 'سایت گردشگری', icon: '✈️' },
      { name: 'سایت ورزشی', icon: '⚽' },
      { name: 'سایت خبری', icon: '📰' },
    ],
    'فناوری و توسعه': [{ name: 'وب‌اپلیکیشن', icon: '💻' }],
  };

  // تایمرها برای تاخیر باز و بسته شدن مگامنو
  let closeTimer = null;
  let openTimer = null;

  const handleMouseEnter = () => {
    // لغو تایمر بسته شدن
    if (closeTimer) {
      clearTimeout(closeTimer);
      closeTimer = null;
    }

    // اگه منو بسته است، با تاخیر باز کن
    if (!isServicesOpen) {
      openTimer = setTimeout(() => {
        setIsServicesOpen(true);
      }, 200); // تاخیر 200ms برای باز شدن
    }
  };

  const handleMouseLeave = () => {
    // لغو تایمر باز شدن
    if (openTimer) {
      clearTimeout(openTimer);
      openTimer = null;
    }

    // تاخیر برای بسته شدن
    closeTimer = setTimeout(() => {
      setIsServicesOpen(false);
    }, 300); // تاخیر 300ms برای بسته شدن
  };

  return (
    <header className="bg-gradient-to-r from-blue-50 via-white to-indigo-50 shadow-lg border-b border-blue-200 fixed w-full top-0 z-50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* لوگو سمت راست */}
        <div className="flex-shrink-0">
  <Link href="/" className="flex items-center justify-center">
    <div
      className="flex flex-col items-center justify-center text-center
                 bg-gradient-to-r from-blue-500 to-cyan-500 text-white
                 px-4 py-2 rounded-lg font-bold transition-all duration-300
                 hover:scale-105 hover:shadow-lg hover:from-cyan-500 hover:to-blue-500
                 tracking-tight hover:tracking-wide"
      style={{
        fontFamily: "'Inter', 'Vazirmatn', 'SF Pro Display', system-ui",
      }}
    >
      <span className="text-lg leading-snug">WebRayanDev.ir</span>
      <span className="text-xs leading-3 font-bold tracking-wide mt-[2px]">
        خلق جهان از میان صفر و  یک
      </span>
    </div>
  </Link>
</div>


          {/* منوهای اصلی وسط */}
          <div className="hidden lg:flex items-center space-x-6 space-x-reverse rtl:space-x-reverse">
            {navigation.map(item => (
              <div key={item.name} className="relative group">
                {item.hasSubmenu ? (
                  <div
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    className="relative"
                  >
                    <button className="flex items-center text-gray-800 hover:text-white bg-transparent hover:bg-gradient-to-r hover:from-blue-500 hover:to-cyan-500 transition-all duration-300 font-medium text-sm px-4 py-2 rounded-full hover:shadow-md hover:scale-105">
                      {item.name}
                      <svg
                        className={`mr-1 w-4 h-4 transition-transform duration-200 ${isServicesOpen ? 'rotate-180' : ''}`}
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

                    {/* مگامنو - دسته‌بندی شده */}
                    {isServicesOpen && (
                      <div
                        className="absolute top-full right-0 mt-1 w-72 bg-gradient-to-br from-slate-50 via-white to-blue-50 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 py-4 z-50 max-h-[500px] overflow-y-auto animate-in slide-in-from-top-2 duration-200"
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                      >
                        <div className="px-4 space-y-4">
                          {Object.entries(servicesMenu).map(
                            ([category, items]) => (
                              <div key={category} className="space-y-2">
                                <h4 className="text-sm font-bold text-slate-700 px-4 py-3 bg-gradient-to-r from-indigo-100 via-purple-50 to-pink-100 rounded-xl border-r-4 border-indigo-400 shadow-lg relative overflow-hidden">
                                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 opacity-50"></div>
                                  <span className="relative">{category}</span>
                                </h4>
                                <div className="grid grid-cols-1 gap-1">
                                  {items.map(subItem => (
                                    <div
                                      key={subItem.name}
                                      className="flex items-center p-3 text-sm rounded-xl text-gray-700 cursor-pointer hover:bg-gradient-to-r hover:from-rose-50 hover:via-purple-50 hover:to-indigo-50 hover:text-gray-800 hover:shadow-lg hover:shadow-purple-100/50 transition-all duration-300 group hover:scale-[1.02] border border-transparent hover:border-purple-200/30"
                                    >
                                      <span className="text-lg ml-3 group-hover:scale-110 transition-transform duration-300">
                                        {subItem.icon}
                                      </span>
                                      <span>{subItem.name}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    className="text-gray-800 hover:text-white bg-transparent hover:bg-gradient-to-r hover:from-blue-500 hover:to-cyan-500 transition-all duration-300 font-medium text-sm px-4 py-2 rounded-full hover:shadow-md hover:scale-105"
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* دکمه‌های سمت چپ */}
          <div className="flex items-center gap-3">
            {/* دکمه‌های احراز هویت */}
            <AuthButton />
          </div>

          {/* دکمه منوی موبایل */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-600 hover:text-cyan-500 p-2 focus:ring-2 focus:ring-blue-300 focus:outline-none rounded"
              aria-label={isMenuOpen ? 'بستن منو' : 'باز کردن منو'}
              aria-expanded={isMenuOpen}
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
                  d={
                    isMenuOpen
                      ? 'M6 18L18 6M6 6l12 12'
                      : 'M4 6h16M4 12h16M4 18h16'
                  }
                />
              </svg>
            </button>
          </div>
        </div>

        {/* منوی موبایل */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 py-4">
            {navigation.map(item => (
              <div key={item.name} className="mb-1">
                {item.hasSubmenu ? (
                  <>
                    <button
                      onClick={() => setIsServicesOpen(!isServicesOpen)}
                      className="flex items-center justify-between w-full py-3 px-4 text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-cyan-50 hover:text-blue-700 hover:scale-105 font-medium text-sm rounded-lg transition-all duration-300"
                    >
                      {item.name}
                      <svg
                        className={`w-4 h-4 transition-transform ${isServicesOpen ? 'rotate-180' : ''}`}
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

                    {isServicesOpen && (
                      <div className="mr-4 mt-2 space-y-3 bg-white rounded-lg p-3 shadow-lg border max-h-96 overflow-y-auto">
                        {Object.entries(servicesMenu).map(
                          ([category, items]) => (
                            <div key={category} className="space-y-2">
                              <h5 className="text-xs font-bold text-blue-600 px-2 py-1 bg-blue-50 rounded border-r-2 border-blue-400">
                                {category}
                              </h5>
                              <div className="space-y-1">
                                {items.map(subItem => (
                                  <div
                                    key={subItem.name}
                                    className="flex items-center py-2 px-3 text-gray-700 rounded text-sm cursor-default hover:bg-purple-50 hover:text-purple-700 transition-colors duration-200"
                                  >
                                    <span className="ml-2 group-hover:scale-110 transition-transform duration-300">
                                      {subItem.icon}
                                    </span>
                                    {subItem.name}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    href={item.href}
                    className="block py-3 px-4 text-gray-700 hover:bg-blue-50 font-medium text-sm rounded-lg"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}

            <div className="mt-4 px-4 space-y-3">
              <Link
                href="/auth/signin"
                className="block text-center bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-3 rounded-lg font-bold text-sm w-full transition-all duration-300 hover:from-cyan-500 hover:to-blue-500 tracking-tight"
                style={{
                  fontFamily:
                    "'Inter', 'SF Pro Display', system-ui, sans-serif",
                }}
              >
                ورود / ثبت‌نام
              </Link>

              <a
                href="tel:+989166530931"
                className="flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-lg font-medium text-sm w-full"
              >
                <svg
                  className="w-4 h-4 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                تماس با ما
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
