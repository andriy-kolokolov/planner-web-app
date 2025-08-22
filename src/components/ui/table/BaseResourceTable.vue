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
      <h2 class="font-semibold text-xl text-gray-900 dark:text-white leading-tight">{{ props.headerTitle }}</h2>
    </template>

    <!-- Filters -->
    <slot name="filters" />

    <!-- Header and Action buttons -->
    <div class="flex justify-between items-center w-full px-4 py-3">
      <div class="flex gap-1.5 items-center">
        <slot name="extra-actions" />

        <UDropdown v-if="selectedRows.length > 1" :items="bulkActions" :ui="{ width: 'w-36' }">
          <UButton icon="i-heroicons-chevron-down" trailing color="gray" size="xs"> Mark as </UButton>
        </UDropdown>

        <USelectMenu v-model="selectedColumns" :options="excludeSelectColumn" multiple>
          <UButton icon="i-heroicons-view-columns" color="gray" size="xs"> Columns </UButton>
        </USelectMenu>

        <UButton icon="i-heroicons-funnel" color="gray" size="xs" @click="emitReset"> Reset </UButton>
      </div>
    </div>

    <!-- Table -->
    <UTable
      v-model="selectedRows"
      v-model:sort="sort"
      :rows="props.data"
      :columns="columnsTable"
      :loading="props.isLoading"
      sort-asc-icon="i-heroicons-arrow-up"
      sort-desc-icon="i-heroicons-arrow-down"
      sort-mode="manual"
      class="w-full"
      :ui="{ td: { base: 'align-top' } }"
      @select="select"
    >
      <template v-for="col in interceptedColumns" :key="'col-' + String(col.key)" v-slot:[`${String(col.key)}-data`]="slotCtx">
        <!-- 1) Use generic only if it *renders* content for this cell -->
        <template v-if="hasGenericBodyCell && hasBodyCellContent(slotCtx)">
          <slot name="body-cell" v-bind="normalizeCtx(slotCtx)" />
        </template>

        <!-- 2) Else, parent per-column -->
        <template v-else-if="hasParentSlot(`${String(col.key)}-data`)">
          <slot :name="`${String(col.key)}-data`" v-bind="normalizeCtx(slotCtx)" />
        </template>

        <!-- 3) Else, defaults (unchanged) -->
        <template v-else>
          <template v-if="String(col.key) === 'actions'">
            <!-- your actions fallback -->
          </template>
          <template v-else>
            <template v-if="toText(resolveCellValue(slotCtx)).length > props.ellipsisChars">
              <UTooltip :text="toText(resolveCellValue(slotCtx))">
                <span class="block w-full overflow-hidden whitespace-nowrap text-ellipsis" :title="toText(resolveCellValue(slotCtx))">
                  {{ toText(resolveCellValue(slotCtx)).slice(0, props.ellipsisChars) }}…
                </span>
              </UTooltip>
            </template>
            <template v-else>
              <span class="block w-full overflow-hidden whitespace-nowrap text-ellipsis" :title="toText(resolveCellValue(slotCtx))">
                {{ toText(resolveCellValue(slotCtx)) }}
              </span>
            </template>
          </template>
        </template>
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

        <div>
          <div class="flex items-center gap-1.5">
            <span class="text-sm leading-5">Rows per page:</span>
            <USelect v-model="pageCount" :options="pageCountOptions" class="me-2 w-20" size="xs" />
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
      </div>
    </template>
  </UCard>
</template>

<script setup lang="ts" generic="TResource extends Record<string, any>">
import { computed, reactive, ref, useSlots } from 'vue';
import type { TableColumn } from '~/types/ui/table';
import type { DropdownGroups } from '~/types/ui/dropdown';

interface Props {
  columns: TableColumn<TResource>[];
  data: TResource[];
  headerTitle: string;
  bulkActions?: DropdownGroups<unknown>;
  isLoading?: boolean;
  ellipsisChars?: number;
}

type SortableHabitKey = keyof TResource;
interface TableSort {
  column: SortableHabitKey | string;
  direction: 'asc' | 'desc';
}

type ColumnLike<T> = Partial<TableColumn<T>> & { key?: TableColumn<T>['key'] };

type BodyCellCtx<T> = {
  row: T;
  column: ColumnLike<T>;
  index: number;
  value: unknown;
};

