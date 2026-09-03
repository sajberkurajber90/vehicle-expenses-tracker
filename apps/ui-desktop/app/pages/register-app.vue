<script setup lang="ts">
type Field =
  'email' | 'password' | 'confirmPassword' | 'firstName' | 'lastName';

definePageMeta({
  layout: 'auth',
});

import { registerAppSchema } from '~/features/auth';
import { useAuthStore } from '~/features/auth';

const authStore = useAuthStore();
const submitState = ref<'idle' | 'submitting' | 'success' | 'error'>('idle');

const inputForm = reactive({
  email: '',
  password: '',
  confirmPassword: '',
  name: '',
  firstName: '',
  lastName: '',
});

const errorMessages = reactive({
  email: '',
  password: '',
  confirmPassword: '',
  firstName: '',
  lastName: '',
});

const touchedFields = reactive({
  email: false,
  password: false,
  confirmPassword: false,
  firstName: false,
  lastName: false,
});

const focusedFields = reactive({
  email: false,
  password: false,
  confirmPassword: false,
  firstName: false,
  lastName: false,
});

watch(
  () => [inputForm.firstName, inputForm.lastName],
  (newValues) => {
    inputForm.name = `${newValues[0]} ${newValues[1]}`.trim();
  },
);

function validate(field: Field) {
  switch (field) {
    case 'email':
      const emailValidation = registerAppSchema
        .pick({
          email: true,
        })
        .safeParse({ email: inputForm.email });
      if (!emailValidation.success) {
        errorMessages.email =
          emailValidation.error.errors[0]?.message || 'Invalid email';
      } else {
        errorMessages.email = '';
      }
      break;
    case 'password':
      const passwordValidation = registerAppSchema
        .pick({
          password: true,
        })
        .safeParse({ password: inputForm.password });
      if (!passwordValidation.success) {
        errorMessages.password =
          'min 8 chars, uppercase letter, special char and number';
      } else {
        errorMessages.password = '';
      }
      break;
    case 'confirmPassword':
      const passwordConformationValidation = registerAppSchema
        .pick({
          password: true,
          confirmPassword: true,
        })
        .refine((data) => data.password === data.confirmPassword, {
          message: "Passwords don't match",
          path: ['confirmPassword'],
        })
        .safeParse({
          password: inputForm.password,
          confirmPassword: inputForm.confirmPassword,
        });
      if (!passwordConformationValidation.success) {
        errorMessages.confirmPassword =
          passwordConformationValidation.error.errors.find(
            (e) => e.code === 'custom',
          )?.message || "Passwords don't match";
      } else {
        errorMessages.confirmPassword = '';
      }
      break;
    case 'firstName':
      const firstNameValidation = registerAppSchema
        .pick({
          firstName: true,
        })
        .safeParse({ firstName: inputForm.firstName });
      if (!firstNameValidation.success) {
        errorMessages.firstName =
          firstNameValidation.error.errors[0]?.message || 'Invalid first name';
      } else {
        errorMessages.firstName = '';
      }
      break;
    case 'lastName':
      const lastNameValidation = registerAppSchema
        .pick({
          lastName: true,
        })
        .safeParse({ lastName: inputForm.lastName });
      if (!lastNameValidation.success) {
        errorMessages.lastName =
          lastNameValidation.error.errors[0]?.message || 'Invalid last name';
      } else {
        errorMessages.lastName = '';
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
    case 'confirmPassword':
      focusedFields.confirmPassword = false;
      if (!touchedFields.confirmPassword) touchedFields.confirmPassword = true;
      validate(field);
      break;
    case 'firstName':
      focusedFields.firstName = false;
      if (!touchedFields.firstName) touchedFields.firstName = true;
      validate(field);
      break;
    case 'lastName':
      focusedFields.lastName = false;
      if (!touchedFields.lastName) touchedFields.lastName = true;
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
    case 'confirmPassword':
      focusedFields.confirmPassword = true;
      break;
    case 'firstName':
      focusedFields.firstName = true;
      break;
    case 'lastName':
      focusedFields.lastName = true;
      break;
  }
}

async function onSubmit() {
  submitState.value = 'submitting';
  await authStore.registerApp(inputForm);
  submitState.value = 'idle';
}
</script>

<template>
  <div class="h-full flex items-center justify-center">
    <form
      @submit.prevent
      class="card min-h-75 shadow-base-300 shadow-xl dark:bg-base-300 bg-base-200 p-12 grid grid-cols-[300px_10px_300px] gap-x-8 gap-y-8"
    >
      <h2 class="col-span-3 text-2xl font-bold">Register Super Admin</h2>
      <div class="flex flex-col gap-2">
        <div>
          <label class="floating-label">
            <span :class="{ 'text-error': errorMessages.email }">Email</span>
            <input
              type="email"
              v-model="inputForm.email"
              @keyup="touchedFields.email ? validate('email') : null"
              @focus="onFocus('email')"
              @blur="onBlur('email')"
              placeholder="Email"
              class="input"
              :class="{
                'text-error': errorMessages.email,
                'input-error': errorMessages.email,
                'input-primary': !errorMessages.email && focusedFields.email,
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
              class="input"
              v-model="inputForm.password"
              @keyup="touchedFields.password ? validate('password') : null"
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
        <div>
          <label class="floating-label">
            <span :class="{ 'text-error': errorMessages.confirmPassword }"
              >Confirm Password</span
            >
            <input
              type="password"
              placeholder="Confirm Password"
              class="input"
              v-model="inputForm.confirmPassword"
              @keyup="
                errorMessages.confirmPassword || touchedFields.confirmPassword
                  ? validate('confirmPassword')
                  : null
              "
              @focus="onFocus('confirmPassword')"
              @blur="onBlur('confirmPassword')"
              :class="{
                'text-error': errorMessages.confirmPassword,
                'input-error': errorMessages.confirmPassword,
                'input-primary':
                  !errorMessages.confirmPassword &&
                  focusedFields.confirmPassword,
              }"
            />
          </label>
          <p
            :class="{ 'text-error': errorMessages.confirmPassword }"
            class="label text-xs"
          >
            {{ errorMessages.confirmPassword }}
          </p>
        </div>
      </div>
      <div>
        <div class="m-auto h-full divider divider-horizontal"></div>
      </div>
      <div class="flex flex-col gap-2">
        <div>
          <label class="floating-label">
            <span :class="{ 'text-error': errorMessages.firstName }"
              >First Name</span
            >
            <input
              type="text"
              placeholder="First Name"
              class="input"
              v-model="inputForm.firstName"
              @keyup="touchedFields.firstName ? validate('firstName') : null"
              @focus="onFocus('firstName')"
              @blur="onBlur('firstName')"
              :class="{
                'text-error': errorMessages.firstName,
                'input-error': errorMessages.firstName,
                'input-primary':
                  !errorMessages.firstName && focusedFields.firstName,
              }"
            />
          </label>
          <p
            :class="{ 'text-error': errorMessages.firstName }"
            class="label text-xs"
          >
            {{ errorMessages.firstName }}
          </p>
        </div>
        <div>
          <label class="floating-label">
            <span :class="{ 'text-error': errorMessages.lastName }"
              >Last Name</span
            >
            <input
              type="text"
              v-model="inputForm.lastName"
              @keyup="touchedFields.lastName ? validate('lastName') : null"
              @focus="onFocus('lastName')"
              @blur="onBlur('lastName')"
              placeholder="Last Name"
              class="input"
              :class="{
                'text-error': errorMessages.lastName,
                'input-error': errorMessages.lastName,
                'input-primary':
                  !errorMessages.lastName && focusedFields.lastName,
              }"
            />
          </label>
          <p
            :class="{ 'text-error': errorMessages.lastName }"
            class="label text-xs"
          >
            {{ errorMessages.lastName }}
          </p>
        </div>
      </div>
      <div class="col-span-3 flex justify-between items-center">
        <div v-show="submitState === 'idle'"></div>
        <div
          v-show="submitState === 'submitting'"
          class="loading loading-spinner text-success"
        ></div>
        <button @click="onSubmit" class="btn btn-primary">Register</button>
      </div>
    </form>
  </div>
</template>

<style scoped></style>
