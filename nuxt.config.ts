// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxt/ui', '@nuxt/eslint', '@nuxt/icon', '@nuxtjs/tailwindcss', '@pinia/nuxt'],
  ssr: false,
  devtools: { enabled: true },
  css: ['~/assets/scss/main.scss'],
  ui: {
    global: true,
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
      appHost: '', // overridden by NUXT_PUBLIC_APP_HOST
      appPort: '', // overridden by NUXT_PUBLIC_APP_PORT
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
