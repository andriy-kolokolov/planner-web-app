<template>
  <div class="px-2 m-0">
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
        <Transition name="fade-label"
          ><span v-if="!isCollapsed" class="truncate inline-block text-sm">{{ navigationItem.label }}</span></Transition
        >
      </component>
    </component>

    <Transition
      @before-enter="onChildrenBeforeEnter"
      @enter="onChildrenEnter"
      @after-enter="onChildrenAfterEnter"
      @before-leave="onChildrenBeforeLeave"
      @leave="onChildrenLeave"
    >
      <div v-if="!isCollapsed && hasChildren" class="mt-1 ml-8">
        <div v-for="childNavigationItem in navigationItem.children" :key="childNavigationItem.key">
          <component
            :is="childNavigationItem.path ? NuxtLink : 'button'"
            :to="childNavigationItem.path"
            type="button"
            class="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-200/70 dark:hover:bg-gray-700/60 transition-colors w-full text-left"
            :exact-active-class="childNavigationItem.path ? 'bg-primary-200/70 dark:bg-primary-900/60' : undefined"
            @click="childNavigationItem.action?.()"
          >
            <UIcon v-if="childNavigationItem.icon" :name="childNavigationItem.icon" class="w-4 h-4 shrink-0" />
            <span class="truncate text-sm">{{ childNavigationItem.label }}</span>
          </component>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { NuxtLink, UTooltip, UIcon } from '#components';
import type { NavItem } from '~/config/nav';

const props = defineProps<{ navigationItem: NavItem; isCollapsed: boolean }>();
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

function onChildrenBeforeEnter(el: Element) {
  const e = el as HTMLElement;
  e.style.height = '0px';
  e.style.overflow = 'hidden';
}
function onChildrenEnter(el: Element) {
  const e = el as HTMLElement;
  e.style.transition = 'height 220ms ease, opacity 150ms ease';
  e.style.opacity = '0';
  void e.offsetHeight;
  e.style.height = `${e.scrollHeight}px`;
  e.style.opacity = '1';
}
function onChildrenAfterEnter(el: Element) {
  const e = el as HTMLElement;
  e.style.height = 'auto';
  e.style.overflow = '';
  e.style.transition = '';
}
function onChildrenBeforeLeave(el: Element) {
  const e = el as HTMLElement;
  e.style.height = `${e.scrollHeight}px`;
  e.style.overflow = 'hidden';
}
function onChildrenLeave(el: Element) {
  const e = el as HTMLElement;
  e.style.transition = 'height 200ms ease, opacity 150ms ease';
  void e.offsetHeight;
  e.style.height = '0px';
  e.style.opacity = '0';
}
</script>

<style scoped>
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
