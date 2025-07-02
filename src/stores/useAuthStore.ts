export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    isAuthenticated: false,
  }),
  actions: {
    // ? const { data: count } = await useFetch('/api/count')
    async login() {},
    async logout() {},
  },
  getters: {},
});
