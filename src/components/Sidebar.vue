<template>
  <nav class="w-64 h-full bg-gray-800 text-white flex-shrink-0">
    <ul class="mt-4">
      <li v-for="item in navItems" :key="item.path.toString()">
        <NuxtLink :to="item.path" class="flex items-center px-4 py-2 hover:bg-gray-700" exact-active-class="bg-gray-700">
          <!-- Optional icon slot -->
          <component :is="item.icon" v-if="item.icon" class="w-5 h-5 mr-3" />
          <span>{{ item.label }}</span>
        </NuxtLink>
      </li>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import navItems from '~/config/nav';
import { reactive } from 'vue';

interface Props {}

interface State {}

const props = withDefaults(defineProps<Props>(), {});

const state = reactive<State>({});
</script>

<style scoped></style>
