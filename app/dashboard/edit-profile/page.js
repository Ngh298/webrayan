'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { USER_ROLES } from '@/lib/auth-utils';

export default function EditProfilePage() {
  const { data: session, update } = useSession();
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [updateError, setUpdateError] = useState('');
  const [updateSuccess, setUpdateSuccess] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (session?.user) {
      setFormData(prev => ({
        ...prev,
        name: session.user.name || '',
        phone: session.user.phone || '',
      }));
    }
  }, [session]);

  const handleUpdate = async e => {
    e.preventDefault();
    setUpdateError('');
    setUpdateSuccess('');
    setIsUpdating(true);

    try {
      // Validate inputs
      if (!formData.name.trim()) {
        throw new Error('نام نمی‌تواند خالی باشد');
      }

      if (formData.newPassword) {
        if (!formData.currentPassword) {
          throw new Error('برای تغییر رمز عبور، رمز فعلی را وارد کنید');
        }
        if (formData.newPassword.length < 8) {
          throw new Error('رمز عبور جدید باید حداقل 8 کاراکتر باشد');
        }
        if (formData.newPassword !== formData.confirmPassword) {
          throw new Error('رمز عبور جدید و تکرار آن یکسان نیستند');
        }
      }

      const updateData = {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
      };

      if (formData.newPassword) {
        updateData.currentPassword = formData.currentPassword;
        updateData.newPassword = formData.newPassword;
      }

      const response = await fetch('/api/user/update-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'خطایی رخ داد');
      }

      setUpdateSuccess('اطلاعات با موفقیت به‌روزرسانی شد');

      // Reset password fields
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      }));

      // Update session
      if (updateData.name) {
        await update({ name: updateData.name });
      }

      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    } catch (error) {
      setUpdateError(error.message);
    } finally {
      setIsUpdating(false);
    }
  };

  const userRole = session?.user?.role || USER_ROLES.USER;

  return (
    <div className="min-h-screen page-background">
      <div className="page-container max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/dashboard"
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
            بازگشت به داشبورد
          </Link>
          <h1 className="text-3xl font-bold text-blue-900">ویرایش پروفایل</h1>
          <p className="text-blue-700 mt-2">
            اطلاعات حساب کاربری خود را ویرایش کنید
          </p>
        </div>

        {/* Form Card */}
        <div className="standard-card">
          <form onSubmit={handleUpdate} className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Right Column - User Info */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center gap-2">
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
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  اطلاعات شخصی
                </h3>

                <div>
                  <label className="block text-sm font-medium text-blue-900 mb-1.5">
                    نام و نام خانوادگی <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={e =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    placeholder="نام خود را وارد کنید"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-blue-900 mb-1.5">
                    شماره تلفن
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={e =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    placeholder="09123456789"
                    dir="ltr"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-blue-900 mb-1.5">
                    ایمیل
                  </label>
                  <input
                    type="email"
                    value={session?.user?.email || ''}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed text-sm text-gray-600"
                  />
                  <p className="text-xs text-blue-600 mt-1">
                    📧 ایمیل قابل تغییر نیست
                  </p>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-3 rounded-lg border border-blue-100">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
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
                          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                        />
                      </svg>
                      <p className="text-sm text-blue-900 font-medium">
                        نقش:{' '}
                        {userRole === USER_ROLES.ADMIN
                          ? 'مدیر سیستم'
                          : 'کاربر عادی'}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
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
                          d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"
                        />
                      </svg>
                      <p className="text-sm text-blue-800">
                        روش ورود:{' '}
                        {session?.user?.provider === 'google'
                          ? 'گوگل'
                          : session?.user?.provider === 'github'
                            ? 'گیت‌هاب'
                            : 'ایمیل و رمز عبور'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Left Column - Password Section */}
              {session?.user?.provider !== 'google' &&
                session?.user?.provider !== 'github' && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center gap-2">
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
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                      </svg>
                      تغییر رمز عبور
                      <span className="text-xs font-normal text-blue-600">
                        (اختیاری)
                      </span>
                    </h3>

                    <div>
                      <label className="block text-sm font-medium text-blue-900 mb-1.5">
                        رمز عبور فعلی
                      </label>
                      <div className="relative">
                        <input
                          type={showCurrentPassword ? 'text' : 'password'}
                          value={formData.currentPassword}
                          onChange={e =>
                            setFormData({
                              ...formData,
                              currentPassword: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          placeholder="رمز عبور فعلی"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowCurrentPassword(!showCurrentPassword)
                          }
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-600 transition-colors"
                          aria-label="نمایش/مخفی کردن رمز عبور"
                        >
                          {showCurrentPassword ? (
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
                              className="w-5 h-5"
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
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-blue-900 mb-1.5">
                        رمز عبور جدید
                      </label>
                      <div className="relative">
                        <input
                          type={showNewPassword ? 'text' : 'password'}
                          value={formData.newPassword}
                          onChange={e =>
                            setFormData({
                              ...formData,
                              newPassword: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          placeholder="حداقل 8 کاراکتر"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-600 transition-colors"
                          aria-label="نمایش/مخفی کردن رمز عبور"
                        >
                          {showNewPassword ? (
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
                              className="w-5 h-5"
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
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-blue-900 mb-1.5">
                        تکرار رمز عبور جدید
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          value={formData.confirmPassword}
                          onChange={e =>
                            setFormData({
                              ...formData,
                              confirmPassword: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          placeholder="تکرار رمز عبور"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-600 transition-colors"
                          aria-label="نمایش/مخفی کردن رمز عبور"
                        >
                          {showConfirmPassword ? (
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
                              className="w-5 h-5"
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
                    </div>

                    <div className="bg-amber-50 p-3 rounded-lg border border-amber-200">
                      <div className="flex items-start gap-2">
                        <svg
                          className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <p className="text-xs text-amber-800">
                          برای تغییر رمز عبور، هر سه فیلد را پر کنید. در غیر این
                          صورت فیلدها را خالی بگذارید.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
            </div>

            {/* Messages and Actions */}
            <div className="mt-6 space-y-3">
              {/* Error Message */}
              {updateError && (
                <div className="bg-red-50 border-r-4 border-red-500 rounded-lg p-3 flex items-start gap-3 animate-shake">
                  <svg
                    className="w-5 h-5 text-red-600 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p className="text-sm text-red-800 font-medium">
                    {updateError}
                  </p>
                </div>
              )}

              {/* Success Message */}
              {updateSuccess && (
                <div className="bg-green-50 border-r-4 border-green-500 rounded-lg p-3 flex items-start gap-3">
                  <svg
                    className="w-5 h-5 text-green-600 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p className="text-sm text-green-800 font-medium">
                    {updateSuccess}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-3 border-t">
                <Link
                  href="/dashboard"
                  className="flex-1 px-6 py-2.5 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all font-medium text-center"
                >
                  انصراف
                </Link>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="flex-1 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                >
                  {isUpdating ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg
                        className="animate-spin h-4 w-4"
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
                      در حال ذخیره...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
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
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      ذخیره تغییرات
                    </span>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
