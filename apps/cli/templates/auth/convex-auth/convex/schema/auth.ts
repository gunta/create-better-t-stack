import { defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";

// The auth library automatically manages these tables
export const authSchema = {
  ...authTables,
  // Add any custom user fields here if needed
  // users: defineTable({
  //   ...authTables.users.fields,
  //   // Add custom fields
  //   displayName: v.optional(v.string()),
  //   avatarUrl: v.optional(v.string()),
  // }),
};