<script setup lang="ts">
import { useTheme } from '../../../../packages/ui-core/app/composables/useTheme';
const { thema, setTheme } = useTheme();

onBeforeMount(() => {
  if (thema.value !== 'system') {
    setTheme('system');
  }
});
</script>

<template>
  <div class="m-auto max-w-5xl h-screen overflow-y-auto">
    <slot />
  </div>
</template>

<style scoped></style>
