<template>
  <NuxtLayout :name="currentLayoutName">
    <NuxtPage />
  </NuxtLayout>

  <UNotifications />
</template>

<script setup lang="ts">
const authStore = useAuthStore();
const route = useRoute();

const pageTitle = computed(() => {
  if (route.meta?.title) {
    return route.meta.title as string;
  }
  if (route.name) {
    // e.g. ['dashboard'] or ['admin', 'settings']
    const parts = String(route.name).split('-');
    return parts[parts.length - 1].replace(/(^\w)/, (m) => m.toUpperCase());
  }
  // fallback to last path segment
  return (
    route.path
      .split('/')
      .pop()
      ?.replace(/[-_]/g, ' ')
      .replace(/(^\w)/, (m) => m.toUpperCase()) || 'Page'
  );
});

useHead(() => ({
  title: pageTitle.value,
  titleTemplate: `%s - Planner`,
  meta: [{ name: 'description', content: 'My amazing site.' }],
}));

const currentLayoutName = computed(() => {
  return authStore.isAuthenticated ? 'user' : 'guest';
});

onBeforeMount(() => {
  authStore.initAuth();
});
</script>
