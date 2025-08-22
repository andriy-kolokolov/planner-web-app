<template>
  <BaseResourceTable :columns="columns" :data="habitsData" header-title="Habits" :bulk-actions="bulkActions">
    <template #filters>
      <div class="flex items-center justify-between gap-3 px-4 py-3">
        <UInput v-model="search" icon="i-heroicons-magnifying-glass-20-solid" placeholder="Search..." />
        <USelectMenu v-model="filters.statuses" :options="statusOptions" multiple placeholder="Status" class="w-40" />
      </div>
    </template>
    <template #extra-actions> extra actions </template>

    <!-- Global override for ALL cells -->
<!--    <template #body-cell="{ value }">-->
<!--      <UTooltip v-if="value?.toString().length > 30" :text="value"> {{ value?.toString().slice(0, 30) }}... </UTooltip>-->
<!--      <template v-else>{{ value }}</template>-->
<!--    </template>-->

    <!-- Or per-column only -->
    <!--     <template #name-data="{ value }"><strong>{{ value }}</strong></template> -->

    <!-- (B) Or, per-column only -->
    <!-- <template #name-data="{ value }"><strong>{{ value }}</strong></template> -->
  </BaseResourceTable>
</template>

<script setup lang="ts">
import type { PaginatedData } from '~/types/response';
import BaseResourceTable from '~/components/ui/table/BaseResourceTable.vue';
import type { DropdownGroups } from '~/types/ui/dropdown';
import type { TableColumn } from '~/types/ui/table';
import type { HabitResource } from '~/types/resources';

interface UISelectOption<T = unknown> {
  key: string;
  label: string;
  value: T;
}

const columns = [
  { key: 'select', class: 'w-2' },
  { key: 'name', label: 'Name', sortable: true },
  { key: 'description', label: 'Description', sortable: true },
  { key: 'color_hex', label: 'Color', sortable: true },
  { key: 'icon', label: 'Icon', sortable: true },
  { key: 'start_date', label: 'Start Date', sortable: true },
  { key: 'end_date', label: 'End Date', sortable: true },
  { key: 'is_archived', label: 'Archived', sortable: true },
  { key: 'schedule_kind', label: 'Schedule Kind', sortable: true },
  { key: 'interval_days', label: 'Interval Days', sortable: true },
  { key: 'days_of_week', label: 'Days of Week', sortable: true },
  { key: 'target_per_period', label: 'Target Per Period', sortable: true },
  { key: 'is_prompt_wellbeing', label: 'Prompt Wellbeing', sortable: true },
  { key: 'reminders', label: 'Reminders', sortable: true },
  { key: 'streak_current', label: 'Streak Current', sortable: true },
  { key: 'streak_longest', label: 'Streak Longest', sortable: true },
  { key: 'last_completed_at', label: 'Last Completed At', sortable: true },
  { key: 'priority', label: 'Priority', sortable: true },
  { key: 'sort_order', label: 'Sort Order', sortable: true },
  { key: 'deleted_at', label: 'Deleted At', sortable: true },
  { key: 'created_at', label: 'Created At', sortable: true },
  { key: 'updated_at', label: 'Updated At', sortable: true },
] as TableColumn<HabitResource>[];

const tableState = reactive({
  page: 1,
  page_size: 10,
  pageTotal: 1,
});

const bulkActions: DropdownGroups<'completed' | 'uncompleted'> = [
  [{ key: 'completed', label: 'Completed', icon: 'i-heroicons-check' }],
  [{ key: 'uncompleted', label: 'In Progress', icon: 'i-heroicons-arrow-path' }],
];

const isFetching = ref<boolean>(false);
/** filters */
const search = ref<string>('');
const filters = reactive({
  statuses: [],
});

const habitsData = ref<HabitResource[]>([]);

const statusOptions = computed(() => {
  return [
    { key: 'uncompleted', label: 'In Progress', value: false },
    { key: 'completed', label: 'Completed', value: true },
  ] satisfies Readonly<UISelectOption<boolean>[]>;
});

const resetFilters = (): void => {
  search.value = '';
  filters.statuses = [];
};

const fetchData = async () => {
  isFetching.value = true;
  try {
    const resp = await useNuxtApp().$axios.get<{ habits: PaginatedData<HabitResource> }>('/api/v1/habits/list', {
      params: {
        ...filters,
        search: search.value,
        page: tableState.page,
        page_size: tableState.page_size,
      },
    });

    const responseData = resp.data.habits;

    if (resp.status === 200) {
      habitsData.value = [...responseData.data];
      tableState.pageTotal = responseData.total;
    }
  } catch (e) {
    console.info('error', e);
  } finally {
    isFetching.value = false;
  }
};

watch(
  () => [tableState.page, tableState.page_size, filters],
  () => {
    console.log('changed', {
      page: tableState.page,
      page_size: tableState.page_size,
      filters: filters,
    });
    fetchData();
  },
  { deep: true },
);

watch(search, useDebounce(fetchData, 500));

onMounted(() => {
  fetchData();
});
</script>

<style scoped></style>
