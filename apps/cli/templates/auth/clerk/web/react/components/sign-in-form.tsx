import { SignIn } from "@clerk/clerk-react";

export function SignInForm() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <SignIn
        path="/login"
        routing="path"
        signUpUrl="/signup"
        appearance={{
          elements: {
            formButtonPrimary: 
              "bg-primary text-primary-foreground hover:bg-primary/90",
            card: "shadow-none",
          },
        }}
      />
    </div>
  );
}