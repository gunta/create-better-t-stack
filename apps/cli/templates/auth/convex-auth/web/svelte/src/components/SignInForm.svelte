<script lang="ts">
  import { useAuthActions } from "@convex-dev/auth/svelte";
  
  const { signIn } = useAuthActions();
  
  let email = "";
  let password = "";
  let error = "";
  let isLoading = false;

  async function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    error = "";
    isLoading = true;

    try {
      await signIn("password", { email, password });
    } catch (err) {
      error = err instanceof Error ? err.message : "Failed to sign in";
    } finally {
      isLoading = false;
    }
  }
</script>

<div class="card w-full max-w-md mx-auto">
  <div class="card-header">
    <h3 class="card-title">Sign In</h3>
    <p class="card-description">Sign in to your account</p>
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
        {isLoading ? "Signing in..." : "Sign In"}
      </button>
    </form>
  </div>
</div>