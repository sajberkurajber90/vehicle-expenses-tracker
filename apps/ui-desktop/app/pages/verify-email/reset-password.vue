<script setup lang="ts">
import { z, ZodError } from 'zod';
import XMark from '~/components/icons/XMark.vue';
import PasswordHide from '~/components/icons/PasswordHide.vue';
import PasswordShow from '~/components/icons/PasswordShow.vue';
import { ref } from 'vue';
import { confirmResetPasswordInputSchema } from '~/features/auth/auth.schema';
import { useAuthStore } from '~/features/auth/auth.store';
import Check from '~/components/icons/Check.vue';

definePageMeta({
  layout: 'auth',
  appState: 'needs-login',
});

type Field = 'newPassword' | 'confirmNewPassword';
const route = useRoute();
const { delay } = useDelay();
const { token, error } = route.query;
const { confirmResetPassword } = useAuthStore();
const parsedToken = z.string().safeParse(token);
const parsedError =
  error === undefined ? undefined : z.string().safeParse(error);

const showPassword = ref(false);
const submitState = ref<'idle' | 'submitting' | 'success' | 'error'>('idle');

const inputForm = reactive({
  newPassword: '',
  confirmNewPassword: '',
});

const errorMessages = reactive({
  newPassword: '',
  confirmNewPassword: '',
  submit: '',
});

const focusedFields = reactive({
  newPassword: false,
  confirmNewPassword: false,
});

const touchedFields = reactive({
  newPassword: false,
  confirmNewPassword: false,
});

function validate(field: Field) {
  switch (field) {
    case 'newPassword':
      const passwordValidation = confirmResetPasswordInputSchema
        .pick({
          newPassword: true,
        })
        .safeParse({ newPassword: inputForm.newPassword });
      if (!passwordValidation.success) {
        errorMessages.newPassword =
          z.flattenError(passwordValidation.error).fieldErrors
            .newPassword?.[0] ||
          'min 8 chars, uppercase letter, special char and number';
      } else {
        errorMessages.newPassword = '';
      }
      break;
    case 'confirmNewPassword':
      const passwordConformationValidation = confirmResetPasswordInputSchema
        .pick({
          newPassword: true,
          confirmNewPassword: true,
        })
        .refine((data) => data.newPassword === data.confirmNewPassword, {
          message: "Passwords don't match",
          path: ['confirmNewPassword'],
        })
        .safeParse({
          newPassword: inputForm.newPassword,
          confirmNewPassword: inputForm.confirmNewPassword,
        });
      if (!passwordConformationValidation.success) {
        errorMessages.confirmNewPassword =
          z.flattenError(passwordConformationValidation.error).fieldErrors
            .confirmNewPassword?.[0] || "Passwords don't match";
      } else {
        errorMessages.confirmNewPassword = '';
      }
      break;
  }
}

function onFocus(field: Field) {
  switch (field) {
    case 'newPassword':
      focusedFields.newPassword = true;
      break;
    case 'confirmNewPassword':
      focusedFields.confirmNewPassword = true;
      break;
  }
}

function onBlur(field: Field) {
  switch (field) {
    case 'newPassword':
      focusedFields.newPassword = false;
      if (!touchedFields.newPassword) touchedFields.newPassword = true;
      validate(field);
      break;
    case 'confirmNewPassword':
      focusedFields.confirmNewPassword = false;
      if (!touchedFields.confirmNewPassword)
        touchedFields.confirmNewPassword = true;
      validate(field);
      break;
  }
}

async function submit() {
  submitState.value = 'submitting';
  Object.keys(touchedFields).forEach((key) => {
    touchedFields[key as Field] = true;
  });

  errorMessages.submit = '';

  const response = await confirmResetPassword({
    token: parsedToken.data as string,
    ...inputForm,
  });

  if (response instanceof ZodError) {
    const errors = z.flattenError(response).fieldErrors;
    errorMessages.newPassword = errors.newPassword?.[0] ?? '';
    errorMessages.confirmNewPassword =
      'confirmNewPassword' in errors
        ? ((errors.confirmNewPassword as string[])?.[0] ?? '')
        : '';
  }

  if ('data' in response && response.data.status) {
    submitState.value = 'success';
    await delay(5000);
    navigateTo('/login');
    return;
  }

  if ('kind' in response) {
    if (response.kind === 'bad-request') {
      errorMessages.submit =
        'Invalid or expired token. Please request a new password reset.';
    } else {
      errorMessages.submit =
        'An unexpected error occurred. Please try again later.';
    }

    submitState.value = 'error';
    return;
  }

  submitState.value = 'idle';
}
</script>

