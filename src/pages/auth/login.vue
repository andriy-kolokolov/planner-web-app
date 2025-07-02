<template>
  <h1 v-if="true" class="flex p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400">Login</h1>
</template>

<script setup lang="ts">
import { reactive } from 'vue';

interface Props {}

interface State {}

const props = withDefaults(defineProps<Props>(), {});

const state = reactive<State>({});
</script>

<style scoped></style>
