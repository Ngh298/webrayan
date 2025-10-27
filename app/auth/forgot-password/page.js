'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuthForm, validators } from '@/app/hooks/useAuthForm';

export default function ForgotPasswordPage() {
  const [serverMessage, setServerMessage] = useState('');
  const [serverError, setServerError] = useState('');

  const validate = values => {
    const errors = {};
    const emailError =
      validators.required(values.email, 'ایمیل') ||
      validators.email(values.email);
    if (emailError) errors.email = emailError;
    return errors;
  };

  const onSubmit = async values => {
    setServerMessage('');
    setServerError('');
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: values.email.toLowerCase().trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'خطا در ارسال درخواست');
      setServerMessage(
        'اگر ایمیل معتبر باشد، لینک بازنشانی برای شما ارسال می‌شود'
      );
    } catch (error) {
      setServerError(error.message);
    }
  };

  const form = useAuthForm({ email: '' }, onSubmit, validate);

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
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg mb-4">
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
                  فراموشی رمز عبور
                </h2>
                <p className="mt-2 text-blue-700">
                  ایمیل خود را وارد کنید تا لینک بازنشانی برای شما ارسال شود
                </p>
              </div>

              {/* Form */}
              <form onSubmit={form.handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-blue-900 mb-2"
                  >
                    ایمیل
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <svg
                        className="h-5 w-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                        />
                      </svg>
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={form.values.email}
                      onChange={form.handleChange}
                      onBlur={form.handleBlur}
                      disabled={form.isSubmitting}
                      className={`block w-full pr-10 px-4 py-3 border ${
                        form.touched.email && form.errors.email
                          ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                          : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                      } rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200 disabled:bg-gray-50 disabled:cursor-not-allowed`}
                      placeholder="example@email.com"
                    />
                  </div>
                  {form.touched.email && form.errors.email && (
                    <p className="mt-2 text-sm text-red-600">
                      {form.errors.email}
                    </p>
                  )}
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
                  {form.isSubmitting
                    ? 'در حال ارسال...'
                    : 'ارسال لینک بازنشانی'}
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
