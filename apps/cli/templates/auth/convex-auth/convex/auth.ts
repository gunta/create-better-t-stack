import { convexAuth } from "@convex-dev/auth/server";
import authConfig from "./auth.config";

export const { auth, signIn, signOut, store } = convexAuth(authConfig);