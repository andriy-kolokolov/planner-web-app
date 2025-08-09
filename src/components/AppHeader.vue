<template>
  <header class="bg-white dark:bg-gray-700 shadow-md shadow-gray-200 dark:shadow-none">
    <div class="flex items-center justify-between h-16 px-4">
      <div>Logo</div>

      <div class="flex items-center gap-x-2">
        <UPopover mode="hover" :popper="{ strategy: 'absolute' }" :ui="{ width: 'w-[156px]' }">
          <template #default="{ open }">
            <UButton variant="ghost" square :class="[open && 'bg-gray-50 dark:bg-gray-800']" aria-label="Color picker">
              <UIcon name="i-heroicons-swatch-20-solid" class="w-5 h-5 text-primary-500 dark:text-primary-400" />
            </UButton>
          </template>

          <template #panel>
            <div class="p-2">
              <div class="grid grid-cols-5 gap-px">
                <ColorPickerPill
                  v-for="color in primaryColors"
                  :key="color.value"
                  :color="color"
                  :selected="primary"
                  @select="primary = color"
                />
              </div>
            </div>
          </template>
        </UPopover>

        <UButton
          square
          variant="ghost"
          class="p-2 rounded transition-colors"
          :aria-label="`Switch to ${colorMode.preference === 'dark' ? 'light' : 'dark'} mode`"
          @click="toggleTheme"
        >
          <template v-if="colorMode.preference === 'dark'">
            <UIcon name="heroicons:sun" class="w-5 h-5" />
          </template>
          <template v-else>
            <UIcon name="heroicons:moon" class="w-5 h-5" />
          </template>
        </UButton>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import colors from '#tailwind-config/theme/colors';
import { NUXT_UI_PRIMARY_COLOR } from '~/constants/localStorageKeys';

const colorMode = useColorMode();
const appConfig = useAppConfig();

const toggleTheme = () => {
  colorMode.preference = colorMode.preference === 'dark' ? 'light' : 'dark';
};

// Build swatches using current theme tone for preview chip
const primaryColors = computed(() =>
  appConfig.ui.colors
    .filter((color: string) => color !== 'primary')
    .map((color: string) => ({
      value: color,
      text: color,
      // 400 for dark, 500 for light for better contrast in the pill only
      hex: colors[color]?.[colorMode.value === 'dark' ? 400 : 500] ?? '',
    })),
);

// Two-way binding to appConfig.ui.primary with persistence
const primary = computed({
  get() {
    return primaryColors.value.find((colorOption) => colorOption.value === appConfig.ui.primary) ?? null;
  },
  set(option) {
    if (!option) return;
    appConfig.ui.primary = option.value;
    try {
      localStorage.setItem(NUXT_UI_PRIMARY_COLOR, option.value);
    } catch {
      /* ignore */
    }
  },
});
</script>
