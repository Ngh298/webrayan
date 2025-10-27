'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthForm, validators } from '@/app/hooks/useAuthForm';
import PasswordStrength from '@/app/components/PasswordStrength';

/**
 * صفحه ثبت‌نام با طراحی مدرن و امن
 * رعایت اصول Clean Code، Security و Software Engineering
 */
export default function RegisterPage() {
  const router = useRouter();
  const [globalError, setGlobalError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // اعتبارسنجی فرم با قوانین امنیتی
  const validate = values => {
    const errors = {};

    // اعتبارسنجی نام
    const nameError =
      validators.required(values.name, 'نام') ||
      validators.minLength(values.name, 2);
    if (nameError) errors.name = nameError;
    if (values.name && values.name.length > 50) {
      errors.name = validators.maxLength(values.name, 50);
    }

    // اعتبارسنجی ایمیل
    const emailError =
      validators.required(values.email, 'ایمیل') ||
      validators.email(values.email);
    if (emailError) errors.email = emailError;

    // اعتبارسنجی رمز عبور با قوانین امنیتی قوی
    const passwordError = validators.required(values.password, 'رمز عبور');
    if (passwordError) {
      errors.password = passwordError;
    } else if (values.password.length < 8) {
      errors.password = 'رمز عبور باید حداقل 8 کاراکتر باشد';
    } else if (!/(?=.*[a-z])/.test(values.password)) {
      errors.password = 'رمز عبور باید حداقل یک حرف کوچک داشته باشد';
    } else if (!/(?=.*[A-Z])/.test(values.password)) {
      errors.password = 'رمز عبور باید حداقل یک حرف بزرگ داشته باشد';
    } else if (!/(?=.*\d)/.test(values.password)) {
      errors.password = 'رمز عبور باید حداقل یک عدد داشته باشد';
    }

    // اعتبارسنجی تطابق رمز عبور
    const confirmPasswordError = validators.required(
      values.confirmPassword,
      'تکرار رمز عبور'
    );
    if (confirmPasswordError) {
      errors.confirmPassword = confirmPasswordError;
    } else if (values.password !== values.confirmPassword) {
      errors.confirmPassword = 'رمز عبور و تکرار آن یکسان نیستند';
    }

    return errors;
  };

  // مدیریت ارسال فرم
  const handleFormSubmit = async values => {
    setGlobalError('');
    setSuccess(false);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: values.name.trim(),
          email: values.email.toLowerCase().trim(),
          password: values.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'خطایی رخ داد');
      }

      // ثبت‌نام موفق
      setSuccess(true);

      // هدایت به صفحه ورود بعد از 2.5 ثانیه
      setTimeout(() => {
        router.push('/auth/signin');
      }, 2500);
    } catch (error) {
      console.error('Registration error:', error);
      setGlobalError(error.message || 'خطایی رخ داد. لطفاً دوباره تلاش کنید');
    }
  };

  const form = useAuthForm(
    { name: '', email: '', password: '', confirmPassword: '' },
    handleFormSubmit,
    validate
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Background Section */}
      <div className="relative bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 overflow-hidden py-12 sm:py-16">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-yellow-300 to-orange-300 rounded-full mix-blend-multiply filter blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-br from-cyan-300 to-blue-300 rounded-full mix-blend-multiply filter blur-3xl transform translate-x-1/2 translate-y-1/2"></div>
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-br from-pink-300 to-purple-300 rounded-full mix-blend-multiply filter blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
        </div>

        {/* Main Container */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-md mx-auto">
            {/* Card */}
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
                      d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                    />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-blue-900">
                  ایجاد حساب کاربری
                </h2>
                <p className="mt-2 text-blue-700">
                  به جمع ما بپیوندید و شروع کنید
                </p>
              </div>

              {/* Form */}
              <form onSubmit={form.handleSubmit} className="space-y-5">
                {/* Name Field */}
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-blue-900 mb-2"
                  >
                    نام و نام خانوادگی
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
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </div>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      required
                      value={form.values.name}
                      onChange={form.handleChange}
                      onBlur={form.handleBlur}
                      disabled={form.isSubmitting || success}
                      className={`block w-full pr-10 px-4 py-3 border ${
                        form.touched.name && form.errors.name
                          ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                          : 'border-gray-300 focus:ring-purple-500 focus:border-purple-500'
                      } rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200 disabled:bg-gray-50 disabled:cursor-not-allowed`}
                      placeholder="نام کامل خود را وارد کنید"
                    />
                  </div>
                  {form.touched.name && form.errors.name && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {form.errors.name}
                    </p>
                  )}
                </div>

                {/* Email Field */}
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
                      disabled={form.isSubmitting || success}
                      className={`block w-full pr-10 px-4 py-3 border ${
                        form.touched.email && form.errors.email
                          ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                          : 'border-gray-300 focus:ring-purple-500 focus:border-purple-500'
                      } rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200 disabled:bg-gray-50 disabled:cursor-not-allowed`}
                      placeholder="example@email.com"
                    />
                  </div>
                  {form.touched.email && form.errors.email && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {form.errors.email}
                    </p>
                  )}
                </div>

                {/* Password Field */}
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-blue-900 mb-2"
                  >
                    رمز عبور
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
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                      </svg>
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      required
                      value={form.values.password}
                      onChange={form.handleChange}
                      onBlur={form.handleBlur}
                      disabled={form.isSubmitting || success}
                      className={`block w-full pr-10 pl-10 px-4 py-3 border ${
                        form.touched.password && form.errors.password
                          ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                          : 'border-gray-300 focus:ring-purple-500 focus:border-purple-500'
                      } rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200 disabled:bg-gray-50 disabled:cursor-not-allowed`}
                      placeholder="حداقل 8 کاراکتر با ترکیب حروف و اعداد"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 left-0 pl-3 flex items-center"
                      tabIndex={-1}
                      aria-label={
                        showPassword ? 'پنهان کردن رمز عبور' : 'نمایش رمز عبور'
                      }
                    >
                      {showPassword ? (
                        <svg
                          className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                  {form.touched.password && form.errors.password && (
                    <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {form.errors.password}
                    </p>
                  )}
                  <PasswordStrength
                    password={form.values.password}
                    show={form.values.password.length > 0}
                  />
                </div>

                {/* Confirm Password Field */}
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-blue-900 mb-2"
                  >
                    تکرار رمز عبور
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
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      required
                      value={form.values.confirmPassword}
                      onChange={form.handleChange}
                      onBlur={form.handleBlur}
                      disabled={form.isSubmitting || success}
                      className={`block w-full pr-10 pl-10 px-4 py-3 border ${
                        form.touched.confirmPassword &&
                        form.errors.confirmPassword
                          ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                          : 'border-gray-300 focus:ring-purple-500 focus:border-purple-500'
                      } rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200 disabled:bg-gray-50 disabled:cursor-not-allowed`}
                      placeholder="رمز عبور را دوباره وارد کنید"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute inset-y-0 left-0 pl-3 flex items-center"
                      tabIndex={-1}
                      aria-label={
                        showConfirmPassword
                          ? 'پنهان کردن تکرار رمز عبور'
                          : 'نمایش تکرار رمز عبور'
                      }
                    >
                      {showConfirmPassword ? (
                        <svg
                          className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                  {form.touched.confirmPassword &&
                    form.errors.confirmPassword && (
                      <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                        <svg
                          className="w-4 h-4"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {form.errors.confirmPassword}
                      </p>
                    )}
                </div>

                {/* Terms and Conditions */}
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="terms"
                      name="terms"
                      type="checkbox"
                      required
                      className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded cursor-pointer"
                    />
                  </div>
                  <div className="mr-3 text-sm">
                    <label
                      htmlFor="terms"
                      className="text-gray-700 cursor-pointer"
                    >
                      با{' '}
                      <Link
                        href="/terms"
                        className="text-purple-600 hover:text-purple-500 font-medium"
                      >
                        قوانین و مقررات
                      </Link>{' '}
                      و{' '}
                      <Link
                        href="/privacy"
                        className="text-purple-600 hover:text-purple-500 font-medium"
                      >
                        سیاست حفظ حریم خصوصی
                      </Link>{' '}
                      موافقم
                    </label>
                  </div>
                </div>

                {/* Global Error */}
                {globalError && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3 animate-shake">
                    <svg
                      className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <p className="text-sm text-red-700">{globalError}</p>
                  </div>
                )}

                {/* Success Message */}
                {success && (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-start gap-3 animate-pulse">
                    <svg
                      className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <p className="text-sm text-green-700">
                      حساب شما با موفقیت ایجاد شد! در حال هدایت به صفحه ورود...
                    </p>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={form.isSubmitting || success}
                  className="btn-primary-sm w-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {form.isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
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
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      در حال ایجاد حساب...
                    </>
                  ) : success ? (
                    <>
                      <svg
                        className="w-5 h-5 ml-2"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      حساب ایجاد شد
                    </>
                  ) : (
                    <>
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
                          d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                        />
                      </svg>
                      ایجاد حساب کاربری
                    </>
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="mt-8">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-blue-700">
                      قبلاً ثبت‌نام کرده‌اید؟
                    </span>
                  </div>
                </div>

                <div className="mt-6">
                  <Link
                    href="/auth/signin"
                    className="w-full flex items-center justify-center px-4 py-3 border border-blue-300 rounded-xl shadow-sm text-base font-medium text-blue-800 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
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
                        d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                      />
                    </svg>
                    ورود به حساب کاربری
                  </Link>
                </div>
              </div>

              {/* Back to Home */}
              <div className="mt-6 text-center">
                <Link
                  href="/"
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
                  بازگشت به صفحه اصلی
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
