<template>
  <section class="not-prose w-full rounded-lg ring-1 shadow-sm ring-gray-200 bg-white dark:ring-gray-700 dark:bg-gray-800/70">
    <!-- Header -->
    <div
      class="flex items-center justify-between gap-2 px-3 py-2 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/60 rounded-t-lg"
    >
      <h3 v-if="title" class="text-xs font-medium text-gray-700 dark:text-gray-300">
        {{ title }}
      </h3>

      <UButton v-if="copy" size="xs" variant="soft" :color="copied ? 'green' : 'gray'" @click="copyToClipboard">
        {{ copied ? 'Copied' : 'Copy' }}
      </UButton>
    </div>

    <!-- Code area -->
    <div class="relative">
      <pre
        :class="[
          'overflow-x-auto font-mono text-[13px] leading-6 p-4 rounded-b-lg',
          wrap ? 'whitespace-pre-wrap break-words' : 'whitespace-pre',
          // Light theme
          'text-gray-800 bg-gray-50',
          // Dark theme
          'dark:text-gray-100 dark:bg-gray-900',
        ]"
        :style="{ maxHeight }"
        aria-live="polite"
      ><code>{{ rendered }}</code></pre>

      <!-- Empty state -->
      <p
        v-if="showEmpty && !hasValue"
        class="absolute inset-0 grid place-content-center text-xs text-gray-500 dark:text-gray-400 select-none"
      >
        No data to display
      </p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref, toRaw, unref } from 'vue';

interface Props {
  value: unknown;
  title?: string;
  copy?: boolean;
  showEmpty?: boolean;
  maxHeight?: string;
  wrap?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Code',
  copy: true,
  showEmpty: false,
  maxHeight: '20rem',
  wrap: false,
});

const hasValue = computed(() => props.value !== null && typeof props.value !== 'undefined');

/** Safe JSON replacer: handles circular refs, Vue proxies, bigint, undefined */
const jsonReplacer = (() => {
  const seen = new WeakSet();
  return (_k: string, v: any) => {
    if (typeof v === 'bigint') return v.toString();
    if (typeof v === 'undefined') return null;
    if (v && typeof v === 'object') {
      if (seen.has(v)) return '[Circular]';
      seen.add(v);
    }
    return v;
  };
})();

const rendered = computed(() => {
  const v = unref(props.value) as any;
  if (v === null) return 'null';
  if (typeof v === 'string') return v;
  try {
    return JSON.stringify(toRaw(v), jsonReplacer, 2);
  } catch {
    try {
      return String(v);
    } catch {
      return '[Unserializable value]';
    }
  }
});

const copied = ref(false);
const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(rendered.value);
    copied.value = true;
    setTimeout(() => (copied.value = false), 1200);
  } catch {
    // Clipboard may be blocked; no-op.
  }
};
</script>
