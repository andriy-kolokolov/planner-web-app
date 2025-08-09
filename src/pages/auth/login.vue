<template>
  <UCard :ui="{ base: 'w-[400px]' }">
    <template #header>
      <h3 class="">Login</h3>
    </template>
    <UForm :schema="loginFormSchema" :state="loginForm" class="space-y-4" @submit="onSubmit">
      <FormField
        v-model:value="loginForm.email"
        input-icon="i-mdi-email-outline"
        label="Email"
        :errors="loginForm.errors?.email"
        placeholder="margaretti@mail.ru"
      />

      <FormField
        v-model:value="loginForm.password"
        input-icon="i-heroicons-lock-closed"
        label="Password"
        input-type="password"
        :errors="loginForm.errors?.password"
        placeholder="******"
      />

      <div class="flex items-center justify-between gap-3">
        <div class="flex gap-3">
          <UButton type="submit" :loading="loginForm.processing" :disabled="notFullFilledForm"> LOGIN</UButton>
          <span v-if="loginForm.recentlySuccessful" class="text-sm text-green-600"> Login successful! </span>
        </div>
        <UButton variant="link" icon="i-mdi-register" @click="navigateTo('/auth/signup')">Register</UButton>
      </div>
    </UForm>
  </UCard>
</template>

<script setup lang="ts">
import { loginForm, loginFormSchema } from '~/util/forms/loginForm';
import type { AuthResponse } from '~/types/response';
import FormField from '~/components/ui/form/FormField.vue';
import { registerForm } from '~/util/forms/registerForm';

const notFullFilledForm = computed(() => {
  return loginForm.email.length === 0 || loginForm.password.length === 0;
});

const onSubmit = async () => {
  await loginForm.post<AuthResponse>('/api/v1/auth/login', {
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
      console.log(error);
      useNuxtApp().$toast.error(JSON.stringify(error));
    },
  });
};
</script>
