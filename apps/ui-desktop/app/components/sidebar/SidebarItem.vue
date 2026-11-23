<script setup lang="ts">
const { animationTrigger = false, borderTop = false } = defineProps<{
  animationTrigger: boolean;
  borderTop: boolean;
}>();
</script>

<template>
  <div
    :class="[
      'flex items-center pt-4',
      borderTop ? 'border-t-2 border-primary' : '',
    ]"
  >
    <div
      :class="animationTrigger ? 'grow-0' : 'grow'"
      class="transition-[flex-grow] duration-500 ease-in-out"
    ></div>
    <slot name="icon"> </slot>
    <div class="min-w-0 flex-1">
      <slot name="label"> </slot>
    </div>
  </div>
</template>

<style scoped></style>
