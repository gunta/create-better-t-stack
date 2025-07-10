import { createSignal } from "solid-js";
import { useAuthActions } from "@convex-dev/auth/solid";

export function SignInForm() {
  const { signIn } = useAuthActions();
  const [email, setEmail] = createSignal("");
  const [password, setPassword] = createSignal("");
  const [error, setError] = createSignal("");
  const [isLoading, setIsLoading] = createSignal(false);

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await signIn("password", { email: email(), password: password() });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to sign in");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div class="card w-full max-w-md mx-auto">
      <div class="card-header">
        <h3 class="card-title">Sign In</h3>
        <p class="card-description">Sign in to your account</p>
      </div>
      <div class="card-content">
        <form onSubmit={handleSubmit} class="space-y-4">
          <div class="space-y-2">
            <label for="email" class="label">Email</label>
            <input
              id="email"
              type="email"
              value={email()}
              onInput={(e) => setEmail(e.currentTarget.value)}
              placeholder="you@example.com"
              required
              class="input"
            />
          </div>
          <div class="space-y-2">
            <label for="password" class="label">Password</label>
            <input
              id="password"
              type="password"
              value={password()}
              onInput={(e) => setPassword(e.currentTarget.value)}
              required
              class="input"
            />
          </div>
          {error() && (
            <p class="text-sm text-red-600">{error()}</p>
          )}
          <button
            type="submit"
            class="btn btn-primary w-full"
            disabled={isLoading()}
          >
            {isLoading() ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}