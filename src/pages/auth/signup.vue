<template>
  <UCard :ui="{ base: 'w-[400px]' }">
    <template #header>
      <h3 class="">Signup</h3>
    </template>
    <UForm :disabled="registerForm.processing" :schema="registerFormSchema" :state="registerForm" class="space-y-4" @submit="submitSignup">
      <FormField
        v-model:value="registerForm.name"
        required
        input-icon="i-mdi-user"
        label="Name or Nick"
        :errors="registerForm.errors?.name"
        placeholder="nik they probably forget to write..."
      />

      <FormField
        v-model:value="registerForm.lastname"
        input-icon="i-mdi-user"
        label="Lastname"
        :errors="registerForm.errors?.lastname"
        placeholder="margareeetti..."
      />

      <FormField
        v-model:value="registerForm.email"
        required
        input-icon="i-mdi-email-outline"
        label="Email"
        :errors="registerForm.errors?.email"
        placeholder="margaretti@mail.ru"
      />

      <FormField
        v-model:value="registerForm.password"
        required
        input-icon="i-heroicons-lock-closed"
        label="Password"
        input-type="password"
        :errors="registerForm.errors?.password"
        placeholder="******"
      />

      <div class="flex items-center justify-between gap-3">
        <UButton variant="link" icon="i-mdi-arrow-back-circle" @click="navigateTo('/auth/login')">Login</UButton>
        <div>
          <UButton :loading="registerForm.processing" :disabled="notFullFilledForm" icon="i-mdi-register" @click="submitSignup">
            Signup
          </UButton>
          <span v-if="registerForm.recentlySuccessful" class="text-sm text-green-600"> (TODO) Verification email sent ! </span>
        </div>
      </div>
    </UForm>
  </UCard>
</template>

<script setup lang="ts">
import { registerForm, registerFormSchema } from '~/util/forms/registerForm';
import type { RegisterResponse } from '~/types/response';
import FormField from '~/components/ui/form/FormField.vue';

const notFullFilledForm = computed(() => {
  return registerForm.email.length === 0 || registerForm.password.length === 0;
});

const submitSignup = async () => {
  await registerForm.post<RegisterResponse>('/api/v1/auth/register', {
    forceUrlEncoded: true,
    onSuccess: (response) => {
      setTimeout(() => {
        navigateTo('/dashboard');
        registerForm.reset();
      }, 500);
    },
    onError: (error) => {
      console.log(error);
      useNuxtApp().$toast.error(error?.message || 'Registration failed!');
    },
  });
};
</script>
