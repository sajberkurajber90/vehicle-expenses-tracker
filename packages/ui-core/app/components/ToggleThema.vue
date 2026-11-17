<script setup lang="ts">
import LightTheme from './icons/LightTheme.vue';
import DarkTheme from './icons/DarkTheme.vue';
import SystemTheme from './icons/SystemTheme.vue';

const { expanded } = defineProps<{
  expanded: boolean;
}>();
const { thema, setThema } = useThema();
</script>

<template>
  <Transition>
    <div
      v-show="expanded"
      class="p-2 flex justify-center space-x-2 items-bottom"
    >
      <button
        @click="setThema('light')"
        :class="{
          'btn-secondary': thema !== 'light',
        }"
        class="btn btn-circle btn-primary btn-sm"
      >
        <LightTheme />
      </button>
      <button
        @click="setThema('system')"
        :class="{
          'btn-secondary': thema !== 'system',
        }"
        class="btn btn-circle btn-primary btn-sm"
      >
        <SystemTheme />
      </button>
      <button
        @click="setThema('dark')"
        :class="{
          'btn-secondary': thema !== 'dark',
        }"
        class="btn btn-circle btn-primary btn-sm"
      >
        <DarkTheme />
      </button>
    </div>
  </Transition>
</template>

<style scoped></style>
