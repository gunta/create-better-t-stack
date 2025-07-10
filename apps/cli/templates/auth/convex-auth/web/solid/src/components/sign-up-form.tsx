import { createSignal } from "solid-js";
import { useAuthActions } from "@convex-dev/auth/solid";

export function SignUpForm() {
  const { signIn } = useAuthActions();
  const [email, setEmail] = createSignal("");
  const [password, setPassword] = createSignal("");
  const [confirmPassword, setConfirmPassword] = createSignal("");
  const [error, setError] = createSignal("");
  const [isLoading, setIsLoading] = createSignal(false);

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault();
    setError("");

    if (password() !== confirmPassword()) {
      setError("Passwords do not match");
      return;
    }

    if (password().length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setIsLoading(true);

    try {
      await signIn("password", { email: email(), password: password(), isSignUp: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to sign up");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div class="card w-full max-w-md mx-auto">
      <div class="card-header">
        <h3 class="card-title">Sign Up</h3>
        <p class="card-description">Create a new account</p>
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
              minLength={8}
              class="input"
            />
          </div>
          <div class="space-y-2">
            <label for="confirmPassword" class="label">Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword()}
              onInput={(e) => setConfirmPassword(e.currentTarget.value)}
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
            {isLoading() ? "Creating account..." : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
}