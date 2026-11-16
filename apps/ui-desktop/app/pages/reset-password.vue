<script setup lang="ts">
import { useAuthStore } from '~/features/auth/auth.store';
import { resetPasswordInputSchema } from '~/features/auth/auth.schema';
import { z, ZodError } from 'zod';
import { useDelay } from '~/composables/useDelay';
import Check from '@vehicle-expenses-tracker/ui-core/app/components/icons/Check.vue';

definePageMeta({
  layout: 'auth',
  appState: 'needs-login',
});

const { delay } = useDelay();
const { resetPassword } = useAuthStore();
const submitState = ref<'idle' | 'submitting' | 'success' | 'error'>('idle');

const email = ref('');

const errorMessages = reactive({
  email: '',
  submit: '',
});

const emailFocus = ref<boolean>(false);
const emailTouched = ref<boolean>(false);

function validate() {
  const emailValidation = resetPasswordInputSchema
    .omit({ redirectTo: true })
    .safeParse({
      email: email.value,
    });
  if (!emailValidation.success) {
    errorMessages.email =
      z.flattenError(emailValidation.error).fieldErrors.email?.[0] ??
      'Invalid email';
  } else {
    errorMessages.email = '';
  }
}

function onFocus() {
  emailFocus.value = true;
}

function onBlur() {
  emailFocus.value = false;
  emailTouched.value = true;
  validate();
}

async function submit() {
  submitState.value = 'submitting';
  if (!emailTouched.value) {
    emailTouched.value = true;
  }

  if (errorMessages.submit !== '') {
    errorMessages.submit = '';
  }

  const response = await resetPassword(email.value);
  if (response instanceof ZodError) {
    const errors = z.flattenError(response).fieldErrors;
    errorMessages.email = errors.email?.[0] ?? '';
    errorMessages.submit = errors.redirectTo?.[0] ?? '';
  }

  if ('data' in response && response.data.status) {
    submitState.value = 'success';
    await delay(2000);
    await navigateTo('/login');
  }

  if ('kind' in response) {
    errorMessages.submit = response.message;
    submitState.value = 'error';
    return;
  }

  submitState.value = 'idle';
}
</script>

<template>
  <div class="h-full flex items-center justify-center">
    <div
      class="card shadow-base-300 shadow-xl dark:bg-base-300 bg-base-200 max-w-100 p-12 flex flex-col gap-4"
    >
      <h2 class="font-bold text-2xl">Reset Password</h2>
      <p class="text-xs mb-4">
        Please enter your email address to receive a password reset link.
      </p>
      <div>
        <label class="floating-label">
          <span :class="{ 'text-error': errorMessages.email }">Email</span>
          <input
            type="email"
            v-model="email"
            placeholder="Email"
            class="input w-full"
            @keyup="emailTouched ? validate() : null"
            @focus="onFocus()"
            @blur="onBlur()"
            :class="{
              'text-error': errorMessages.email,
              'input-error': errorMessages.email,
              'input-primary': !errorMessages.email && emailFocus,
            }"
          />
        </label>
        <p :class="{ 'text-error': errorMessages.email }" class="label text-xs">
          {{ errorMessages.email }}
        </p>
      </div>
      <div class="h-10">
        <div
          v-show="submitState === 'success'"
          class="flex items-center justify-start space-x-2 text-xs"
        >
          <Check />
          <p>
            {{
              'Password reset request successful. Please check your email. Redirecting to login...'
            }}
          </p>
        </div>
      </div>
      <button
        :class="{
          'btn-disabled':
            submitState === 'submitting' || submitState === 'success',
        }"
        class="btn btn-primary w-full"
        @click="submit"
      >
        Submit
      </button>
    </div>
  </div>
</template>

<style scoped></style>
