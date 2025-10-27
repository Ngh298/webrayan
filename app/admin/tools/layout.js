import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { isAdmin } from '@/lib/auth-utils';

export default async function AdminToolsLayout({ children }) {
  const session = await auth();

  // Check if user is authenticated
  if (!session || !session.user) {
    redirect('/auth/signin?callbackUrl=/admin/tools');
  }

  // Check if user is admin
  if (!isAdmin(session.user.role)) {
    redirect('/auth/unauthorized');
  }

  return <>{children}</>;
}
