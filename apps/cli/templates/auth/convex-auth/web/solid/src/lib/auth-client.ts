import { useAuthActions } from "@convex-dev/auth/solid";
import { createQuery } from "@tanstack/solid-query";
import { api } from "./convex";
import { useConvex } from "solid-convex";

export function useAuth() {
  const { signIn, signOut } = useAuthActions();
  const convex = useConvex();
  
  const userQuery = createQuery(() => ({
    queryKey: ["viewer"],
    queryFn: () => convex.query(api.users.viewer),
  }));
  
  return {
    user: userQuery.data,
    signIn,
    signOut,
    isLoading: userQuery.isLoading,
    isAuthenticated: !!userQuery.data,
  };
}