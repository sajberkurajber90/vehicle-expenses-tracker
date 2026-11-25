<script setup lang="ts">
import LightTheme from './icons/LightTheme.vue';
import DarkTheme from './icons/DarkTheme.vue';
import SystemTheme from './icons/SystemTheme.vue';
import { useTheme } from '../composables/useTheme.ts';

const { expanded } = defineProps<{
  expanded: boolean;
  transition: boolean;
}>();

const emit = defineEmits<{
  (e: 'updateTheme', value: 'light' | 'dark' | 'system'): void;
}>();

function changeTheme(theme: 'light' | 'dark' | 'system') {
  setTheme(theme);
  emit('updateTheme', theme);
}

const { thema, setTheme } = useTheme();
</script>

<template>
  <div>
    <Transition>
      <div v-show="expanded" class="flex justify-center space-x-2 items-bottom">
        <button
          @click="changeTheme('light')"
          :class="{
            'btn-secondary': thema !== 'light',
          }"
          class="btn btn-circle btn-primary btn-sm"
        >
          <LightTheme />
        </button>
        <button
          @click="changeTheme('system')"
          :class="{
            'btn-secondary': thema !== 'system',
          }"
          class="btn btn-circle btn-primary btn-sm"
        >
          <SystemTheme />
        </button>
        <button
          @click="changeTheme('dark')"
          :class="{
            'btn-secondary': thema !== 'dark',
          }"
          class="btn btn-circle btn-primary btn-sm"
        >
          <DarkTheme />
        </button>
      </div>
    </Transition>
    <Transition name="fade">
      <div
        v-show="!transition && !expanded"
        class="flex justify-center items-center w-full"
      >
        <div
          class="w-8 h-8 bg-primary rounded-full flex justify-center items-center"
        >
          <DarkTheme v-show="thema === 'dark'" />
          <LightTheme v-show="thema === 'light'" />
          <SystemTheme v-show="thema === 'system'" />
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped></style>
