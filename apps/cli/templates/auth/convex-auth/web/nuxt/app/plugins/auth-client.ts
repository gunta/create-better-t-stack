import { useAuthActions } from "@convex-dev/auth/nuxt";
import { api } from "~/convex";

export default defineNuxtPlugin(() => {
  const { signIn, signOut } = useAuthActions();
  const user = useQuery(api.users.viewer);
  
  return {
    provide: {
      auth: {
        user,
        signIn,
        signOut,
        isLoading: computed(() => user.value === undefined),
        isAuthenticated: computed(() => user.value !== null),
      }
    }
  }
});