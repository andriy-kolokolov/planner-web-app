<template>
  <h1 class="flex p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400">Login</h1>

  <UCard>
    <UForm :schema="loginFormSchema" :state="loginForm" class="space-y-4" @submit="onSubmit">
      <UFormGroup label="Username" name="username" :error="loginForm.errors.username">
        <UInput
          v-model="loginForm.username"
          placeholder="nik probably they forget write"
          icon="i-heroicons-user-circle"
          :disabled="loginForm.processing"
        />
      </UFormGroup>

      <UFormGroup label="Password" name="password" :error="loginForm.errors.password">
        <UInput
          v-model="loginForm.password"
          placeholder="******"
          icon="i-heroicons-lock-closed"
          type="password"
          :disabled="loginForm.processing"
        />
      </UFormGroup>

      <div class="flex items-center gap-3">
        <UButton type="submit" :loading="loginForm.processing"> LOGIN</UButton>
        <span v-if="loginForm.recentlySuccessful" class="text-sm text-green-600"> Login successful! </span>
      </div>
    </UForm>
  </UCard>
</template>

<script setup lang="ts">
import { loginForm, loginFormSchema } from '~/util/forms/loginForm';

const onSubmit = async () => {
  await loginForm.post('v1/auth/login', {
    forceUrlEncoded: true,
    onSuccess: (response) => {
      // Store token, redirect, etc.
      useNuxtApp().$toast.success('Successfully logged in');
    },
    onError: (error) => {
      if (typeof error.detail === 'string') {
        useNuxtApp().$toast.warning(error.detail);
      } else {
        useNuxtApp().$toast.error('An error occurred while logging in');
      }
    },
  });
};
</script>
