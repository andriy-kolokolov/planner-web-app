export default defineNuxtRouteMiddleware((to, from) => {
  console.log('auth middleware')

  const notRequiredAuth = ['/auth/login', '/auth/signup'].includes(to.path)

  const authStore = useAuthStore();

  if(authStore.isAuthenticated && notRequiredAuth) {
    return navigateTo('/')
  }

  if (!authStore.isAuthenticated && !notRequiredAuth) {
    return navigateTo('/auth/login')
  }
})