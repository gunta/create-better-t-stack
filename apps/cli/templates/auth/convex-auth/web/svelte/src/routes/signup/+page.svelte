<script>
  import SignUpForm from "$components/SignUpForm.svelte";
</script>

<div class="container flex items-center justify-center min-h-[calc(100vh-4rem)] py-8">
  <div class="w-full max-w-md space-y-4">
    <SignUpForm />
    <p class="text-center text-sm text-muted-foreground">
      Already have an account?
      <a href="/login" class="underline underline-offset-4 hover:text-primary">
        Sign in
      </a>
    </p>
  </div>
</div>