export default defineNuxtRouteMiddleware((to, _from) => {
  console.log('auth middleware');

  const authStore = useAuthStore();
  const auth = authStore.getAuthData();

  const isAuthPage = ['/auth/login', '/auth/signup'].includes(to.path);
  const isAuthRequired = !isAuthPage;

  if (!auth && isAuthRequired) {
    return navigateTo('/auth/login');
  }

  // redirect to dashboard avoiding welcome page at `/`
  if (auth && !isAuthPage && to.path === '/') {
    return navigateTo('/dashboard');
  }
});
