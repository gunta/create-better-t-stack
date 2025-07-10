import { useAuthActions } from "@convex-dev/auth/svelte";
import { useQuery } from "convex/svelte";
import { api } from "$lib/convex";

export function useAuth() {
  const { signIn, signOut } = useAuthActions();
  const user = useQuery(api.users.viewer, {});
  
  return {
    user,
    signIn,
    signOut,
    isLoading: user === undefined,
    isAuthenticated: user !== null,
  };
}