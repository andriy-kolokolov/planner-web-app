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
      <h2 class="font-semibold text-xl text-gray-900 dark:text-white leading-tight">Todos</h2>
    </template>

    <!-- Filters -->
    <div class="flex items-center justify-between gap-3 px-4 py-3">
      <UInput v-model="search" icon="i-heroicons-magnifying-glass-20-solid" placeholder="Search..." />

      <USelectMenu v-model="selectedStatus" :options="todoStatus" multiple placeholder="Status" class="w-40" />
    </div>

    <!-- Header and Action buttons -->
    <div class="flex justify-between items-center w-full px-4 py-3">
      <div class="flex items-center gap-1.5">
        <span class="text-sm leading-5">Rows per page:</span>

        <USelect v-model="pageCount" :options="pageCountOptions" class="me-2 w-20" size="xs" />
      </div>

      <div class="flex gap-1.5 items-center">
        <UDropdown v-if="selectedRows.length > 1" :items="actions" :ui="{ width: 'w-36' }">
          <UButton icon="i-heroicons-chevron-down" trailing color="gray" size="xs"> Mark as </UButton>
        </UDropdown>

        <USelectMenu v-model="selectedColumns" :options="excludeSelectColumn" multiple>
          <UButton icon="i-heroicons-view-columns" color="gray" size="xs"> Columns </UButton>
        </USelectMenu>

        <UButton
          icon="i-heroicons-funnel"
          color="gray"
          size="xs"
          :disabled="search === '' && selectedStatus.length === 0"
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
      :rows="todos"
      :columns="columnsTable"
      :loading="status === 'pending'"
      sort-asc-icon="i-heroicons-arrow-up"
      sort-desc-icon="i-heroicons-arrow-down"
      sort-mode="manual"
      class="w-full"
      :ui="{ td: { base: 'max-w-[0] truncate' },  }"
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
/**
 * If your project resolves Nuxt UI v2.21 type aliases, you can replace the local types:
 *
 *   import type { TableColumn, DropdownItem, SelectMenuOption } from '#ui/types'
 *   type UITableColumn<T> = TableColumn<T>
 *   type UIDropdownItem   = DropdownItem
 *   type UISelectOption   = SelectMenuOption
 *
 * Otherwise the local shapes below mirror the public API closely.
 */

/** Domain models */
interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

/** UI model helpers (local fallbacks) */
type ColumnKey = 'select' | 'id' | 'title' | 'completed' | 'actions';

interface UITableColumn<T = unknown> {
  key: ColumnKey;
  label?: string;
  class?: string;
  sortable?: boolean;
  direction?: 'asc' | 'desc';
  // You can extend with accessor/format if you use advanced APIs.
}

type ActionKey = 'completed' | 'uncompleted';
interface UIDropdownItem {
  key: ActionKey;
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
type SortableTodoKey = Extract<keyof Todo, 'id' | 'title' | 'completed'>;
interface TableSort {
  column: SortableTodoKey;
  direction: 'asc' | 'desc';
}

/** Slots typing for UTable row-scoped slots */
defineSlots<{
  'completed-data'(props: { row: Todo }): any;
  'actions-data'(props: { row: Todo }): any;
}>();

/** Columns */
const columns = [
  { key: 'select', class: 'w-2' },
  { key: 'id', label: '#', sortable: true },
  { key: 'title', label: 'Title', sortable: true },
  { key: 'completed', label: 'Status', sortable: true },
  { key: 'actions', label: 'Actions', sortable: false },
] satisfies Readonly<UITableColumn<Todo>[]>; // strong shapes & immutability

const selectedColumns = ref<UITableColumn<Todo>[]>([...columns]);
const columnsTable = computed<UITableColumn<Todo>[]>(() => columns.filter((c) => selectedColumns.value.includes(c)));
const excludeSelectColumn = computed<UITableColumn<Todo>[]>(() => columns.filter((c) => c.key !== 'select'));

/** Selected Rows */
const selectedRows = ref<Todo[]>([]);

function select(row: Todo) {
  const idx = selectedRows.value.findIndex((r) => r.id === row.id);
  if (idx === -1) selectedRows.value.push(row);
  else selectedRows.value.splice(idx, 1);
}

/** Actions (grouped) */
const actions: UIDropdownGroups = [
  [{ key: 'completed', label: 'Completed', icon: 'i-heroicons-check' }],
  [{ key: 'uncompleted', label: 'In Progress', icon: 'i-heroicons-arrow-path' }],
];

/** Filters */
const todoStatus = [
  { key: 'uncompleted', label: 'In Progress', value: false },
  { key: 'completed', label: 'Completed', value: true },
] satisfies Readonly<UISelectOption<boolean>[]>;

const search = ref<string>('');
const selectedStatus = ref<UISelectOption<boolean>[]>([]);

/** Safer querystring builder for the `completed` filter */
const searchStatus = computed<string>(() => {
  if (selectedStatus.value.length === 0) return '';
  const params = new URLSearchParams();
  for (const opt of selectedStatus.value) params.append('completed', String(opt.value));
  return `?${params.toString()}`;
});

const resetFilters = (): void => {
  search.value = '';
  selectedStatus.value = [];
};

/** Pagination & sorting */
const sort = ref<TableSort>({ column: 'id', direction: 'asc' });
const page = ref<number>(1);
const pageCount = ref<number>(10);
const pageCountOptions: number[] = [3, 5, 10, 20, 30, 40];
const pageTotal = ref<number>(200); // TODO: use X-Total-Count from API when available
const pageFrom = computed<number>(() => (page.value - 1) * pageCount.value + 1);
const pageTo = computed<number>(() => Math.min(page.value * pageCount.value, pageTotal.value));

/** Data */
const { data: todos, status } = await useLazyAsyncData<Todo[]>(
  'todos',
  () =>
    $fetch<Todo[]>(`https://jsonplaceholder.typicode.com/todos${searchStatus.value}`, {
      query: {
        q: search.value,
        _page: page.value,
        _limit: pageCount.value,
        _sort: sort.value.column,
        _order: sort.value.direction,
      },
    }),
  {
    default: () => [],
    watch: [page, search, searchStatus, pageCount, sort],
  },
);
</script>

<style scoped></style>
