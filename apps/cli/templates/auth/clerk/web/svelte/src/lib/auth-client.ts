// Note: Clerk doesn't have an official Svelte SDK yet
// You can use the Clerk JavaScript SDK with Svelte
// See: https://clerk.com/docs/references/javascript/overview

import Clerk from '@clerk/clerk-js';

const clerkPublishableKey = import.meta.env.PUBLIC_CLERK_PUBLISHABLE_KEY;

if (!clerkPublishableKey) {
  throw new Error("Missing Clerk Publishable Key");
}

export const clerk = new Clerk(clerkPublishableKey);

// Initialize Clerk when the app starts
clerk.load();