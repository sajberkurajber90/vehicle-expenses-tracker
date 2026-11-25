<script setup lang="ts">
import { useUserStore } from '~/features/user/user.store';
import { useAuthStore } from '~/features/auth/auth.store';
const userStore = useUserStore();
const { sessionUser } = storeToRefs(useAuthStore());
import { useTheme } from '../../../../packages/ui-core/app/composables/useTheme';
const { thema, setTheme } = useTheme();

definePageMeta({
  layout: 'default',
  appState: 'needs-user-settings',
});

const submitState = ref<'idle' | 'submitting' | 'success' | 'error'>('idle');
async function submit() {
  if (!sessionUser.value) {
    return;
  }
  const payload = {
    theme: thema.value,
    userId: sessionUser.value.id,
  };

  const result = await userStore.createUserSettings(payload);
  if (result === null) {
    return navigateTo('/');
  }
}
</script>

<template>
  <div class="h-full flex items-center justify-center">
    <div
      class="w-96 card p-12 flex flex-col gap-4 items-start border-primary/50 border-2 rounded-md"
    >
      <h2 class="text-xl font-bold">Set User Settings</h2>
      <label class="select">
        <span class="label">Theme</span>
        <select class="">
          <option @click="setTheme('system')" :selected="thema === 'system'">
            System
          </option>
          <option @click="setTheme('light')" :selected="thema === 'light'">
            Light
          </option>
          <option @click="setTheme('dark')" :selected="thema === 'dark'">
            Dark
          </option>
        </select>
      </label>
      <div class="h-20"></div>
      <button class="btn btn-primary w-full" @click="submit">Submit</button>
    </div>
  </div>
</template>

<style scoped></style>
