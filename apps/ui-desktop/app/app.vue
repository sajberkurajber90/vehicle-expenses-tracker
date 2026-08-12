<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';

onMounted(async () => {
  const config = useRuntimeConfig();
  try {
    const response = await fetch(
      (config.public.apiBase as string) + '/auth/app-register-complete',
      {
        method: 'GET',
        credentials: 'include',
      },
    );
    const data = await response.text();
    console.log('API response:', data);
  } catch (error) {
    console.error('Error during sign-in:', error);
  }
  console.log('sign-up mounted');
});
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
