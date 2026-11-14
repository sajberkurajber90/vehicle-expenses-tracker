<script setup lang="ts">
import { useAPI } from '~/composables/useAPI';
import { z } from 'zod';

definePageMeta({
  layout: 'auth',
  appState: 'needs-login',
});
const route = useRoute();
const { token } = route.query;

const parsedToken = z.string().safeParse(token);
const { fetch } = useAPI();

const { status } = useAsyncData(() =>
  fetch('/auth/verify-email', {
    method: 'get',
    query: {
      token: parsedToken.success ? parsedToken.data : undefined,
    },
  }),
);
</script>

<template>
  <div class="h-full flex items-center justify-center">
    <div
      v-if="status === 'pending'"
      class="loading loading-spinner w-10 h-10"
    ></div>
    <div class="card w-96 bg-base-200 shadow-xl">
      <div v-if="status === 'success'" class="card-body">
        <h2 class="card-title">Email Verification</h2>
        <p v-if="parsedToken.success" class="text-success">
          Your email has been successfully verified. You can now log in.
        </p>
        <p v-else class="text-error">
          Invalid or expired verification token. Please request a new
          verification email.
        </p>
      </div>
      <div class="card-body" v-if="status === 'error'">
        <p class="text-error">An error occurred while verifying your email.</p>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
