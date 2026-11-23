<script setup lang="ts">
import { useThema } from '@vehicle-expenses-tracker/ui-core/app/composables/useThema';
const { thema, setThema } = useThema();

onBeforeUnmount(() => {
  if (thema.value !== 'system') {
    setThema('system');
  }
});
</script>

<template>
  <div class="m-auto max-w-5xl h-screen overflow-y-auto">
    <slot />
  </div>
</template>

<style scoped></style>
