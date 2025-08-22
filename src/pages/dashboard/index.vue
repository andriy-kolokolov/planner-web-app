<template>
  <UButton :loading="loading" @click="getUserData">User data</UButton>

  <CodeSnippet class="mt-4" :value="state.userData" title="User data (JSON)" :show-empty="true" max-height="24rem" :wrap="true" />
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { useAuthStore } from '~/stores/useAuthStore';
import type { UserResource } from '~/types/resources';
import CodeSnippet from '~/components/ui/CodeSnippet.vue';

interface State {
  userData: UserResource | null;
}
const state = reactive<State>({ userData: null });
const loading = ref(false);

const getUserData = async () => {
  loading.value = true;
  try {
    const { $axios } = useNuxtApp();
    const resp = await $axios.get<{ user: UserResource }>('/api/v1/auth/user');

    console.log('resp', resp);

    state.userData = { ...resp.data.user };
    console.log('get auth data', useAuthStore().getAuthData());
  } catch (err) {
    state.userData = { error: (err as any)?.message ?? 'Unknown error' };
  } finally {
    loading.value = false;
  }
};
</script>
