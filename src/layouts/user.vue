<template>
  <div class="flex h-screen">
    <!-- Sidebar - fixed width -->
    <AppSidebar class="flex-shrink-0" />

    <!-- Main area - header + content -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- Header - fixed height -->
      <AppHeader />

      <!-- Scrollable content area -->
      <main class="flex-1 overflow-auto p-6">
        <slot />
      </main>
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
