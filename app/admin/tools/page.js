'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function AdminToolsPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleFixUsers = async () => {
    if (
      !confirm(
        'آیا مطمئن هستید که می‌خواهید فیلد provider را برای کاربران قدیمی به‌روزرسانی کنید؟'
      )
    ) {
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch('/api/admin/fix-users', {
        method: 'POST',
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({
        success: false,
        message: 'خطا در ارتباط با سرور',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen page-background">
      <div className="page-container max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/admin"
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
          >
            <svg
              className="w-5 h-5 ml-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            بازگشت به پنل مدیریت
          </Link>
          <h1 className="text-3xl font-bold text-blue-900">ابزارهای مدیریتی</h1>
          <p className="text-blue-700 mt-2">ابزارهای کمکی برای مدیریت سیستم</p>
        </div>

        {/* Tools Card */}
        <div className="standard-card p-6">
          <h2 className="text-xl font-bold text-blue-900 mb-4">
            به‌روزرسانی فیلد Provider کاربران
          </h2>
          <p className="text-blue-700 mb-4">
            این ابزار فیلد{' '}
            <code className="bg-blue-100 px-2 py-1 rounded">provider</code> را
            برای کاربران قدیمی که این فیلد را ندارند، به‌روزرسانی می‌کند.
          </p>
          <ul className="list-disc list-inside text-blue-700 mb-6 space-y-2">
            <li>
              کاربرانی که رمز عبور دارند →{' '}
              <code className="bg-blue-100 px-2 py-1 rounded">credentials</code>
            </li>
            <li>
              کاربرانی که رمز عبور ندارند →{' '}
              <code className="bg-blue-100 px-2 py-1 rounded">google</code>{' '}
              (OAuth)
            </li>
          </ul>

          <button
            onClick={handleFixUsers}
            disabled={loading}
            className="btn-primary-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg
                  className="animate-spin h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                در حال پردازش...
              </span>
            ) : (
              '🔧 اجرای به‌روزرسانی'
            )}
          </button>

          {/* Result */}
          {result && (
            <div
              className={`mt-6 p-4 rounded-lg ${result.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}
            >
              <p
                className={`font-medium ${result.success ? 'text-green-800' : 'text-red-800'}`}
              >
                {result.message}
              </p>
              {result.details && (
                <div className="mt-2 p-3 bg-white rounded border border-red-300">
                  <p className="text-sm font-medium text-red-700 mb-1">
                    جزئیات خطا:
                  </p>
                  <p className="text-xs text-red-600 font-mono">
                    {result.details}
                  </p>
                  {result.errorName && (
                    <p className="text-xs text-red-500 mt-1">
                      نوع خطا: {result.errorName}
                    </p>
                  )}
                </div>
              )}
              {result.results && result.results.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-green-700 mb-2">
                    نتایج به‌روزرسانی:
                  </p>
                  <div className="bg-white rounded p-3 max-h-60 overflow-y-auto">
                    {result.results.map((user, index) => (
                      <div
                        key={index}
                        className={`text-sm py-1 border-b last:border-b-0 ${user.error ? 'text-red-700' : 'text-blue-700'}`}
                      >
                        <span className="font-medium">{user.email}</span>
                        {user.error ? (
                          <>
                            {' '}
                            <span className="text-red-600 text-xs">
                              ❌ خطا: {user.error}
                            </span>
                          </>
                        ) : (
                          <>
                            {' → '}
                            <span className="bg-blue-100 px-2 py-0.5 rounded mx-2">
                              {user.provider}
                            </span>
                            <span className="text-xs text-gray-600">
                              (
                              {user.hasPassword
                                ? 'دارای رمز عبور'
                                : 'بدون رمز عبور'}
                              )
                            </span>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
