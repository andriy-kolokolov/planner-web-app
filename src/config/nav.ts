import type { RouteLocationRaw } from 'vue-router';

export interface NavItem {
  key: string;
  label: string;
  type: 'link' | 'divider';
  path: RouteLocationRaw;
  icon?: string; // optional icon component name
  color?: string;
}

export const upperNavItems: NavItem[] = [
  // todo remove login from here
  { key: 'login', label: 'Login', type: 'link', path: '/auth/login', icon: 'i-mdi-login' },
  { key: 'dashboard', label: 'Dashboard', type: 'link', path: '/dashboard', icon: 'i-mdi-view-dashboard' },
  { key: 'calendar', label: 'Calendar', type: 'link', path: '/calendar', icon: 'i-mdi-calendar' },
  { key: 'habits', label: 'Habits', type: 'link', path: '/habits', icon: 'i-mdi-repeat' },
  { key: 'tasks', label: 'Tasks', type: 'link', path: '/tasks', icon: 'i-mdi-format-list-checkbox' },
  { key: 'focus', label: 'Focus', type: 'link', path: '/focus', icon: 'i-mdi-timer' },
  { key: 'insights', label: 'Insights', type: 'link', path: '/insights', icon: 'i-mdi-chart-bar' },
  { key: 'welcome', label: 'Welcome', type: 'link', path: '/', icon: 'i-mdi-home' },
];

export const lowerNavItems: NavItem[] = [
  { key: 'profile', label: 'Profile', type: 'link', path: '/auth/profile', icon: 'i-mdi-account' },
  { key: 'settings', label: 'Settings', type: 'link', path: '/settings', icon: 'i-mdi-cog' },
  { key: 'logout', label: 'Logout', type: 'link', path: '/auth/logout', icon: 'i-mdi-logout', color: 'text-red-400' },
];
