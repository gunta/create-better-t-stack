<template>
  <div class="card w-full max-w-md mx-auto">
    <div class="card-header">
      <h3 class="card-title">Sign Up</h3>
      <p class="card-description">Create a new account</p>
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
            minlength="8"
            class="input"
          />
        </div>
        <div class="space-y-2">
          <label for="confirmPassword" class="label">Confirm Password</label>
          <input
            id="confirmPassword"
            v-model="confirmPassword"
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
          {{ isLoading ? "Creating account..." : "Sign Up" }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
const { $auth } = useNuxtApp();
const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const error = ref("");
const isLoading = ref(false);

async function handleSubmit() {
  error.value = "";

  if (password.value !== confirmPassword.value) {
    error.value = "Passwords do not match";
    return;
  }

  if (password.value.length < 8) {
    error.value = "Password must be at least 8 characters";
    return;
  }

  isLoading.value = true;

  try {
    await $auth.signIn("password", { 
      email: email.value, 
      password: password.value, 
      isSignUp: true 
    });
  } catch (err) {
    error.value = err instanceof Error ? err.message : "Failed to sign up";
  } finally {
    isLoading.value = false;
  }
}
</script>