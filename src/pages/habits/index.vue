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
      <template #completed-data="{ row }">
        <UBadge
          size="xs"
          :label="row.completed ? 'Completed' : 'In Progress'"
          :color="row.completed ? 'emerald' : 'orange'"
          variant="subtle"
        />
      </template>

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
interface HabitModel {
  id: number;
  title: string;
  completed: boolean;
}

type ColumnKey = keyof HabitModel;

interface UITableColumn<T = unknown> {
  key: 'select' | 'actions' | ColumnKey;
  label?: string;
  class?: string;
  sortable?: boolean;
  direction?: 'asc' | 'desc';
  // You can extend with accessor/format if you use advanced APIs.
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
type SortableHabitKey = Extract<keyof HabitModel, 'id' | 'title' | 'completed'>;
interface TableSort {
  column: SortableHabitKey;
  direction: 'asc' | 'desc';
}

/** Slots typing for UTable row-scoped slots */
defineSlots<{
  'completed-data'(props: { row: HabitModel }): any;
  'actions-data'(props: { row: HabitModel }): any;
}>();

const columns = [
  { key: 'select', class: 'w-2' },
  { key: 'id', label: '#', sortable: true },
  { key: 'title', label: 'Title', sortable: true },
  { key: 'completed', label: 'Status', sortable: true },
  { key: 'actions', label: 'Actions', sortable: false },
] satisfies Readonly<UITableColumn<HabitModel>[]>;

const selectedColumns = ref<UITableColumn<HabitModel>[]>([...columns]);
const columnsTable = computed<UITableColumn<HabitModel>[]>(() => columns.filter((c) => selectedColumns.value.includes(c)));
const excludeSelectColumn = computed<UITableColumn<HabitModel>[]>(() => columns.filter((c) => c.key !== 'select'));

/** Selected Rows */
const selectedRows = ref<HabitModel[]>([]);

function select(row: HabitModel) {
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

const habitsData = ref<HabitModel[]>([]);

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
    const resp = await useNuxtApp().$axios.get<{ habits: HabitModel[] }>('/api/v1/habits/list', {
      params: {
        ...filters,
        search: search.value,
        page: page.value,
        page_size: pageCount.value,
      },
    });

    if (resp.status === 200) {
      habitsData.value = { ...resp.data.habits };
      pageTotal.value = resp.data.total;
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
