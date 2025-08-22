import type { DropdownItem } from '#ui/types';

interface UIDropdownItem<TKeys> extends DropdownItem {
  key: TKeys;
}
export type DropdownGroups<TKeys> = UIDropdownItem<TKeys>[][];