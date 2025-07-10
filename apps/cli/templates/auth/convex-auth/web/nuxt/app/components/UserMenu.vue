<template>
  <div v-if="$auth.isLoading.value" class="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
  <div v-else-if="$auth.user.value" class="dropdown dropdown-end">
    <button class="btn btn-ghost btn-circle" tabindex="0">
      <Icon name="lucide:user" size="16" />
      <span class="sr-only">User menu</span>
    </button>
    <ul class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
      <li class="menu-title">My Account</li>
      <li>
        <button @click="$auth.signOut()">
          Sign out
        </button>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
const { $auth } = useNuxtApp();
</script>