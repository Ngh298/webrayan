'use client';

import { useState, useEffect } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthForm, validators } from '@/app/hooks/useAuthForm';

/**
 * صفحه ورود با طراحی مدرن و امن
 * رعایت اصول Clean Code و Software Engineering
 */
export default function SignInPage() {
  const router = useRouter();
  const [globalError, setGlobalError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [initialValues, setInitialValues] = useState({
    email: '',
    password: '',
  });
  const [isInitialized, setIsInitialized] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // بارگذاری ایمیل ذخیره شده بعد از mount شدن
  useEffect(() => {
    setIsMounted(true);

    // بررسی localStorage فقط در client-side
    if (typeof window !== 'undefined') {
      try {
        const savedEmail = localStorage.getItem('rememberedEmail');
        console.log('Saved email from localStorage:', savedEmail);

        if (savedEmail && savedEmail.trim()) {
          setInitialValues({ email: savedEmail, password: '' });
          setRememberMe(true);
        }
      } catch (error) {
        console.error('Error loading saved email:', error);
      }
    }

    setIsInitialized(true);
  }, []);

  // اعتبارسنجی فرم
  const validate = values => {
    const errors = {};

    const emailError =
      validators.required(values.email, 'ایمیل') ||
      validators.email(values.email);
    if (emailError) errors.email = emailError;

    const passwordError = validators.required(values.password, 'رمز عبور');
    if (passwordError) errors.password = passwordError;

    return errors;
  };

  // مدیریت ارسال فرم
  const handleFormSubmit = async values => {
    setGlobalError('');

    try {
      // مدیریت Remember Me
      if (rememberMe) {
        localStorage.setItem(
          'rememberedEmail',
          values.email.trim().toLowerCase()
        );
      } else {
        localStorage.removeItem('rememberedEmail');
      }

      const result = await signIn('credentials', {
        email: values.email.trim().toLowerCase(),
        password: values.password,
        redirect: false,
      });

      if (result?.error) {
        setGlobalError('ایمیل یا رمز عبور اشتباه است');
      } else if (result?.ok) {
        // ورود موفق
        router.push('/dashboard');
        router.refresh();
      } else {
        setGlobalError('خطایی در فرآیند ورود رخ داد');
      }
    } catch (error) {
      console.error('Login error:', error);
      setGlobalError('خطایی رخ داد. لطفاً دوباره تلاش کنید');
    }
  };

  const form = useAuthForm(initialValues, handleFormSubmit, validate);

  // خواندن مقادیر autofill شده توسط مرورگر
  useEffect(() => {
    if (!isMounted) return;

    let hasChecked = false;

    const checkAutofill = () => {
      if (hasChecked) return; // جلوگیری از چک کردن چند باره

      const emailInput = document.getElementById('email');
      const passwordInput = document.getElementById('password');

      if (
        emailInput &&
        emailInput.value &&
        emailInput.value !== form.values.email
      ) {
        form.setValues(prev => ({ ...prev, email: emailInput.value }));
        hasChecked = true;
      }

      if (
        passwordInput &&
        passwordInput.value &&
        passwordInput.value !== form.values.password
      ) {
        form.setValues(prev => ({ ...prev, password: passwordInput.value }));
        hasChecked = true;
      }
    };

    // فقط یک بار بعد از 600ms چک می‌کنیم
    const timer = setTimeout(checkAutofill, 600);

    return () => {
      clearTimeout(timer);
    };
  }, [isMounted]); // eslint-disable-line react-hooks/exhaustive-deps

  // نمایش loading تا زمانی که localStorage بارگذاری شود
  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

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
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-blue-900">به وب رایان آمدید!</h2>
                <p className="mt-2 text-blue-700">
                  برای ادامه وارد حساب کاربری خود شوید.
                </p>
              </div>

              {/* Form */}
              <form
                onSubmit={form.handleSubmit}
                className="space-y-6"
                name="signin-form"
                autoComplete="on"
              >
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
                      autoComplete="username email"
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
                      autoComplete="current-password"
                      required
                      value={form.values.password}
                      onChange={form.handleChange}
                      onBlur={form.handleBlur}
                      disabled={form.isSubmitting}
                      data-lpignore="false"
                      data-form-type="password"
                      className={`block w-full pr-10 pl-10 px-4 py-3 border ${
                        form.touched.password && form.errors.password
                          ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                          : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                      } rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 transition-all duration-200 disabled:bg-gray-50 disabled:cursor-not-allowed`}
                      placeholder="••••••••"
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
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      checked={rememberMe}
                      onChange={e => setRememberMe(e.target.checked)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
                    />
                    <label
                      htmlFor="remember-me"
                      className="mr-2 block text-sm text-blue-800 cursor-pointer"
                    >
                      مرا به خاطر بسپار!
                    </label>
                  </div>

                  <Link
                    href="/auth/forgot-password"
                    className="text-sm font-medium text-blue-600 hover:text-blue-500 transition-colors"
                  >
                    فراموشی رمز عبور؟
                  </Link>
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

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={form.isSubmitting}
                  className="btn-primary-sm w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
                      در حال ورود...
                    </>
                  ) : (
                    <>
                   ورود
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
                      حساب کاربری ندارید؟
                    </span>
                  </div>
                </div>

                <div className="mt-6">
                  <Link
                    href="/auth/register"
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
                        d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                      />
                    </svg>
                    ایجاد حساب جدید
                  </Link>
                </div>
              </div>

              {/* Back to Home */}
             <div className="mt-6 text-center">
  <Link
    href="/"
    className="inline-flex items-center gap-2 text-sm font-medium text-blue-700 hover:text-blue-900 transition-colors"
  >
    بازگشت به صفحه اصلی
    <svg
      className="w-4 h-4"
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
  </Link>
</div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
