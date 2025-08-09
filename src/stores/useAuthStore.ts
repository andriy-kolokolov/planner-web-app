// stores/auth.ts
import { defineStore } from 'pinia';
import type { AuthResponse } from '~/types/response';
import type { Auth } from '~/types/models';
import { AUTH_DATA_STORAGE } from '~/constants/localStorageKeys';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    auth: null as Auth | null,
    isAuthenticated: false,
  }),

  actions: {
    setAuthData(data: AuthResponse) {
      this.auth = { ...data };
      this.isAuthenticated = true;
      localStorage.setItem(AUTH_DATA_STORAGE, JSON.stringify(this.auth));
    },

    getAuthData() {
      const decoded = localStorage.getItem(AUTH_DATA_STORAGE) as string | null;
      if (!decoded) return null;
      return JSON.parse(decoded) as Auth | null;
    },

    removeAuthData() {
      this.auth = null;
      this.isAuthenticated = false;
      localStorage.removeItem(AUTH_DATA_STORAGE);
    },

    initAuth() {
      const auth = localStorage.getItem(AUTH_DATA_STORAGE) as unknown as Auth | null;
      if (auth) {
        this.auth = { ...auth };
        this.isAuthenticated = true;
      } else {
        this.removeAuthData();
        navigateTo('auth/login');
      }
    },

    async logout() {
      try {
        const resp = await useNuxtApp().$axios.post('/api/v1/auth/logout');
        console.log(resp);
      } catch (error) {
        console.error('Logout error:', error);
      } finally {
        this.removeAuthData();
        navigateTo('auth/login');
      }
    },
  },
});
