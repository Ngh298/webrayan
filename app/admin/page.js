import AdminDashboard from './components/AdminDashboard';

export const metadata = {
  title: 'پنل مدیریت | وب‌رایان',
  description: 'پنل مدیریت محتوا و کاربران',
};

export default function AdminPage() {
  // Authentication handled in layout.js
  // Loading handled in AdminDashboard component
  return <AdminDashboard />;
}
