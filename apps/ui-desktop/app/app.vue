<script setup lang="ts">
import { onMounted } from 'vue';

onMounted(async () => {
  const config = useRuntimeConfig();
  try {
    const response = await fetch(config.public.apiBase as string);
    const data = await response.json();
    console.log('API response:', data);
  } catch (error) {
    console.error('Error during sign-in:', error);
  }
});
</script>

<template>
  <div>Desktop</div>
</template>
