<template>
  <div class="min-h-screen flex flex-col">
    <!-- Main content area takes remaining space -->
    <main class="flex-1 flex items-center justify-center">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue';

interface Props {}
interface State {}

const props = withDefaults(defineProps<Props>(), {});
const state = reactive<State>({});
</script>
