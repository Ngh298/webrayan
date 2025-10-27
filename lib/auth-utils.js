import { auth } from '@/auth';
import { redirect } from 'next/navigation';

/**
 * نقش‌های کاربری سیستم
 */
export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  MODERATOR: 'moderator',
};

/**
 * دسترسی‌های هر نقش
 */
export const ROLE_PERMISSIONS = {
  [USER_ROLES.ADMIN]: [
    'view_dashboard',
    'manage_users',
    'manage_content',
    'view_analytics',
    'system_settings',
    'delete_content',
  ],
  [USER_ROLES.MODERATOR]: [
    'view_dashboard',
    'manage_content',
    'view_analytics',
  ],
  [USER_ROLES.USER]: ['view_dashboard', 'view_profile', 'edit_profile'],
};

/**
 * بررسی اینکه آیا کاربر لاگین کرده یا نه
 */
export async function requireAuth() {
  const session = await auth();

  if (!session?.user) {
    redirect('/auth/signin');
  }

  return session;
}

/**
 * بررسی نقش کاربر
 */
export async function requireRole(requiredRole) {
  const session = await requireAuth();

  if (session.user.role !== requiredRole) {
    redirect('/auth/unauthorized');
  }

  return session;
}

/**
 * بررسی دسترسی کاربر
 */
export async function requirePermission(permission) {
  const session = await requireAuth();
  const userRole = session.user.role || USER_ROLES.USER;
  const userPermissions = ROLE_PERMISSIONS[userRole] || [];

  if (!userPermissions.includes(permission)) {
    redirect('/auth/unauthorized');
  }

  return session;
}

/**
 * بررسی اینکه آیا کاربر ادمین است یا نه
 */
export async function requireAdmin() {
  return await requireRole(USER_ROLES.ADMIN);
}

/**
 * بررسی دسترسی در کامپوننت‌ها (Client-side)
 */
export function hasPermission(userRole, permission) {
  const userPermissions = ROLE_PERMISSIONS[userRole] || [];
  return userPermissions.includes(permission);
}

/**
 * بررسی نقش در کامپوننت‌ها (Client-side)
 */
export function hasRole(userRole, requiredRole) {
  return userRole === requiredRole;
}

/**
 * بررسی اینکه آیا کاربر ادمین است (Client-side و Server-side)
 * می‌تواند user object یا role string بگیرد
 */
export function isAdmin(userOrRole) {
  // اگر object است، role را استخراج کن
  if (typeof userOrRole === 'object' && userOrRole !== null) {
    return userOrRole.role === USER_ROLES.ADMIN;
  }
  // اگر string است، مستقیم مقایسه کن
  return userOrRole === USER_ROLES.ADMIN;
}