/** UTable row-scoped slots: also expose generic body-cell to parent */
type ColumnKey = TableColumn<TResource>['key'];

type ColumnDataSlots = {
  [K in Extract<ColumnKey, string> as `${K}-data`]?: (ctx: BodyCellCtx<TResource>) => any;
};

defineSlots<
  {
    filters?: () => any;
    'extra-actions'?: () => any;
    'body-cell'?: (ctx: BodyCellCtx<TResource>) => any;
  } & ColumnDataSlots
>();

const emit = defineEmits<{ (e: 'reset-click'): void }>();
const props = withDefaults(defineProps<Props>(), {
  ellipsisChars: 30,
});
const slots = useSlots();
const hasGenericBodyCell = computed(() => Boolean(slots['body-cell']));
const hasParentSlot = (name: string) => Boolean(slots[name]);

function hasBodyCellContent<T>(ctx: UTableDataSlotCtx<T>) {
  const fn = slots['body-cell'];
  if (!fn) return false;
  const nodes = fn(normalizeCtx(ctx));
  return Array.isArray(nodes) ? nodes.length > 0 : Boolean(nodes);
}

const SPECIAL_KEYS = new Set(['select'])
const interceptedColumns = computed(() => {
  const all = hasGenericBodyCell.value
              ? columnsTable.value
              : columnsTable.value.filter(c => hasParentSlot(`${String(c.key)}-data`))
  return all.filter(c => !SPECIAL_KEYS.has(String(c.key)))
})

const needsActionsFallback = computed(() => !hasGenericBodyCell.value && !hasParentSlot('actions-data'));

/** Models */
const page = defineModel<number>('page', { default: 1 });
const pageCount = defineModel<number>('pageCount', { default: 10 });
const pageCountOptions = defineModel<number[]>('pageCountOptions', { default: () => [3, 5, 10, 20, 30, 40] });
const pageTotal = defineModel<number>('pageTotal', { default: 200 });
const selectedRows = defineModel<TResource[]>('selectedRows', { default: () => [] });

/** Pagination & sorting */
const sort = ref<TableSort>({ column: 'id', direction: 'asc' });
const pageFrom = computed<number>(() => (page.value - 1) * pageCount.value + 1);
const pageTo = computed<number>(() => Math.min(page.value * pageCount.value, pageTotal.value));

/** Columns */
const selectedColumns = ref<TableColumn<TResource>[]>([...props.columns]);
const columnsTable = computed<TableColumn<TResource>[]>(() => props.columns.filter((c) => selectedColumns.value.includes(c)));
const excludeSelectColumn = computed<TableColumn<TResource>[]>(() => props.columns.filter((c) => c.key !== 'select'));

/** Helpers */
type UTableDataSlotCtx<T> = {
  row: T;
  column?: ColumnLike<T>; // may be undefined in some internals
  index: number;
  value?: unknown;
  getRowData?: (defaultValue?: unknown) => unknown;
};

function resolveCellValue<T>(ctx: UTableDataSlotCtx<T>) {
  if (ctx.value !== undefined) return ctx.value;
  if (typeof ctx.getRowData === 'function') return ctx.getRowData(undefined);
  const colKey = (ctx.column?.key ?? '') as string;
  // @ts-expect-error generic index access
  return colKey && ctx.row ? ctx.row[colKey] : undefined;
}

function normalizeCtx<T>(ctx: UTableDataSlotCtx<T>): BodyCellCtx<T> {
  const safeColumn: ColumnLike<T> = (ctx?.column ?? { key: '' }) as ColumnLike<T>;
  return {
    row: ctx.row,
    column: safeColumn,
    index: ctx?.index ?? 0,
    value: resolveCellValue(ctx) as unknown,
  };
}

function toText(v: unknown): string {
  if (v == null) return '';
  if (typeof v === 'string') return v;
  if (typeof v === 'number' || typeof v === 'boolean') return String(v);
  try {
    return JSON.stringify(v);
  } catch {
    return String(v);
  }
}

function needsEllipsis(s: string): boolean {
  return s.length > props.ellipsisChars;
}

function select(row: TResource) {
  const idx = selectedRows.value.findIndex((r) => (r as any).id === (row as any).id);
  if (idx === -1) selectedRows.value.push(row);
  else selectedRows.value.splice(idx, 1);
}

function emitReset() {
  emit('reset-click');
}
</script>
