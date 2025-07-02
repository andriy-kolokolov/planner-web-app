<template>
  <div class="flex h-screen">
    <AppSidebar />
    <AppHeader />
    <div class="flex-1 overflow-auto">
      <header>Authenticated layout - {{ useRoute().path }} page</header>
      <p>Some default layout content shared across all auth user pages</p>
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';

interface Props {}

interface State {}

const props = withDefaults(defineProps<Props>(), {});

const state = reactive<State>({});
</script>

<style scoped></style>