<template>
  <div class="h-full flex items-center justify-center">
    <div
      class="card shadow-base-300 shadow-xl dark:bg-base-300 bg-base-200 max-w-100 p-12"
    >
      <div
        v-if="parsedError !== undefined"
        class="flex items-center justify-start space-x-4"
      >
        <XMark />
        <div class="flex flex-col">
          <p class="text-error">Failed to verify email</p>
          <p class="text-error">Please contact support or try later</p>
        </div>
      </div>
      <form @submit.prevent v-else class="flex flex-col gap-4">
        <h2 class="text-xl font-bold mb-4">
          Set new password for your account
        </h2>
        <div class="min-h-16">
          <label
            class="input floating-label"
            :class="{
              'text-error': errorMessages.newPassword,
              'input-error': errorMessages.newPassword,
              'input-primary':
                !errorMessages.newPassword && focusedFields.newPassword,
            }"
          >
            <span>New Password</span>
            <input
              v-model="inputForm.newPassword"
              @keyup="
                touchedFields.newPassword ? validate('newPassword') : null
              "
              :class="{ 'placeholder-error': errorMessages.newPassword }"
              @focus="onFocus('newPassword')"
              @blur="onBlur('newPassword')"
              :type="showPassword ? 'text' : 'password'"
              placeholder="New Password"
            />
            <PasswordHide
              v-if="showPassword"
              class="h-[1.2em] cursor-pointer"
              :class="{
                'fill-primary':
                  !errorMessages.newPassword && focusedFields.newPassword,
                'fill-gray-400': !errorMessages.newPassword,
                'fill-error': errorMessages.newPassword,
              }"
              @click.prevent="showPassword = false"
            />
            <PasswordShow
              v-if="!showPassword"
              :class="{
                'fill-primary':
                  !errorMessages.newPassword && focusedFields.newPassword,
                'fill-gray-400': !errorMessages.newPassword,
                'fill-error': errorMessages.newPassword,
              }"
              class="h-[1.2em] cursor-pointer"
              @click.prevent="showPassword = true"
            />
          </label>
          <p
            :class="{ 'text-error': errorMessages.newPassword }"
            class="label text-xs text-wrap"
          >
            {{ errorMessages.newPassword }}
          </p>
        </div>
        <div>
          <label class="floating-label">
            <span :class="{ 'text-error': errorMessages.confirmNewPassword }"
              >Confirm New Password</span
            >
            <input
              v-model="inputForm.confirmNewPassword"
              @keyup="
                touchedFields.confirmNewPassword
                  ? validate('confirmNewPassword')
                  : null
              "
              @focus="onFocus('confirmNewPassword')"
              @blur="onBlur('confirmNewPassword')"
              :class="{
                'text-error': errorMessages.confirmNewPassword,
                'input-error': errorMessages.confirmNewPassword,
                'input-primary':
                  !errorMessages.confirmNewPassword &&
                  focusedFields.confirmNewPassword,
              }"
              type="password"
              placeholder="Confirm Password"
              class="input w-full"
            />
          </label>
          <p
            :class="{ 'text-error': errorMessages.confirmNewPassword }"
            class="label text-xs"
          >
            {{ errorMessages.confirmNewPassword }}
          </p>
        </div>
        <div class="h-8">
          <div
            v-show="submitState === 'success'"
            class="flex items-center justify-start space-x-2 text-xs"
          >
            <Check />
            <p>
              {{ 'Password changed successfully. Redirecting to login...' }}
            </p>
          </div>
          <div
            v-show="submitState === 'error'"
            class="text-error text-xs flex justify-start space-x-2 items-center"
          >
            <XMark />
            <p>{{ errorMessages.submit }}</p>
          </div>
        </div>
        <button
          :class="{
            'btn-disabled':
              submitState === 'submitting' || submitState === 'success',
          }"
          @click="submit"
          class="btn btn-primary"
        >
          <span
            v-if="submitState === 'submitting'"
            class="loading loading-bars loading-xs"
          ></span>
          Submit
        </button>
      </form>
    </div>
  </div>
</template>

<style scoped></style>
