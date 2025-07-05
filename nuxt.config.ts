// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxt/ui', '@nuxt/eslint', '@nuxt/icon', '@nuxtjs/tailwindcss', '@pinia/nuxt', '@nuxtjs/color-mode'],
  ssr: false,
  devtools: { enabled: true },
  css: ['~/assets/scss/main.scss'],
  colorMode: {
    classSuffix: '', // so it uses `<html class="dark">` instead of `dark-mode`
  },
  ui: {
    global: true,
    safelistColors: [ 'brand-primary', 'brand-secondary', 'brand-accent'],
  },
  runtimeConfig: {
    // const config = useRuntimeConfig()
    // console.log('App Name:', config.public.appName)

    // apiSecret: '123',
    // # putting in .env -> This will override the value of apiSecret
    // NUXT_API_SECRET=api_secret_token
    // 👇 define your public keys here so NUXT_PUBLIC_… can override them
    public: {
      appName: '', // overridden by NUXT_PUBLIC_APP_NAME
      appHost: '',
      appPort: '',
      apiUrl: '',
      apiSecretKey: '',
    },
    modules: ['@nuxtjs/robots'],
    robots: {
      UserAgent: '*',
      Disallow: '/',
    },
  },
  srcDir: './src',
  compatibilityDate: '2025-07-02',
  eslint: {
    config: {
      stylistic: {
        // use .prettierrc.json
        // semi: true,
        // quotes: 'double',
      },
    },
  },
});
