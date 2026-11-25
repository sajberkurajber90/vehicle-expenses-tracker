<script setup lang="ts">
import Notification from '@vehicle-expenses-tracker/ui-core/app/components/icons/Notification.vue';
</script>

<template>
  <div class="w-fit h-fit relative">
    <div
      class="badge badge-secondary badge-xs absolute top-[-10%] right-[-10%]"
    ></div>
    <button class="btn btn-circle btn-primary btn-sm">
      <Notification />
    </button>
  </div>
</template>

<style scoped></style>
