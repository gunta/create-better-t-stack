import { loadStripe } from "@stripe/stripe-js";

// Initialize Stripe - this is safe to call multiple times
export const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 
  process.env.PUBLIC_STRIPE_PUBLISHABLE_KEY || 
  ""
);