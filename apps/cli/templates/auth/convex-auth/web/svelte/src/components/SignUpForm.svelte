<script lang="ts">
  import { useAuthActions } from "@convex-dev/auth/svelte";
  
  const { signIn } = useAuthActions();
  
  let email = "";
  let password = "";
  let confirmPassword = "";
  let error = "";
  let isLoading = false;

  async function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    error = "";

    if (password !== confirmPassword) {
      error = "Passwords do not match";
      return;
    }

    if (password.length < 8) {
      error = "Password must be at least 8 characters";
      return;
    }

    isLoading = true;

    try {
      await signIn("password", { email, password, isSignUp: true });
    } catch (err) {
      error = err instanceof Error ? err.message : "Failed to sign up";
    } finally {
      isLoading = false;
    }
  }
</script>

<div class="card w-full max-w-md mx-auto">
  <div class="card-header">
    <h3 class="card-title">Sign Up</h3>
    <p class="card-description">Create a new account</p>
  </div>
  <div class="card-content">
    <form on:submit={handleSubmit} class="space-y-4">
      <div class="space-y-2">
        <label for="email" class="label">Email</label>
        <input
          id="email"
          type="email"
          bind:value={email}
          placeholder="you@example.com"
          required
          class="input"
        />
      </div>
      <div class="space-y-2">
        <label for="password" class="label">Password</label>
        <input
          id="password"
          type="password"
          bind:value={password}
          required
          minlength="8"
          class="input"
        />
      </div>
      <div class="space-y-2">
        <label for="confirmPassword" class="label">Confirm Password</label>
        <input
          id="confirmPassword"
          type="password"
          bind:value={confirmPassword}
          required
          class="input"
        />
      </div>
      {#if error}
        <p class="text-sm text-red-600">{error}</p>
      {/if}
      <button
        type="submit"
        class="btn btn-primary w-full"
        disabled={isLoading}
      >
        {isLoading ? "Creating account..." : "Sign Up"}
      </button>
    </form>
  </div>
</div>