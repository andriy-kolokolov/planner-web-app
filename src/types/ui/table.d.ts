import type { TableColumn as NuxtTableColumn } from '#ui/types';

export interface TableColumn<T = unknown> extends NuxtTableColumn {
  key: 'select' | 'actions' | keyof T;
}
