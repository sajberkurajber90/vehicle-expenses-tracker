<script setup lang="ts">
import Sidebar from '~/components/sidebar/Sidebar.vue';
import NotificationCenter from '~/components/notification-center/NotifcationCenter.vue';
import { useAppState } from '~/composables/useAppState';

const { transitionState } = useAppState();
</script>

<template>
  <div
    class="w-[1920px] m-auto pt-4 pb-4 h-screen min-h-270 overflow-y-auto overflow-x-auto"
  >
    <div class="flex flex-col h-full gap-4 relative">
      <div
        v-if="transitionState"
        class="w-full h-full z-100 bg-base-200 absolute rounded flex items-center justify-center"
      >
        <div class="skeleton skeleton-text">Loging out...</div>
      </div>
      <div
        class="h-16 w-full rounded bg-base-200 border-primary/50 border-2 p-4 flex items-center justify-end"
      >
        <NotificationCenter />
      </div>
      <div class="flex-1">
        <div class="flex h-full space-x-4">
          <Sidebar />
          <div
            class="rounded w-full p-2 bg-base-200 overflow-x-auto overflow-y-auto"
          >
            <slot />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
