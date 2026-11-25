<script setup lang="ts">
import { useAuthStore } from '~/features/auth/auth.store';
import { useUserStore } from '~/features/user/user.store';
import SidebarItem from '~/components/sidebar/SidebarItem.vue';
import ToggleThema from '@vehicle-expenses-tracker/ui-core/app/components/ToggleThema.vue';

const { sessionUser } = storeToRefs(useAuthStore());
const { logout: sessionLogout } = useAuthStore();
const { userSettings } = storeToRefs(useUserStore());
const { syncTheme } = useUserStore();
const { setTransition } = useAppState();
const { delay } = useDelay();
//
async function logout() {
  setTransition(true);
  await sessionLogout();
  await delay(2000);
  await navigateTo('/login');
  setTransition(false);
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

async function toggleTheme(theme: 'light' | 'dark' | 'system') {
  if (sessionUser.value && userSettings.value) {
    await syncTheme({
      id: userSettings.value.id,
      userId: sessionUser.value.id,
      theme,
    });
  }
}
</script>

<template>
  <aside class="h-full w-20 relative">
    <div
      class="w-20 h-full absolute rounded transition-[width] duration-500 ease-in-out top-0 p-4 bg-base-200 border-primary/50 border-2"
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
        <div class="flex-1">
          <ToggleThema
            v-show="userSettings !== null"
            :transition="transitionState === 'transition'"
            :expanded="transitionState === 'expanded'"
            @update-theme="toggleTheme"
          />
        </div>
        <SidebarItem :animation-trigger="hover" :border-top="true">
          <template v-slot:icon>
            <div
              class="w-10 h-10 rounded-full bg-primary flex text-white justify-center items-center"
            >
              <div>TB</div>
            </div>
          </template>
          <template v-slot:label>
            <Transition>
              <div
                class="pl-2 flex justify-between items-end"
                v-show="transitionState === 'expanded'"
              >
                <div class="text-xs">
                  {{ sessionUser?.firstName }} <br />
                  {{ sessionUser?.lastName }}
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
