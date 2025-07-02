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
import { onMounted, reactive } from 'vue';
import colors from '#tailwind-config/theme/colors';

const colorMode = useColorMode();
// `colorMode.preference` is reactive and writes to localStorage,
// and the module will add/remove `.dark` on <html>.

const toggleTheme = () => {
  colorMode.preference = colorMode.preference === 'dark' ? 'light' : 'dark';
};

const appConfig = useAppConfig();

const primaryColors = computed(() =>
  appConfig.ui.colors
    .filter((color) => color !== 'primary')
    .map((color) => ({ value: color, text: color, hex: colors[color][colorMode.value === 'dark' ? 400 : 500] })),
);
const primary = computed({
  get() {
    return primaryColors.value.find((option) => option.value === appConfig.ui.primary);
  },
  set(option) {
    if (!option) return;
    appConfig.ui.primary = option.value;

    window.localStorage.setItem('nuxt-ui-primary', appConfig.ui.primary);
  },
});

onMounted(() => {
  console.log(appConfig.ui.colors);
});
</script>

<style scoped></style>
