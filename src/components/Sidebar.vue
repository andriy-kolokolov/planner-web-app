<template>
  <nav class="w-64 h-full bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white flex-shrink-0">
    <div class="flex flex-col justify-between h-full">
      <!--    top sidebar    -->
      <ul>
        <li v-for="item in upperNavItems" :key="item.path.toString()">
          <NuxtLink
            :to="item.path"
            class="flex items-center px-4 py-2 hover:bg-primary-300 dark:hover:bg-gray-700 transition-colors"
            exact-active-class="bg-primary-300 dark:bg-primary-900"
          >
            <UIcon v-if="item.icon" :name="item.icon" class="w-5 h-5 mr-3" />
            <span>{{ item.label }}</span>
          </NuxtLink>
        </li>
      </ul>
      <!--    bottom sidebar     -->
      <ul>
        <li v-for="item in lowerNavItems" :key="item.path.toString()">
          {{ item.color }}
          <NuxtLink
            :to="item.path"
            :class="item.color ? item.color : ''"
            class="flex items-center px-4 py-2 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
            exact-active-class="bg-gray-300 dark:bg-gray-900"
          >
            <UIcon v-if="item.icon" :name="item.icon" class="w-5 h-5 mr-3" />
            <span>{{ item.label }}</span>
          </NuxtLink>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script setup lang="ts">
// 1. Import the composable:
import { lowerNavItems, upperNavItems } from '~/config/nav';
</script>
