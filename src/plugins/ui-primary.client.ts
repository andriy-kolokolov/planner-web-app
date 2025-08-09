import { NUXT_UI_PRIMARY_COLOR } from '~/constants/localStorageKeys';

export default defineNuxtPlugin(() => {
  const appConfig = useAppConfig();

  try {
    const saved = localStorage.getItem(NUXT_UI_PRIMARY_COLOR);
    // Only accept values that exist in your allowed palette
    if (saved && Array.isArray(appConfig.ui.colors) && appConfig.ui.colors.includes(saved)) {
      appConfig.ui.primary = saved;
    }
  } catch {
    // ignore storage errors (Safari private mode, etc.)
  }
});
