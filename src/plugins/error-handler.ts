export default defineNuxtPlugin((nuxtApp) => {
  // nuxtApp.vueApp.config.errorHandler = (error, instance, info) => {
  //   // handle error, e.g. report to a service
  // }

  nuxtApp.hook('vue:error', (error, instance, info) => {
    console.error({ error, info });
  });
});
