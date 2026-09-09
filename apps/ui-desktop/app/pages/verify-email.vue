<script setup lang="ts">
const route = useRoute();
const { token } = route.query;
</script>

<template>
  <div>
    <div v-if="token === undefined">Ups</div>
    <div v-else>{{ token }}</div>
  </div>
</template>

<style scoped></style>
