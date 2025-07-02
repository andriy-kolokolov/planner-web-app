<template>
  <div class="flex h-screen">
    <AppSidebar />
    <div class="flex-1 overflow-auto">
      <AppHeader />
      <p>Guest layout - {{ useRoute().path }} page</p>
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
