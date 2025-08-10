// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/ui',
    '@nuxt/eslint',
    '@nuxt/icon',
    '@pinia/nuxt',
    '@nuxtjs/color-mode',
    '@nuxtjs/tailwindcss',
    '@nuxt/fonts',
  ],
  ssr: false,
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  colorMode: {
    classSuffix: '', // so it uses `<html class="dark">` instead of `dark-mode`
  },
  ui: {
    global: true,
    safelistColors: [ 'brand-primary', 'brand-secondary', 'brand-accent'],
  },
  tailwindcss: {
    // Expose tailwind config with #tailwind-config
    exposeConfig: true,
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
      apiSecretHeaderName: '',
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
