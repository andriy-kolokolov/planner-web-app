<template>
  <UCard
    class="w-full"
    :ui="{
      base: '',
      ring: '',
      divide: 'divide-y divide-gray-200 dark:divide-gray-700',
      header: { padding: 'px-4 py-5' },
      body: { padding: '', base: 'divide-y divide-gray-200 dark:divide-gray-700' },
      footer: { padding: 'p-4' },
    }"
  >
    <template #header>
      <h2 class="font-semibold text-xl text-gray-900 dark:text-white leading-tight">Habits</h2>
    </template>

    <!-- Filters -->
    <div class="flex items-center justify-between gap-3 px-4 py-3">
      <UInput v-model="search" icon="i-heroicons-magnifying-glass-20-solid" placeholder="Search..." />

      <USelectMenu v-model="filters.statuses" :options="statusOptions" multiple placeholder="Status" class="w-40" />
    </div>

    <!-- Header and Action buttons -->
    <div class="flex justify-between items-center w-full px-4 py-3">
      <div class="flex items-center gap-1.5">
        <span class="text-sm leading-5">Rows per page:</span>

        <USelect v-model="pageCount" :options="pageCountOptions" class="me-2 w-20" size="xs" />
      </div>

      <div class="flex gap-1.5 items-center">
        <UDropdown v-if="selectedRows.length > 1" :items="bulkActions" :ui="{ width: 'w-36' }">
          <UButton icon="i-heroicons-chevron-down" trailing color="gray" size="xs"> Mark as </UButton>
        </UDropdown>

        <USelectMenu v-model="selectedColumns" :options="excludeSelectColumn" multiple>
          <UButton icon="i-heroicons-view-columns" color="gray" size="xs"> Columns </UButton>
        </USelectMenu>

        <UButton
          icon="i-heroicons-funnel"
          color="gray"
          size="xs"
          :disabled="search === '' && filters.statuses.length === 0"
          @click="resetFilters"
        >
          Reset
        </UButton>
      </div>
    </div>

    <!-- Table -->
    <UTable
      v-model="selectedRows"
      v-model:sort="sort"
      :rows="habitsData"
      :columns="columnsTable"
      :loading="isFetching"
      sort-asc-icon="i-heroicons-arrow-up"
      sort-desc-icon="i-heroicons-arrow-down"
      sort-mode="manual"
      class="w-full"
      :ui="{ td: { base: 'max-w-[0] truncate' } }"
      @select="select"
    >
      <!--      <template #completed-data="{ row }">-->
      <!--        <UBadge-->
      <!--          size="xs"-->
      <!--          :label="row.completed ? 'Completed' : 'In Progress'"-->
      <!--          :color="row.completed ? 'emerald' : 'orange'"-->
      <!--          variant="subtle"-->
      <!--        />-->
      <!--      </template>-->

      <template #actions-data="{ row }">
        <UButton
          v-if="!row.completed"
          icon="i-heroicons-check"
          size="2xs"
          color="emerald"
          variant="outline"
          :ui="{ rounded: 'rounded-full' }"
          square
        />

        <UButton
          v-else
          icon="i-heroicons-arrow-path"
          size="2xs"
          color="orange"
          variant="outline"
          :ui="{ rounded: 'rounded-full' }"
          square
        />
      </template>
    </UTable>

    <!-- Number of rows & Pagination -->
    <template #footer>
      <div class="flex flex-wrap justify-between items-center">
        <div>
          <span class="text-sm leading-5">
            Showing
            <span class="font-medium">{{ pageFrom }}</span>
            to
            <span class="font-medium">{{ pageTo }}</span>
            of
            <span class="font-medium">{{ pageTotal }}</span>
            results
          </span>
        </div>

        <UPagination
          v-model="page"
          :page-count="pageCount"
          :total="pageTotal"
          :ui="{
            wrapper: 'flex items-center gap-1',
            rounded: '!rounded-full min-w-[32px] justify-center',
            default: { activeButton: { variant: 'outline' } },
          }"
        />
      </div>
    </template>
  </UCard>
