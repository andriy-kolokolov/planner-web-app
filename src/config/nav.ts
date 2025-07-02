import type { RouteLocationRaw } from 'vue-router';

export interface NavItem {
  label: string;
  path: RouteLocationRaw;
  icon?: string; // optional icon component name
}

const navItems: NavItem[] = [
  { label: 'Welcome', path: '/' },
  { label: 'Login', path: '/auth/login' },
];

export default navItems;
