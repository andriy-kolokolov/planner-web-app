<template>
  <NuxtPage>
    <UContainer>
      <UCard class="mt-10">
        <template #header>
          <div class="flex justify-between">
            <h1>Welcome to Nuxt UI Starter !!!!!!</h1>
            <ColorScheme>
              <USelect v-model="$colorMode.preference" :options="['system', 'light', 'dark']" />
            </ColorScheme>
          </div>
        </template>
        <div class="flex gap-3">
          <UButton icon="i-heroicons-book-open" to="https://ui.nuxt.com" target="_blank">Open Nuxt UI Documentation</UButton>
          <UButton icon="i-heroicons-check" @click="showHi">Hi</UButton>
          <div class="p-3">
            {{ config.public }}
          </div>
        </div>
      </UCard>
    </UContainer>
  </NuxtPage>
  <UNotifications />
</template>

<script setup lang="ts">

const toast = useToast();
const config = useRuntimeConfig();
const showHi = () => {
  useToast().add({
    title: "Hello world",
    description: "This is a toast message. It is very useful for debugging purposes. A really usefull thing",
    color: "green",
  });

};
</script>
