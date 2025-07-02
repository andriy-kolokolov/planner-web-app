<template>
  <NuxtLayout :name="currentLayoutName">
    <NuxtPage />
  </NuxtLayout>

  <UNotifications />
</template>

<script setup lang="ts">

const authStore = useAuthStore();

useHead({
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} %separator %siteName` : '%siteName';
  },
  templateParams: {
    siteName: 'Planner',
    separator: '-'
  }
});

const currentLayoutName = computed(() => {
  return authStore.isAuthenticated ? "user" : "guest";
});
</script>
