<template>
  <UCard>
    <UForm :schema="loginFormSchema" :state="loginForm" class="space-y-4" @submit="onSubmit">
      <UFormGroup label="Username" name="username">
        <UInput
          v-model="loginForm.username"
          placeholder="nik they probably forget to write"
          icon="i-heroicons-user-circle"
          :disabled="loginForm.processing"
        />
      </UFormGroup>
      <UFormGroup label="Password" name="password">
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
import type { AuthResponse } from '~/types/response';

const onSubmit = async () => {
  await loginForm.post<AuthResponse>('api/v1/auth/login', {
    forceUrlEncoded: true,
    onSuccess: (response) => {
      // response.data is now typed as AuthResponse
      useNuxtApp().$toast.success('Login successful!');
      // Allow toast to show before navigation
      setTimeout(() => {
        useAuthStore().setAuthData(response.data);
        navigateTo('/dashboard');
      }, 500);
    },
    onError: (error) => {
      useNuxtApp().$toast.error(error.detail || 'Login failed!');
    },
  });
};
</script>
