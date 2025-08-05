// types/plugins.d.ts
import type { toast } from 'vue3-toastify';
import type { AxiosInstance } from 'axios';

interface PluginsInjections {
  $toast: typeof toast;
  $axios: AxiosInstance;
}

declare module '#app' {
  interface NuxtApp extends PluginsInjections {}
}

declare module 'nuxt/dist/app/nuxt' {
  interface NuxtApp extends PluginsInjections {}
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties extends PluginsInjections {}
}
