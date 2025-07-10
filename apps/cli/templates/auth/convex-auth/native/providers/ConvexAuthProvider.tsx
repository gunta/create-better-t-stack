import { ConvexAuthProvider as BaseConvexAuthProvider } from "@convex-dev/auth/react";
import { ConvexReactClient } from "convex/react";
import { ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const convex = new ConvexReactClient(process.env.EXPO_PUBLIC_CONVEX_URL!, {
  unsavedChangesWarning: false,
});

export function ConvexAuthProvider({ children }: { children: ReactNode }) {
  return (
    <BaseConvexAuthProvider client={convex} storage={AsyncStorage}>
      {children}
    </BaseConvexAuthProvider>
  );
}