<script setup lang="ts">
import { useAuthStore } from '~/features/auth/auth.store';
import { loginInputSchema } from '~/features/auth/auth.schema';
import { ZodError, z } from 'zod';
import { initStores } from '~/utils/init.stores';
type Field = 'email' | 'password';

definePageMeta({
  layout: 'auth',
  appState: 'needs-login',
});

const authStore = useAuthStore();
const { login } = authStore;

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

function validate(field: Field) {
  switch (field) {
    case 'email':
      const emailValidation = loginInputSchema
        .pick({
          email: true,
        })
        .safeParse({ email: inputForm.email });
      if (!emailValidation.success) {
        errorMessages.email =
          z.flattenError(emailValidation.error).fieldErrors.email?.[0] ??
          'Invalid email';
      } else {
        errorMessages.email = '';
      }
      break;
    case 'password':
      const passwordValidation = loginInputSchema
        .pick({
          password: true,
        })
        .safeParse({ password: inputForm.password });
      if (!passwordValidation.success) {
        errorMessages.password =
          z.flattenError(passwordValidation.error).fieldErrors.password?.[0] ??
          'Password required';
      } else {
        errorMessages.password = '';
      }
      break;
  }
}

function onBlur(field: Field) {
  switch (field) {
    case 'email':
      focusedFields.email = false;
      if (!touchedFields.email) touchedFields.email = true;
      validate(field);
      break;
    case 'password':
      focusedFields.password = false;
      if (!touchedFields.password) touchedFields.password = true;
      validate(field);
      break;
  }
}

function onFocus(field: Field) {
  switch (field) {
    case 'email':
      focusedFields.email = true;
      break;
    case 'password':
      focusedFields.password = true;
      break;
  }
}

async function submit() {
  Object.keys(touchedFields).forEach((key) => {
    touchedFields[key as Field] = true;
  });

  errorMessages.submit = '';

  const loginResponse = await login(inputForm);
  if ('id' in loginResponse) {
    const initError = await initStores(loginResponse.id);
    if (initError) {
      return navigateTo('/error');
    }

    return navigateTo('/');
  }

  if (loginResponse instanceof ZodError) {
    const { email, password } = z.flattenError(loginResponse).fieldErrors;
    errorMessages.email = email?.[0] ?? '';
    errorMessages.password = password?.[0] ?? '';
  }

  if ('kind' in loginResponse) {
    if (loginResponse.kind === 'authentication') {
      errorMessages.submit = 'Email or password incorrect';
      return;
    }

    if (loginResponse.kind === 'authorization') {
      errorMessages.submit =
        'User not activated. Please check your email for activation link.';
      return;
    }

    errorMessages.submit =
      'An unexpected error occurred. Please try again later.';
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
                    @keyup="touchedFields.email ? validate('email') : null"
                    @focus="onFocus('email')"
                    @blur="onBlur('email')"
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
                    @keyup="
                      touchedFields.password ? validate('password') : null
                    "
                    @focus="onFocus('password')"
                    @blur="onBlur('password')"
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
              @click="
                () => {
                  return navigateTo('/reset-password');
                }
              "
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
