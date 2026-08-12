<script setup lang="ts">
definePageMeta({
  layout: 'auth',
});
</script>

<template>
  <div class="h-full flex items-center justify-center">
    <div
      class="card min-h-75 shadow-base-300 shadow-xl dark:bg-base-300 p-12 grid grid-cols-[300px_10px_300px] gap-x-8 gap-y-8"
    >
      <h2 class="col-span-3 text-2xl font-bold">Register Super Admin</h2>
      <div class="flex flex-col gap-4">
        <input class="input" type="email" placeholder="Email" />
        <input class="input" type="password" placeholder="Password" />
        <input class="input" type="password" placeholder="Confirm Password" />
      </div>
      <div>
        <div class="m-auto w-px h-full dark:bg-gray-500 bg-gray-200"></div>
      </div>
      <div class="flex flex-col gap-4">
        <input class="input" type="text" placeholder="First Name" />
        <input class="input" type="text" placeholder="Last Name" />
      </div>
      <div class="col-span-3 justify-self-end">
        <button class="btn btn-primary">Register</button>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
