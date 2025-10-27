'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import { useAuthForm, validators } from '@/app/hooks/useAuthForm';
import PasswordStrength from '@/app/components/PasswordStrength';

export default function ResetPasswordPage() {
  const params = useSearchParams();
  const router = useRouter();
  const token = params.get('token');

  const [serverMessage, setServerMessage] = useState('');
  const [serverError, setServerError] = useState('');

  const validate = values => {
    const errors = {};
    const password = values.password || '';
    const confirm = values.confirmPassword || '';

    const req = validators.required(password, 'رمز عبور');
    if (req) errors.password = req;
    else if (password.length < 8)
      errors.password = 'رمز عبور باید حداقل 8 کاراکتر باشد';
    else if (!/(?=.*[a-z])/.test(password))
      errors.password = 'رمز عبور باید حداقل یک حرف کوچک داشته باشد';
    else if (!/(?=.*[A-Z])/.test(password))
      errors.password = 'رمز عبور باید حداقل یک حرف بزرگ داشته باشد';
    else if (!/(?=.*\d)/.test(password))
      errors.password = 'رمز عبور باید حداقل یک عدد داشته باشد';

    const confReq = validators.required(confirm, 'تکرار رمز عبور');
    if (confReq) errors.confirmPassword = confReq;
    else if (password !== confirm)
      errors.confirmPassword = 'رمز عبور و تکرار آن یکسان نیستند';

    return errors;
  };

  const onSubmit = async values => {
    setServerMessage('');
    setServerError('');
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password: values.password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'خطا در بازنشانی رمز');
      setServerMessage(
        'رمز عبور با موفقیت تغییر کرد. در حال انتقال به ورود...'
      );
      setTimeout(() => router.push('/auth/signin'), 2000);
    } catch (error) {
      setServerError(error.message);
    }
  };

  const form = useAuthForm(
    { password: '', confirmPassword: '' },
    onSubmit,
    validate
  );

  if (!token) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="relative bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 overflow-hidden py-12 sm:py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-md mx-auto">
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-white/20 text-center">
                <p className="text-red-600 mb-4 font-medium">
                  توکن نامعتبر است
                </p>
                <Link
                  href="/auth/forgot-password"
                  className="text-blue-700 hover:text-blue-900 font-medium transition-colors"
                >
                  درخواست لینک جدید
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="relative bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 overflow-hidden py-12 sm:py-16">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-yellow-300 to-orange-300 rounded-full mix-blend-multiply filter blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-cyan-300 to-blue-300 rounded-full mix-blend-multiply filter blur-3xl transform translate-x-1/2 translate-y-1/2"></div>
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-md mx-auto">
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-white/20">
              {/* Header */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl shadow-lg mb-4">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 11c0-1.657-1.567-3-3.5-3S5 9.343 5 11c0 3 3.5 5 7 8 3.5-3 7-5 7-8 0-1.657-1.567-3-3.5-3S12 9.343 12 11z"
                    />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-blue-900">
                  بازنشانی رمز عبور
                </h2>
                <p className="mt-2 text-blue-700">
                  رمز عبور جدید خود را وارد کنید
                </p>
              </div>

              {/* Form */}
              <form onSubmit={form.handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-blue-900 mb-2"
                  >
                    رمز عبور جدید
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={form.values.password}
                    onChange={form.handleChange}
                    onBlur={form.handleBlur}
                    disabled={form.isSubmitting}
                    className={`block w-full px-4 py-3 border ${
                      form.touched.password && form.errors.password
                        ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                        : 'border-gray-300 focus:ring-purple-500 focus:border-purple-500'
                    } rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200 disabled:bg-gray-50 disabled:cursor-not-allowed`}
                    placeholder="حداقل 8 کاراکتر با ترکیب حروف و اعداد"
                  />
                  <PasswordStrength
                    password={form.values.password}
                    show={form.values.password.length > 0}
                  />
                </div>

                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-blue-900 mb-2"
                  >
                    تکرار رمز عبور
                  </label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={form.values.confirmPassword}
                    onChange={form.handleChange}
                    onBlur={form.handleBlur}
                    disabled={form.isSubmitting}
                    className={`block w-full px-4 py-3 border ${
                      form.touched.confirmPassword &&
                      form.errors.confirmPassword
                        ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                        : 'border-gray-300 focus:ring-purple-500 focus:border-purple-500'
                    } rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200 disabled:bg-gray-50 disabled:cursor-not-allowed`}
                    placeholder="رمز عبور را دوباره وارد کنید"
                  />
                </div>

                {serverError && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
                    {serverError}
                  </div>
                )}
                {serverMessage && (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-sm text-green-700">
                    {serverMessage}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={form.isSubmitting}
                  className="btn-primary-sm w-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {form.isSubmitting ? 'در حال بروزرسانی...' : 'تغییر رمز عبور'}
                </button>
              </form>

              <div className="mt-6 text-center">
                <Link
                  href="/auth/signin"
                  className="inline-flex items-center text-sm font-medium text-blue-700 hover:text-blue-900 transition-colors"
                >
                  <svg
                    className="w-4 h-4 ml-1"
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
                  بازگشت به ورود
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
