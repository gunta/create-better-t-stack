<template>
  <div class="card w-full max-w-md mx-auto">
    <div class="card-header">
      <h3 class="card-title">Sign In</h3>
      <p class="card-description">Sign in to your account</p>
    </div>
    <div class="card-content">
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div class="space-y-2">
          <label for="email" class="label">Email</label>
          <input
            id="email"
            v-model="email"
            type="email"
            placeholder="you@example.com"
            required
            class="input"
          />
        </div>
        <div class="space-y-2">
          <label for="password" class="label">Password</label>
          <input
            id="password"
            v-model="password"
            type="password"
            required
            class="input"
          />
        </div>
        <p v-if="error" class="text-sm text-red-600">{{ error }}</p>
        <button
          type="submit"
          class="btn btn-primary w-full"
          :disabled="isLoading"
        >
          {{ isLoading ? "Signing in..." : "Sign In" }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
const { $auth } = useNuxtApp();
const email = ref("");
const password = ref("");
const error = ref("");
const isLoading = ref(false);

async function handleSubmit() {
  error.value = "";
  isLoading.value = true;

  try {
    await $auth.signIn("password", { email: email.value, password: password.value });
  } catch (err) {
    error.value = err instanceof Error ? err.message : "Failed to sign in";
  } finally {
    isLoading.value = false;
  }
}
</script>