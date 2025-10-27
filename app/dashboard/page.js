import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { auth } from '@/auth';
import { isAdmin } from '@/lib/auth-utils';
import DashboardClient from './components/DashboardClient';

export const metadata = {
  title: 'داشبورد کاربری | وب‌رایان',
  description: 'پنل کاربری شخصی',
};

function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="mt-4 text-blue-900">در حال بارگذاری...</p>
      </div>
    </div>
  );
}

export default async function DashboardPage() {
  // بررسی وضعیت ورود کاربر
  const session = await auth();

  // اگر کاربر Admin است، به پنل مدیریت هدایت شود
  if (isAdmin(session.user?.role)) {
    redirect('/admin');
  }

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <DashboardClient session={session} />
    </Suspense>
  );
}
