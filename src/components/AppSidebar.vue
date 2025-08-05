<template>
  <nav class="w-64 h-full bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white flex-shrink-0">
    <div class="flex flex-col justify-between h-full">
      <!-- Top sidebar -->
      <ul>
        <li v-for="item in upperNavItems" :key="item.key">
          <component
            :is="item.path ? NuxtLink : 'button'"
            :to="item.path"
            :class="[
              'flex items-center px-4 py-2 hover:bg-primary-300 dark:hover:bg-gray-700 transition-colors w-full text-left',
              item.color,
            ]"
            :exact-active-class="item.path ? 'bg-primary-300 dark:bg-primary-900' : ''"
            @click="item.action?.()"
          >
            <UIcon v-if="item.icon" :name="item.icon" class="w-5 h-5 mr-3" />
            <span>{{ item.label }}</span>
          </component>
        </li>
      </ul>

      <!-- Bottom sidebar -->
      <ul>
        <li v-for="item in lowerNavItems" :key="item.key">
          <component
            :is="item.path ? NuxtLink : 'button'"
            :to="item.path"
            :class="['flex items-center px-4 py-2 hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors w-full text-left', item.color]"
            :exact-active-class="item.path ? 'bg-primary-300 dark:bg-primary-900' : ''"
            @click="item.action?.()"
          >
            <UIcon v-if="item.icon" :name="item.icon" class="w-5 h-5 mr-3" />
            <span>{{ item.label }}</span>
          </component>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { NuxtLink } from '#components';
import { lowerNavItems, upperNavItems } from '~/config/nav';
</script>