</template>

<script setup lang="ts">
import type { PaginatedData } from '~/types/response';
import type { TableColumn } from '#ui/types';

interface HabitResource {
  id: string;
  name: string;
  description: string;
  color_hex: string;
  icon: string;
  start_date: string;
  end_date: string | null;
  is_archived: boolean;
  schedule_kind: number;
  interval_days: number;
  days_of_week: number[] | null;
  target_per_period: number | null;
  is_prompt_wellbeing: boolean;
  reminders: string[] | null;
  streak_current: number;
  streak_longest: number;
  last_completed_at: string | null;
  priority: number;
  sort_order: number;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}

interface UITableColumn<T = unknown> extends TableColumn {
  key: 'select' | 'actions' | keyof HabitResource;
}

type BulkActionKey = 'completed' | 'uncompleted';
interface UIDropdownItem {
  key: BulkActionKey;
  label: string;
  icon?: string;
}
type UIDropdownGroups = UIDropdownItem[][];

interface UISelectOption<T = unknown> {
  key: string;
  label: string;
  value: T;
}

/** Sort state (manual) */
type SortableHabitKey = Extract<keyof HabitResource, 'id' | 'title' | 'completed'>;
interface TableSort {
  column: SortableHabitKey;
  direction: 'asc' | 'desc';
}

/** Slots typing for UTable row-scoped slots */
defineSlots<{
  'completed-data'(props: { row: HabitResource }): any;
  'actions-data'(props: { row: HabitResource }): any;
}>();

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
] as UITableColumn<HabitResource>[];

const selectedColumns = ref<UITableColumn<HabitResource>[]>([...columns]);
const columnsTable = computed<UITableColumn<HabitResource>[]>(() => columns.filter((c) => selectedColumns.value.includes(c)));
const excludeSelectColumn = computed<UITableColumn<HabitResource>[]>(() => columns.filter((c) => c.key !== 'select'));

/** Selected Rows */
const selectedRows = ref<HabitResource[]>([]);

function select(row: HabitResource) {
  const idx = selectedRows.value.findIndex((r) => r.id === row.id);
  if (idx === -1) selectedRows.value.push(row);
  else selectedRows.value.splice(idx, 1);
}

const bulkActions: UIDropdownGroups = [
  [{ key: 'completed', label: 'Completed', icon: 'i-heroicons-check' }],
  [{ key: 'uncompleted', label: 'In Progress', icon: 'i-heroicons-arrow-path' }],
];

const isFetching = ref<boolean>(false);
/** filters */
const search = ref<string>('');
const filters = reactive({
  statuses: [],
});
/** Pagination & sorting */
const sort = ref<TableSort>({ column: 'id', direction: 'asc' });
const page = ref<number>(1);
const pageCount = ref<number>(10);
const pageCountOptions: number[] = [3, 5, 10, 20, 30, 40];
const pageTotal = ref<number>(200);
const pageFrom = computed<number>(() => (page.value - 1) * pageCount.value + 1);
const pageTo = computed<number>(() => Math.min(page.value * pageCount.value, pageTotal.value));

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
        page: page.value,
        page_size: pageCount.value,
      },
    });

    const responseData = resp.data.habits;

    if (resp.status === 200) {
      habitsData.value = [...responseData.data];
      pageTotal.value = responseData.total;
    }
  } catch (e) {
    console.info('error', e);
  } finally {
    isFetching.value = false;
  }
};

watch(
  () => [page.value, pageCount.value, filters],
  () => {
    console.log('changed', {
      page: page.value,
      pageCount: pageCount.value,
      filters: filters,
    });
    fetchData();
  },
  { deep: true },
);

watch(search, useDebounce(fetchData, 500));
</script>

<style scoped></style>
