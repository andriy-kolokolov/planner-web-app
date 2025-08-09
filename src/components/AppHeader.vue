<template>
  <header
    class="sticky top-0 z-40 border-b border-gray-200/70 dark:border-gray-700/60 bg-white/75 dark:bg-gray-800/60 backdrop-blur shadow-sm"
  >
    <div class="flex items-center justify-between h-16 px-3 sm:px-4">
      <!-- Brand + controls -->
      <div class="flex items-center gap-1.5">
        <!-- Mobile hamburger -->
        <UButton class="md:hidden" variant="ghost" square aria-label="Open menu" @click="openMobileSidebar">
          <UIcon name="i-heroicons-bars-3-20-solid" class="w-5 h-5" />
        </UButton>

        <!-- Desktop collapse/expand -->
        <UButton
          class="hidden md:inline-flex"
          variant="ghost"
          square
          :aria-label="isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'"
          @click="toggleSidebarCollapsed"
        >
          <UIcon :name="isSidebarCollapsed ? 'i-heroicons-chevron-right' : 'i-heroicons-chevron-left'" class="w-5 h-5" />
        </UButton>

        <!-- Logo / title -->
        <div class="flex items-center gap-2">
          <div class="flex items-center justify-center h-9 w-9 rounded-xl bg-primary-100 dark:bg-primary-900/30">
            <UIcon name="i-heroicons-cube" class="h-5 w-5 text-primary-600 dark:text-primary-400" />
          </div>
          <Transition name="fade-scale">
            <NuxtLink v-if="isSidebarVisuallyCollapsed || isMediumUp" to="/" class="font-semibold tracking-tight"> Planner</NuxtLink>
          </Transition>
        </div>
      </div>

      <!-- Desktop search -->
      <div class="hidden md:flex items-center w-full max-w-lg mx-4">
        <form class="relative w-full" @submit.prevent="handleSearchSubmit">
          <UIcon name="i-heroicons-magnifying-glass-20-solid" class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <UInput
            v-model="searchQuery"
            :ui="{ base: 'pl-10 pr-14' }"
            color="gray"
            variant="outline"
            placeholder="Search…"
            aria-label="Search"
          />
          <span
            class="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-400 hidden lg:inline-flex items-center gap-1"
          >
            <span class="rounded border border-gray-300/80 dark:border-gray-600/80 px-1">⌘</span>K
          </span>
        </form>
      </div>

      <!-- Actions -->
      <div class="flex items-center gap-1 sm:gap-2">
        <!-- Mobile search -->
        <UPopover class="md:hidden" :popper="{ strategy: 'absolute' }">
          <template #default="{ open }">
            <UButton variant="ghost" square :class="[open && 'bg-gray-50 dark:bg-gray-800']" aria-label="Open search">
              <UIcon name="i-heroicons-magnifying-glass-20-solid" class="w-5 h-5" />
            </UButton>
          </template>
          <template #panel>
            <div class="p-3 w-[82vw] max-w-sm">
              <form @submit.prevent="handleSearchSubmit">
                <UInput v-model="searchQuery" color="gray" variant="outline" placeholder="Search…" aria-label="Search" autofocus />
              </form>
            </div>
          </template>
        </UPopover>

        <!-- Color picker (keeps your ColorPickerPill) -->
        <UPopover mode="hover" :popper="{ strategy: 'absolute' }" :ui="{ width: 'w-[176px]' }" :delay="{ show: 60, hide: 80 }">
          <template #default="{ open }">
            <UButton variant="ghost" square :class="[open && 'bg-gray-50 dark:bg-gray-800']" aria-label="Open color picker">
              <UIcon name="i-heroicons-swatch-20-solid" class="w-5 h-5 text-primary-600 dark:text-primary-400" />
            </UButton>
          </template>
          <template #panel>
            <div class="p-2">
              <div class="grid grid-cols-5 gap-1.5">
                <ColorPickerPill
                  v-for="colorOption in primaryColorOptions"
                  :key="colorOption.value"
                  :color="colorOption"
                  :selected="selectedPrimaryColor"
                  @select="selectedPrimaryColor = colorOption"
                />
              </div>
            </div>
          </template>
        </UPopover>

        <!-- Theme toggle -->
        <UButton
          square
          variant="ghost"
          class="p-2 rounded"
          :aria-label="`Switch to ${colorMode.preference === 'dark' ? 'light' : 'dark'} mode`"
          @click="toggleTheme"
        >
          <UIcon v-if="colorMode.preference === 'dark'" name="i-heroicons-sun-20-solid" class="w-5 h-5" />
          <UIcon v-else name="i-heroicons-moon-20-solid" class="w-5 h-5" />
        </UButton>

        <!-- Profile dropdown (RESTORED) -->
        <UDropdown :items="userDropdownItems" :popper="{ placement: 'bottom-end' }">
          <template #sign-out="{ item }">
            <div class="flex gap-1 items-center justify-start w-full text-sm rounded-md text-red-400 dark:text-red-500">
              <UIcon :name="item.icon" class="h-5 w-5 flex-shrink-0 text-red-400 dark:text-red-500" />
              <span class="truncate">{{ item.label }}</span>
            </div>
          </template>

          <UButton variant="ghost" class="pl-1 pr-2" aria-label="Open account menu">
            <UAvatar :src="userAvatarUrl" size="sm" class="mr-2" />
            <span class="hidden sm:inline truncate max-w-[10ch]">{{ userDisplayName }}</span>
            <UIcon name="i-heroicons-chevron-down-20-solid" class="w-4 h-4 ml-1 text-gray-500" />
          </UButton>
        </UDropdown>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import colors from '#tailwind-config/theme/colors';
