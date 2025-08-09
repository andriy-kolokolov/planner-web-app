<template>
  <UButton :loading="loading" @click="getUserData">User data</UButton>

  <CodeSnippet class="mt-4" :value="state.userData" title="User data (JSON)" :show-empty="true" max-height="24rem" :wrap="true" />
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useAuthStore } from '~/stores/useAuthStore';
import type { User } from '~/types/models';
import CodeSnippet from '~/components/ui/CodeSnippet.vue';

interface State {
  userData: User | null;
}
const state = reactive<State>({ userData: null });
const loading = ref(false);

const getUserData = async () => {
  loading.value = true;
  try {
    const { $axios } = useNuxtApp();
    const resp = await $axios.get<{ user: User }>('/api/v1/auth/user');
    state.userData = { ...resp.data.user };
    console.log('get auth data', useAuthStore().getAuthData());
  } catch (err) {
    state.userData = { error: (err as any)?.message ?? 'Unknown error' };
  } finally {
    loading.value = false;
  }
};
</script>
