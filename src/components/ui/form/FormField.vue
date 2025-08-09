<template>
  <UFormGroup v-bind="$attrs" :help="props.help" :error="hasErrors" :required="props.required">
    <UInput
      v-model="value"
      :placeholder="props.placeholder"
      :type="props.inputType"
      :icon="props.inputIcon"
      :trailing-icon="hasErrors && showErrorIcon ? 'i-heroicons-exclamation-triangle-20-solid' : undefined"
    />
    <div
      v-for="err in props.errors"
      class="text-sm"
      :class="[hasErrors ? 'text-red-500 dark:text-red-400' : 'text-primary-500 dark:text-primary-400']"
    >
      {{ err }}
    </div>
  </UFormGroup>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import UFormGroup from '#ui/components/forms/FormGroup.vue';
import type Input from '#ui/components/forms/Input.vue';
import UInput from '#ui/components/forms/Input.vue';

type FormFieldProps = {
  placeholder: string;
  required?: boolean;
  errors?: string[] | null;
  showErrorIcon?: boolean;
  help?: string;
  inputType?: InstanceType<typeof Input>['$props']['type'];
  inputIcon?: InstanceType<typeof Input>['$props']['icon'];
};

const props = withDefaults(defineProps<FormFieldProps>(), {
  errors: () => [],
  showErrorIcon: false,
  help: '',
});

const value = defineModel<string | number | undefined>('value', { default: '' });
const hasErrors = computed(() => props.errors!.length > 0);
</script>
