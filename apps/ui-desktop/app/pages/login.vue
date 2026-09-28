<script setup lang="ts">
import { useAuthStore } from '~/features/auth';

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
  await authStore.login(inputForm);
  navigateTo('/');
}
</script>

<template>
  <div class="h-full flex items-center justify-center overflow-auto">
    <form
      @submit.prevent
      class="card h-100 min-w-200 w-200 shadow-base-300 shadow-xl dark:bg-base-300 bg-base-200"
    >
      <div class="min-h-full flex">
        <div class="flex-1"></div>
        <div class="flex-1 p-12 flex flex-col">
          <div class="flex-1 flex flex-col justify-center">
            <h2 class="text-2xl text-center font-bold mb-8">Login</h2>
            <div>
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
          <div class="flex justify-end items-top">
            <p class="flex-1 text-error">Email or password incorrect</p>
            <button @click="submit" class="btn btn-primary self-end">
              Submit
            </button>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<style scoped></style>
