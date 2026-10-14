<script setup lang="ts">
import { useAPI } from '~/composables/useAPI';
const fetch = useAPI();

const { data, status, error } = useAsyncData(() =>
  fetch('/authorization/user/1'),
);
</script>

<template>
  <div class="h-full flex items-center justify-center">
    {{ data }}
    {{ error }}
    {{ status }}
  </div>
</template>

<style scoped></style>
