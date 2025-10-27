import { redirect } from 'next/navigation';
import { auth } from '@/auth';

export default async function DashboardLayout({ children }) {
  const session = await auth();

  // Check if user is authenticated
  if (!session || !session.user) {
    redirect('/auth/signin?callbackUrl=/dashboard');
  }

  // بدون Header و Footer - فقط محتوا
  return <>{children}</>;
}
