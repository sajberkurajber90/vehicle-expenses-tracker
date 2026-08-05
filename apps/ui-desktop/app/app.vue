<script setup lang="ts">
import { onMounted } from 'vue';

onMounted(async () => {
  const config = useRuntimeConfig();
  try {
    const response = await fetch(
      (config.public.apiBase as string) + '/api/auth/sign-up/email',
      {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 't@b.com',
          password: 'password',
        }),
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
  <div>Desktop</div>
</template>
