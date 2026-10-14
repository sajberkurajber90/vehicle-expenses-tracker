<script setup lang="ts">
import Sidebar from '~/components/sidebar/Sidebar.vue';
</script>

<template>
  <div
    class="w-[1920px] m-auto pt-4 pb-4 h-screen min-h-270 overflow-y-auto overflow-x-auto"
  >
    <div class="flex flex-col h-full gap-4">
      <div class="h-16 w-full bg-primary-content/10 rounded"></div>
      <div class="flex-1">
        <div class="flex h-full space-x-4">
          <Sidebar />
          <div
            class="bg-primary-content/10 rounded w-full shadow-lg p-2 overflow-x-auto overflow-y-auto"
          >
            <slot />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
