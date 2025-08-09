<template>
  <aside
    :class="[
      'h-full bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white flex-shrink-0 border-r border-gray-200/60 dark:border-gray-700/60',
      'overflow-hidden',
      'transition-[width] duration-300 ease-in-out',
      isSidebarVisuallyExpanded ? 'w-64' : 'w-16',
    ]"
    @mouseenter="onAsideMouseEnter"
    @mouseleave="onAsideMouseLeave"
  >
    <!-- Header / Toggle -->
    <div class="flex items-center justify-between p-2">
      <div class="flex items-center gap-2 px-1">
        <UIcon name="i-heroicons-cube" class="h-5 w-5" />
        <Transition name="fade-scale">
          <span v-if="!isSidebarVisuallyCollapsed" class="font-semibold truncate">Application</span>
        </Transition>
      </div>

      <UButton
        variant="ghost"
        color="gray"
        size="xs"
        :icon="isSidebarCollapsed ? 'i-heroicons-chevron-right' : 'i-heroicons-chevron-left'"
        class="shrink-0"
        :aria-label="isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'"
        :aria-expanded="(!isSidebarCollapsed).toString()"
        @click="toggleSidebarCollapsed"
      />
    </div>

    <div class="flex flex-col justify-between h-[calc(100%-44px)]">
      <!-- Upper navigation -->
      <ul class="py-2 space-y-1">
        <SidebarNavigationItem
          v-for="navigationItem in navigationItemsUpperComputed"
          :key="navigationItem.key"
          :navigation-item="navigationItem"
          :is-collapsed="isSidebarVisuallyCollapsed"
          @request-expand="expandSidebar"
        />
      </ul>
      <!-- Lower navigation -->
      <ul class="py-2 space-y-1">
        <SidebarNavigationItem
          v-for="navigationItem in navigationItemsLowerComputed"
          :key="navigationItem.key"
          :navigation-item="navigationItem"
          :is-collapsed="isSidebarVisuallyCollapsed"
          @request-expand="expandSidebar"
        />
      </ul>
    </div>
  </aside>
</template>

<script setup lang="ts">
/**
 * Collapsible sidebar with "hover-to-peek".
 * - Pinned state persisted with useLocalStorage.
 * - Visual expansion also occurs on hover when collapsed.
 */
import { computed, ref } from 'vue';
import { useLocalStorage } from '@vueuse/core';
import { UButton, UIcon } from '#components';
import { lowerNavItems as navigationItemsLower, upperNavItems as navigationItemsUpper } from '~/config/nav';
import type { NavItem } from '~/config/nav';

const isSidebarCollapsed = useLocalStorage<boolean>('ui:sidebar:collapsed', false);

/** Hover-to-peek (does not change persisted state) */
const isSidebarHoverExpanded = ref(false);
let hoverTimer: ReturnType<typeof setTimeout> | null = null;

const isSidebarVisuallyExpanded = computed(() => !isSidebarCollapsed.value || isSidebarHoverExpanded.value);
const isSidebarVisuallyCollapsed = computed(() => !isSidebarVisuallyExpanded.value);

const navigationItemsUpperComputed = computed<NavItem[]>(() => navigationItemsUpper as NavItem[]);
const navigationItemsLowerComputed = computed<NavItem[]>(() => navigationItemsLower as NavItem[]);

function toggleSidebarCollapsed() {
  isSidebarCollapsed.value = !isSidebarCollapsed.value;
}
function expandSidebar() {
  if (isSidebarCollapsed.value) isSidebarCollapsed.value = false;
}

function onAsideMouseEnter() {
  if (!isSidebarCollapsed.value) return;
  if (hoverTimer) clearTimeout(hoverTimer);
  // small delay feels less twitchy
  hoverTimer = setTimeout(() => (isSidebarHoverExpanded.value = true), 80);
}
function onAsideMouseLeave() {
  if (!isSidebarCollapsed.value) return;
  if (hoverTimer) clearTimeout(hoverTimer);
  hoverTimer = setTimeout(() => (isSidebarHoverExpanded.value = false), 120);
}
</script>

<style scoped>
/* Title fade/scale */
:global(.fade-scale-enter-active),
:global(.fade-scale-leave-active) {
  transition:
    opacity 180ms ease,
    transform 180ms ease;
}
:global(.fade-scale-enter-from),
:global(.fade-scale-leave-to) {
  opacity: 0;
  transform: scale(0.98);
}
</style>
