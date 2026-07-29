<script setup lang="ts">
import { onMounted } from 'vue';

onMounted(async () => {
  const config = useRuntimeConfig();
  try {
    console.log('pre post');
    const response = await fetch(
      (config.public.apiBase as string) + '/api/auth/sign-up/email',
      {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'Tibor Bezdan',
          firstname: 'Tibor',
          lastname: 'Bezdan',
          email: 't@b.com',
          password: 'password',
        }),
      },
    );
    console.log('post');
    const data = await response.text();
    console.log('API response:', data);
    console.log('data: ', data);
  } catch (error) {
    console.error('Error during sign-in:', error);
  }
  console.log('sign-up mounted');
});
</script>

<template>
  <div>Desktop</div>
</template>
