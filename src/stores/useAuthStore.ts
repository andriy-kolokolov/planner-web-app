// stores/auth.ts
import { defineStore } from 'pinia';
import type { AuthResponse } from '~/types/response';
import type { Auth } from '~/types/models';

const AUTH_DATA_STORAGE_KEY = 'auth_data';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    auth: null as Auth | null,
    isAuthenticated: false,
  }),

  actions: {
    setAuthData(data: AuthResponse) {
      this.auth = {
        user: data.user,
        token: data.token.value,
      };
      this.isAuthenticated = true;
      localStorage.setItem(AUTH_DATA_STORAGE_KEY, JSON.stringify(this.auth));
    },

    getAuthData() {
      return localStorage.getItem(AUTH_DATA_STORAGE_KEY) as unknown as Auth | null;
    },

    removeAuthData() {
      this.auth = null;
      this.isAuthenticated = false;
      localStorage.removeItem(AUTH_DATA_STORAGE_KEY);
    },

    initAuth() {
      const auth = localStorage.getItem(AUTH_DATA_STORAGE_KEY) as unknown as Auth | null;
      if (auth) {
        this.auth = { ...auth };
        this.isAuthenticated = true;
      } else {
        this.removeAuthData();
        navigateTo('auth/login');
      }
    },

    logout() {
      this.removeAuthData();
      navigateTo('auth/login');
    },
  },
});
