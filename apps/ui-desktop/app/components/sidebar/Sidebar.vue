<script setup lang="ts">
import { useAuthStore } from '~/features/auth';

const authStore = useAuthStore();
async function logout() {
  await authStore.logout();
  navigateTo('/login');
}

const expand = ref(false);

function onHover() {
  expand.value = true;
}

function onLeave() {
  expand.value = false;
}
</script>

<template>
  <div class="h-full w-20 relative">
    <div
      class="w-20 h-full absolute z-10 rounded transition-[width] duration-300 ease-in-out top-0 bg-gray-700 p-4"
      @mouseenter="onHover"
      @mouseleave="onLeave"
      :class="{
        'w-64': expand,
        'w-20': !expand,
      }"
    >
      <div class="h-full flex flex-col gap-2">
        <div class="flex-1">
          <button v-if="expand" class="btn btn-primary" @click="logout">
            Logout
          </button>
          <div v-if="expand">Welcome: {{ authStore.sessionUser?.name }}</div>
        </div>
        <div class="avatar avatar-placeholder">
          <div class="bg-neutral w-12 rounded-full">
            <div>TB</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
