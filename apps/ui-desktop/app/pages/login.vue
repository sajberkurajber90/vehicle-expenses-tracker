<script setup lang="ts">
import { useAuthStore } from '~/features/auth';
// import { loginInputSchema } from '~/features/auth';
import { ZodError } from 'zod';

definePageMeta({
  layout: 'auth',
});

const authStore = useAuthStore();

const inputForm = reactive({
  email: '',
  password: '',
});

const errorMessages = reactive({
  email: '',
  password: '',
  submit: '',
});

const focusedFields = reactive({
  email: false,
  password: false,
});

const touchedFields = reactive({
  email: false,
  password: false,
});

async function submit() {
  const error = await authStore.login(inputForm);
  if (error === null) return navigateTo('/');

  if (error instanceof ZodError) {
    const { email, password } = error.flatten().fieldErrors;
    errorMessages.email = email?.[0] ?? '';
    errorMessages.password = password?.[0] ?? '';
  }

  if ('kind' in error) {
    if (error.kind === 'authentication') {
      errorMessages.submit = 'Email or password incorrect';
    }
  }
}
</script>

<template>
  <div class="h-full flex items-center justify-center overflow-hidden">
    <div
      class="flex items-center justify-end w-300 p-10 bg-[url('~/assets/images/login.webp')] bg-cover bg-center shadow-xl rounded-2xl"
    >
      <form
        @submit.prevent
        class="rounded-xl min-w-100 w-100 dark:bg-base-300 bg-base-200"
      >
        <div class="min-h-full flex">
          <div class="flex-1 p-12 flex flex-col gap-4">
            <div class="flex-1 flex flex-col justify-center">
              <h2 class="text-2xl text-center font-bold mb-8">Login</h2>
              <div class="mb-4">
                <label class="floating-label">
                  <span :class="{ 'text-error': errorMessages.email }"
                    >Email</span
                  >
                  <input
                    type="email"
                    v-model="inputForm.email"
                    placeholder="Email"
                    class="input w-full"
                    :class="{
                      'text-error': errorMessages.email,
                      'input-error': errorMessages.email,
                      'input-primary':
                        !errorMessages.email && focusedFields.email,
                    }"
                  />
                </label>
                <p
                  :class="{ 'text-error': errorMessages.email }"
                  class="label text-xs"
                >
                  {{ errorMessages.email }}
                </p>
              </div>
              <div>
                <label class="floating-label">
                  <span :class="{ 'text-error': errorMessages.password }"
                    >Password</span
                  >
                  <input
                    type="password"
                    placeholder="Password"
                    class="input w-full"
                    v-model="inputForm.password"
                    :class="{
                      'text-error': errorMessages.password,
                      'input-error': errorMessages.password,
                      'input-primary':
                        !errorMessages.password && focusedFields.password,
                    }"
                  />
                </label>
                <p
                  :class="{ 'text-error': errorMessages.password }"
                  class="label text-xs"
                >
                  {{ errorMessages.password }}
                </p>
              </div>
            </div>
            <div class="h-10">
              <p class="text-error text-xs">{{ errorMessages.submit }}</p>
            </div>
            <button
              @click="submit"
              class="btn btn-ghost text-xs text-primary-content/50 hover:text-primary-content/60 font-light w-full"
            >
              Forgot Password ?
            </button>
            <button
              @click="submit"
              class="btn bg-yellow-500 hover:bg-yellow-400 text-black w-full"
            >
              Submit
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped></style>
