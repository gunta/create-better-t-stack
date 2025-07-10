<script lang="ts">
  import { useAuth } from "$lib/auth-client";
  import { User } from "lucide-svelte";
  
  const { user, signOut, isLoading } = useAuth();
</script>

{#if isLoading}
  <div class="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
{:else if $user}
  <div class="dropdown dropdown-end">
    <button class="btn btn-ghost btn-circle" tabindex="0">
      <User size={16} />
      <span class="sr-only">User menu</span>
    </button>
    <ul class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52">
      <li class="menu-title">My Account</li>
      <li>
        <button on:click={() => signOut()}>
          Sign out
        </button>
      </li>
    </ul>
  </div>
{/if}