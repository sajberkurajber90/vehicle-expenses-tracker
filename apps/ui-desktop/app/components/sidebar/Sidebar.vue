<script setup lang="ts">
import { useAuthStore } from '~/features/auth/auth.store';
import SidebarItem from '~/components/sidebar/SidebarItem.vue';

const authStore = useAuthStore();
async function logout() {
  await authStore.logout();
  await navigateTo('/login');
}

type TransitionState = 'shrink' | 'expanded' | 'transition';
type TransitionDirection = 'in' | 'out';

const transitionState = ref<TransitionState>('shrink');
const transitionDirection = ref<TransitionDirection>('in');

function startTransition() {
  if (transitionState.value === 'shrink') {
    transitionDirection.value = 'in';
  } else if (transitionState.value === 'expanded') {
    transitionDirection.value = 'out';
  }

  transitionState.value = 'transition';
}

function endTransition() {
  if (
    transitionState.value === 'transition' &&
    transitionDirection.value === 'in'
  ) {
    transitionState.value = 'expanded';
  } else if (
    transitionState.value === 'transition' &&
    transitionDirection.value === 'out'
  ) {
    transitionState.value = 'shrink';
  }
}

// change direction if transition is canceled
function cancelTransition() {
  if (transitionDirection.value === 'in') {
    transitionDirection.value = 'out';
  } else {
    transitionDirection.value = 'in';
  }
}

const hover = ref(false);
</script>

<template>
  <aside class="h-full w-20 relative">
    <div
      class="w-20 h-full absolute z-10 rounded transition-[width] duration-500 ease-in-out top-0 bg-gray-700 p-4"
      :class="{
        'w-20': !hover,
        'w-64': hover,
      }"
      @transitionstart.self="startTransition()"
      @transitioncancel.self="cancelTransition()"
      @transitionend.self="endTransition()"
      @mouseenter="() => (hover = true)"
      @mouseleave="() => (hover = false)"
    >
      <div class="h-full flex flex-col gap-2">
        <div class="flex-1"></div>
        <SidebarItem :animation-trigger="hover" :border-top="true">
          <template v-slot:icon>
            <div class="avatar avatar-placeholder flex items-center">
              <div class="bg-neutral w-10 rounded-full">
                <div>TB</div>
              </div>
            </div>
          </template>
          <template v-slot:label>
            <Transition name="fade">
              <div
                class="pl-2 flex justify-between items-end"
                v-if="transitionState === 'expanded'"
              >
                <div class="text-xs">
                  {{ authStore.sessionUser?.firstName }} <br />
                  {{ authStore.sessionUser?.lastName }}
                </div>
                <button class="btn btn-primary btn-xs" @click="logout">
                  Logout
                </button>
              </div>
            </Transition>
          </template>
        </SidebarItem>
      </div>
    </div>
  </aside>
</template>

<style scoped></style>
