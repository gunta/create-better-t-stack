<script>
  import { goto } from "$app/navigation";
  import { useAuth } from "$lib/auth-client";
  
  const { user, isLoading } = useAuth();
  
  $: if (!isLoading && !$user) {
    goto("/login");
  }
</script>

{#if isLoading}
  <div class="flex justify-center items-center min-h-[calc(100vh-4rem)]">
    <div class="animate-spin h-8 w-8 border-4 border-current border-t-transparent rounded-full" />
  </div>
{:else if $user}
  <div class="container py-8">
    <h1 class="text-3xl font-bold mb-6">Dashboard</h1>
    <div class="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
      <h3 class="text-lg font-semibold mb-2">Welcome back!</h3>
      <p class="text-muted-foreground">
        You are signed in as {$user.email}
      </p>
    </div>
  </div>
{/if}