import { useAppConfig, useColorMode } from '#imports';
import { computed, ref } from 'vue';
import { UAvatar, UButton, UDropdown, UIcon, UInput, UPopover } from '#components';
import { NUXT_UI_PRIMARY_COLOR } from '~/constants/localStorageKeys';
import { useSidebarState } from '~/composables/useSidebarState';

const { isSidebarCollapsed, isSidebarVisuallyCollapsed, isMediumUp, toggleSidebarCollapsed, openMobileSidebar } = useSidebarState();

/* Theme */
const colorMode = useColorMode();

function toggleTheme() {
  colorMode.preference = colorMode.preference === 'dark' ? 'light' : 'dark';
}

/* Color picker */
const applicationConfig = useAppConfig();
const primaryColorOptions = computed(() =>
  applicationConfig.ui.colors
    .filter((colorName: string) => colorName !== 'primary')
    .map((colorName: string) => ({
      value: colorName,
      text: colorName,
      hex: colors[colorName]?.[colorMode.value === 'dark' ? 400 : 500] ?? '',
    })),
);
const selectedPrimaryColor = computed({
  get() {
    return primaryColorOptions.value.find((o) => o.value === applicationConfig.ui.primary) ?? null;
  },
  set(option) {
    if (!option) return;
    applicationConfig.ui.primary = option.value;
    try {
      localStorage.setItem(NUXT_UI_PRIMARY_COLOR, option.value);
    } catch {}
  },
});

/* Search */
const searchQuery = ref('');

function handleSearchSubmit() {
  if (!searchQuery.value?.trim()) return;
  // navigateTo({ path: '/search', query: { q: searchQuery.value } })
  searchQuery.value = '';
}

/* Profile dropdown data (example) */
const userDisplayName = computed(() => {
  const { auth } = useAuthStore();

  if (!auth || !auth.user) {
    return 'Sign in';
  }
  return auth.user.name;
});
const userAvatarUrl = ref('https://i.pravatar.cc/64?img=13');
const userDropdownItems = [
  [
    { label: 'Profile', icon: 'i-heroicons-user-20-solid', to: '/auth/profile' },
    { label: 'Settings', icon: 'i-heroicons-cog-6-tooth-20-solid', to: '/settings' },
  ],
  [
    {
      label: 'Sign out',
      icon: 'i-heroicons-arrow-right-on-rectangle-20-solid',
      slot: 'sign-out',
      click: useAuthStore().logout,
    },
  ],
];
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
