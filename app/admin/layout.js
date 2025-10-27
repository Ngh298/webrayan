import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { isAdmin } from '@/lib/auth-utils';

export default async function AdminLayout({ children }) {
  const session = await auth();

  // Check if user is authenticated
  if (!session || !session.user) {
    redirect('/auth/signin?callbackUrl=/admin');
  }

  // Check if user is admin
  if (!isAdmin(session.user.role)) {
    redirect('/auth/unauthorized');
  }

  // بدون Header و Footer - فقط محتوا
  return <>{children}</>;
}
