<template>
  <!-- Desktop sidebar -->
  <aside
    v-bind="attrs"
    class="hidden md:block h-full border-r border-gray-200/70 font-bold dark:border-gray-700/60 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white overflow-hidden transition-[width] duration-300 ease-in-out"
    :class="isSidebarVisuallyExpanded ? 'w-64' : 'w-16'"
    @mouseenter="onAsideMouseEnter"
    @mouseleave="onAsideMouseLeave"
  >
    <!--    <div class="flex items-center justify-between px-5 py-3"> -->
    <!--      <div class="flex items-center"> -->
    <!--        <UIcon name="i-heroicons-cube" /> -->
    <!--        <Transition name="fade-scale"> -->
    <!--          <span v-if="!isSidebarVisuallyCollapsed" class="font-semibold truncate text-sm">Planner</span> -->
    <!--        </Transition> -->
    <!--      </div> -->
    <!--      <UButton variant="ghost" color="gray" size="xs" -->
    <!--               :icon="isSidebarCollapsed ? 'i-heroicons-chevron-right' : 'i-heroicons-chevron-left'" -->
    <!--               class="shrink-0" -->
    <!--               :aria-label="isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'" -->
    <!--               :aria-expanded="(!isSidebarCollapsed).toString()" -->
    <!--               @click="toggleSidebarCollapsed" /> -->
    <!--    </div> -->

    <div class="flex flex-col justify-between h-[calc(100%-44px)]">
      <div class="py-2 m-0 flex flex-col gap-1.5">
        <SidebarNavigationItem
          v-for="navigationItem in navigationItemsUpperComputed"
          :key="navigationItem.key"
          :navigation-item="navigationItem"
          :is-collapsed="isSidebarVisuallyCollapsed"
          @request-expand="expandSidebar"
        />
        <div class="px-5 py-2">
          <UDivider />
        </div>
      </div>

      <div class="py-2 m-0 flex flex-col gap-1.5">
        <div class="px-5 py-2">
          <UDivider />
        </div>
        <SidebarNavigationItem
          v-for="navigationItem in navigationItemsLowerComputed"
          :key="navigationItem.key"
          :navigation-item="navigationItem"
          :is-collapsed="isSidebarVisuallyCollapsed"
          @request-expand="expandSidebar"
        />
      </div>
    </div>
  </aside>

  <!-- Mobile slideover -->
  <USlideover v-model="isMobileSidebarOpen" side="left" :ui="{ width: 'max-w-[18rem]' }" class="md:hidden">
    <div class="h-full bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white border-r border-gray-200/70 dark:border-gray-700/60">
      <div class="flex items-center justify-between p-3 border-b border-gray-200/70 dark:border-gray-700/60">
        <div class="flex items-center gap-2">
          <UIcon name="i-heroicons-cube" class="h-5 w-5" />
          <span class="font-semibold">Application</span>
        </div>
        <UButton variant="ghost" square aria-label="Close menu" @click="closeMobileSidebar">
          <UIcon name="i-heroicons-x-mark-20-solid" class="h-5 w-5" />
        </UButton>
      </div>

      <div class="flex flex-col justify-between h-[calc(100%-52px)]">
        <div class="py-2">
          <SidebarNavigationItem
            v-for="navigationItem in navigationItemsUpperComputed"
            :key="navigationItem.key"
            :navigation-item="navigationItem"
            :is-collapsed="false"
          />
        </div>
        <ul class="py-2">
          <SidebarNavigationItem
            v-for="navigationItem in navigationItemsLowerComputed"
            :key="navigationItem.key"
            :navigation-item="navigationItem"
            :is-collapsed="false"
          />
        </ul>
      </div>
    </div>
  </USlideover>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { UButton, UIcon, USlideover } from '#components';
import { lowerNavItems as navigationItemsLower, upperNavItems as navigationItemsUpper } from '~/config/nav';
import type { NavItem } from '~/config/nav';
import { useSidebarState } from '~/composables/useSidebarState';

const {
  isSidebarCollapsed,
  isSidebarVisuallyExpanded,
  isSidebarVisuallyCollapsed,
  isMobileSidebarOpen,
  toggleSidebarCollapsed,
  expandSidebar,
  closeMobileSidebar,
  onAsideMouseEnter,
  onAsideMouseLeave,
} = useSidebarState();

defineOptions({ inheritAttrs: false });
const attrs = useAttrs();

const navigationItemsUpperComputed = computed<NavItem[]>(() => navigationItemsUpper as NavItem[]);
const navigationItemsLowerComputed = computed<NavItem[]>(() => navigationItemsLower as NavItem[]);
</script>

<style scoped>
:global(.fade-scale-enter-active),
:global(.fade-scale-leave-active) {
  transition:
    opacity 160ms ease,
    transform 160ms ease;
}
:global(.fade-scale-enter-from),
:global(.fade-scale-leave-to) {
  opacity: 0;
  transform: translateX(2px);
}
</style>
