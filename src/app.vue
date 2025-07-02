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
    separator: '-',
  },
});

watch(
  () => authStore.isAuthenticated,
  () => {
    console.log('authStore.isAuthenticated changed');
  },
);

const currentLayoutName = computed(() => {
  return authStore.isAuthenticated ? 'user' : 'guest';
});
</script>
