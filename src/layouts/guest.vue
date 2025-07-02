<template>
  <div class="flex h-screen">
    <Sidebar />
    <div class="flex-1 overflow-auto">
      <header>This is a guest layout</header>
      <p>Some default layout content shared across all guest pages</p>
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
