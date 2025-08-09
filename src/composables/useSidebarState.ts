import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue';
import { useRouter, useState } from '#imports';
import { useBreakpoints, breakpointsTailwind } from '@vueuse/core';

/**
 * Shared sidebar state for header + sidebar (single source of truth).
 * - Pinned collapsed state persisted (localStorage).
 * - Mobile slideover open/close.
 * - Desktop hover-to-peek.
 */
export function useSidebarState() {
  // Shared refs (Nuxt useState guarantees same instance across components)
  const isSidebarCollapsed = useState<boolean>('sidebar:collapsed', () => false);
  const isSidebarHoverExpanded = useState<boolean>('sidebar:hoverExpanded', () => false);
  const isMobileSidebarOpen = useState<boolean>('sidebar:mobileOpen', () => false);

  // SSR-safe persistence for pinned collapsed state
  const storageKey = 'ui:sidebar:collapsed';
  onMounted(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored !== null) isSidebarCollapsed.value = stored === 'true';
    } catch {}
  });
  watch(
    isSidebarCollapsed,
    (value) => {
      try {
        localStorage.setItem(storageKey, value ? 'true' : 'false');
      } catch {}
    },
    { flush: 'post' },
  );

  // Breakpoints
  const breakpoints = useBreakpoints(breakpointsTailwind);
  const isMediumUp = breakpoints.greater('md');

  // Visual state (what user currently sees)
  const isSidebarVisuallyExpanded = computed(() => {
    if (!isMediumUp.value) return false; // hidden; mobile uses slideover
    return !isSidebarCollapsed.value || isSidebarHoverExpanded.value;
  });
  const isSidebarVisuallyCollapsed = computed(() => !isSidebarVisuallyExpanded.value);

  // Actions
  function toggleSidebarCollapsed() {
    isSidebarCollapsed.value = !isSidebarCollapsed.value;
  }
  function expandSidebar() {
    if (isSidebarCollapsed.value) isSidebarCollapsed.value = false;
  }
  function openMobileSidebar() {
    isMobileSidebarOpen.value = true;
  }
  function closeMobileSidebar() {
    isMobileSidebarOpen.value = false;
  }

  // Desktop hover-to-peek
  let hoverDelayTimer: ReturnType<typeof setTimeout> | null = null;
  function onAsideMouseEnter() {
    if (!isMediumUp.value || !isSidebarCollapsed.value) return;
    if (hoverDelayTimer) clearTimeout(hoverDelayTimer);
    hoverDelayTimer = setTimeout(() => (isSidebarHoverExpanded.value = true), 80);
  }
  function onAsideMouseLeave() {
    if (!isMediumUp.value || !isSidebarCollapsed.value) return;
    if (hoverDelayTimer) clearTimeout(hoverDelayTimer);
    hoverDelayTimer = setTimeout(() => (isSidebarHoverExpanded.value = false), 120);
  }

  // Auto-close mobile slideover after route changes
  const router = useRouter();
  let removeAfterEach: (() => void) | null = null;
  onMounted(() => {
    removeAfterEach = router.afterEach(() => {
      if (!isMediumUp.value) closeMobileSidebar();
    });
  });
  onBeforeUnmount(() => {
    if (removeAfterEach) removeAfterEach();
  });

  return {
    isSidebarCollapsed,
    isSidebarHoverExpanded,
    isMobileSidebarOpen,
    isMediumUp,
    isSidebarVisuallyExpanded,
    isSidebarVisuallyCollapsed,
    toggleSidebarCollapsed,
    expandSidebar,
    openMobileSidebar,
    closeMobileSidebar,
    onAsideMouseEnter,
    onAsideMouseLeave,
  };
}
