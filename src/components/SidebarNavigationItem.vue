<template>
  <li class="px-2">
    <!-- Main row (tooltip only when collapsed) -->
    <component
      :is="isCollapsed ? UTooltip : 'div'"
      v-bind="isCollapsed ? { text: navigationItem.label, popper: { placement: 'right' } } : {}"
    >
      <component
        :is="navigationItem.path ? NuxtLink : 'button'"
        :to="navigationItem.path"
        type="button"
        :class="[baseNavigationItemClass, navigationItem.color, 'w-full']"
        :exact-active-class="navigationItem.path ? 'bg-primary-200/70 dark:bg-primary-900/60' : undefined"
        @click="handleMainRowClick"
      >
        <UIcon v-if="navigationItem.icon" :name="navigationItem.icon" class="w-5 h-5 shrink-0" />
        <!-- Label transition -->
        <Transition name="fade-label">
          <span v-if="!isCollapsed" class="truncate inline-block">{{ navigationItem.label }}</span>
        </Transition>
      </component>
    </component>

    <!-- Children (slide open/close) -->
    <Transition
      @before-enter="onChildrenBeforeEnter"
      @enter="onChildrenEnter"
      @after-enter="onChildrenAfterEnter"
      @before-leave="onChildrenBeforeLeave"
      @leave="onChildrenLeave"
    >
      <ul v-if="!isCollapsed && hasChildren" class="mt-1 ml-8 space-y-1">
        <li v-for="childNavigationItem in navigationItem.children" :key="childNavigationItem.key">
          <component
            :is="childNavigationItem.path ? NuxtLink : 'button'"
            :to="childNavigationItem.path"
            type="button"
            class="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-200/70 dark:hover:bg-gray-700/60 transition-colors w-full text-left"
            :exact-active-class="childNavigationItem.path ? 'bg-primary-200/70 dark:bg-primary-900/60' : undefined"
            @click="childNavigationItem.action?.()"
          >
            <UIcon v-if="childNavigationItem.icon" :name="childNavigationItem.icon" class="w-4 h-4 shrink-0" />
            <span class="truncate">{{ childNavigationItem.label }}</span>
          </component>
        </li>
      </ul>
    </Transition>
  </li>
</template>

<script setup lang="ts">
/**
 * Single navigation item.
 * - Fixes: reliable CSS transition classes + JS height hooks.
 * - Collapsed parent with children: first click expands sidebar instead of navigating.
 */
import { computed } from 'vue';
import { NuxtLink, UTooltip, UIcon } from '#components';
import type { NavItem } from '~/config/nav';

const props = defineProps<{
  navigationItem: NavItem;
  isCollapsed: boolean;
}>();

const emit = defineEmits<{ (event: 'request-expand'): void }>();

const baseNavigationItemClass =
  'group flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-left hover:bg-primary-100/70 dark:hover:bg-primary-900/40';

const hasChildren = computed(() => Array.isArray(props.navigationItem.children) && props.navigationItem.children.length > 0);

function handleMainRowClick(event: MouseEvent) {
  if (props.isCollapsed && hasChildren.value) {
    event.preventDefault();
    emit('request-expand');
    return;
  }
  props.navigationItem.action?.();
}

/** Height animation hooks (robust against dynamic content) */
function onChildrenBeforeEnter(el: Element) {
  const element = el as HTMLElement;
  element.style.height = '0px';
  element.style.overflow = 'hidden';
}
function onChildrenEnter(el: Element) {
  const element = el as HTMLElement;
  element.style.transition = 'height 220ms ease, opacity 150ms ease';
  element.style.opacity = '0';
  // force reflow, then expand
  void element.offsetHeight;
  element.style.height = `${element.scrollHeight}px`;
  element.style.opacity = '1';
}
function onChildrenAfterEnter(el: Element) {
  const element = el as HTMLElement;
  element.style.height = 'auto';
  element.style.overflow = '';
  element.style.transition = '';
}
function onChildrenBeforeLeave(el: Element) {
  const element = el as HTMLElement;
  element.style.height = `${element.scrollHeight}px`;
  element.style.overflow = 'hidden';
}
function onChildrenLeave(el: Element) {
  const element = el as HTMLElement;
  element.style.transition = 'height 200ms ease, opacity 150ms ease';
  // force reflow
  void element.offsetHeight;
  element.style.height = '0px';
  element.style.opacity = '0';
}
</script>

<style scoped>
/* Ensure transition classes are not blocked by scoping */
:global(.fade-label-enter-active),
:global(.fade-label-leave-active) {
  transition:
    opacity 150ms ease,
    transform 150ms ease;
}
:global(.fade-label-enter-from),
:global(.fade-label-leave-to) {
  opacity: 0;
  transform: translateX(2px);
}
</style>
