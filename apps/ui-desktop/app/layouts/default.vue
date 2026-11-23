<script setup lang="ts">
import Sidebar from '~/components/sidebar/Sidebar.vue';
// import { useThema } from '@vehicle-expenses-tracker/ui-core/app/composables/useThema';
//
// onBeforeMount(() => {
//   const { setThema } = useThema();
//   setThema('light');
// });
</script>

<template>
  <div
    class="w-[1920px] m-auto pt-4 pb-4 h-screen min-h-270 overflow-y-auto overflow-x-auto"
  >
    <div class="flex flex-col h-full gap-4">
      <div
        class="h-16 w-full rounded bg-base-200 border-primary/50 border-2"
      ></div>
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
