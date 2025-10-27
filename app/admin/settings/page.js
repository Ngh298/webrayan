'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    siteName: 'وب‌رایان',
    siteDescription: 'طراحی و توسعه وب حرفه‌ای',
    email: '',
    phone: '',
    address: '',
    socialLinks: {
      telegram: '',
      instagram: '',
      linkedin: '',
      github: '',
    },
  });

  const handleSave = () => {
    // TODO: Save settings
    alert('تنظیمات ذخیره شد');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-blue-900 mb-2">
              ⚙️ تنظیمات سایت
            </h1>
            <p className="text-blue-700">تنظیمات عمومی و پیکربندی سیستم</p>
          </div>
          <Link
            href="/admin"
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-2xl hover:from-indigo-600 hover:to-blue-500 transition-all duration-300 shadow-lg hover:shadow-xl font-semibold transform hover:scale-105"
          >
            بازگشت به داشبورد
          </Link>
        </div>

        {/* Settings Form */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-blue-100">
          <h2 className="text-2xl font-bold text-blue-900 mb-6 flex items-center gap-3">
            <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
            اطلاعات سایت
          </h2>

          <div className="space-y-6 max-w-2xl">
            {/* Site Name */}
            <div>
              <label className="block text-sm font-bold text-blue-900 mb-2">
                نام سایت
              </label>
              <input
                type="text"
                value={settings.siteName}
                onChange={e =>
                  setSettings({ ...settings, siteName: e.target.value })
                }
                className="w-full px-6 py-3 border-2 border-blue-200 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none text-blue-900 font-semibold"
              />
            </div>

            {/* Site Description */}
            <div>
              <label className="block text-sm font-bold text-blue-900 mb-2">
                توضیحات سایت
              </label>
              <textarea
                value={settings.siteDescription}
                onChange={e =>
                  setSettings({ ...settings, siteDescription: e.target.value })
                }
                rows={3}
                className="w-full px-6 py-3 border-2 border-blue-200 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none text-blue-900 font-semibold"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-bold text-blue-900 mb-2">
                ایمیل تماس
              </label>
              <input
                type="email"
                value={settings.email}
                onChange={e =>
                  setSettings({ ...settings, email: e.target.value })
                }
                className="w-full px-6 py-3 border-2 border-blue-200 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none text-blue-900 font-semibold"
                placeholder="info@example.com"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-bold text-blue-900 mb-2">
                شماره تماس
              </label>
              <input
                type="tel"
                value={settings.phone}
                onChange={e =>
                  setSettings({ ...settings, phone: e.target.value })
                }
                className="w-full px-6 py-3 border-2 border-blue-200 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none text-blue-900 font-semibold"
                placeholder="09123456789"
              />
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-bold text-blue-900 mb-2">
                آدرس
              </label>
              <textarea
                value={settings.address}
                onChange={e =>
                  setSettings({ ...settings, address: e.target.value })
                }
                rows={2}
                className="w-full px-6 py-3 border-2 border-blue-200 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none text-blue-900 font-semibold"
                placeholder="تهران، ایران"
              />
            </div>

            {/* Social Links */}
            <div>
              <h3 className="text-lg font-bold text-blue-900 mb-4">
                شبکه‌های اجتماعی
              </h3>
              <div className="space-y-4">
                <input
                  type="text"
                  value={settings.socialLinks.telegram}
                  onChange={e =>
                    setSettings({
                      ...settings,
                      socialLinks: {
                        ...settings.socialLinks,
                        telegram: e.target.value,
                      },
                    })
                  }
                  className="w-full px-6 py-3 border-2 border-blue-200 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none text-blue-900 font-semibold"
                  placeholder="لینک تلگرام"
                />
                <input
                  type="text"
                  value={settings.socialLinks.instagram}
                  onChange={e =>
                    setSettings({
                      ...settings,
                      socialLinks: {
                        ...settings.socialLinks,
                        instagram: e.target.value,
                      },
                    })
                  }
                  className="w-full px-6 py-3 border-2 border-blue-200 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none text-blue-900 font-semibold"
                  placeholder="لینک اینستاگرام"
                />
                <input
                  type="text"
                  value={settings.socialLinks.linkedin}
                  onChange={e =>
                    setSettings({
                      ...settings,
                      socialLinks: {
                        ...settings.socialLinks,
                        linkedin: e.target.value,
                      },
                    })
                  }
                  className="w-full px-6 py-3 border-2 border-blue-200 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none text-blue-900 font-semibold"
                  placeholder="لینک لینکدین"
                />
                <input
                  type="text"
                  value={settings.socialLinks.github}
                  onChange={e =>
                    setSettings({
                      ...settings,
                      socialLinks: {
                        ...settings.socialLinks,
                        github: e.target.value,
                      },
                    })
                  }
                  className="w-full px-6 py-3 border-2 border-blue-200 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none text-blue-900 font-semibold"
                  placeholder="لینک گیت‌هاب"
                />
              </div>
            </div>

            {/* Save Button */}
            <button
              onClick={handleSave}
              className="w-full px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-2xl hover:from-blue-600 hover:to-indigo-700 transition-all shadow-xl hover:shadow-2xl font-bold text-lg transform hover:scale-105"
            >
              💾 ذخیره تنظیمات
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
