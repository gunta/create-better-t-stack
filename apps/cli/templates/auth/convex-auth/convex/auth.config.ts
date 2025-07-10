import type { AuthConfig } from "@convex-dev/auth/server";

export default {
  providers: [
    {
      id: "password",
      type: "password",
    },
    // Add more providers as needed:
    // {
    //   id: "github",
    //   type: "oauth",
    //   clientId: process.env.AUTH_GITHUB_ID!,
    //   clientSecret: process.env.AUTH_GITHUB_SECRET!,
    // },
    // {
    //   id: "google",
    //   type: "oauth",
    //   clientId: process.env.AUTH_GOOGLE_ID!,
    //   clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    // },
  ],
  callbacks: {
    async createOrUpdateUser(ctx, args) {
      // You can use this callback to create/update user documents
      // when they sign in
      return args.userId;
    },
  },
} satisfies AuthConfig;