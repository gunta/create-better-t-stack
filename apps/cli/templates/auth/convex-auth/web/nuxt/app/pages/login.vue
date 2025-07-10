<template>
  <div class="container flex items-center justify-center min-h-[calc(100vh-4rem)] py-8">
    <div class="w-full max-w-md space-y-4">
      <SignInForm />
      <p class="text-center text-sm text-muted-foreground">
        Don't have an account?
        <NuxtLink to="/signup" class="underline underline-offset-4 hover:text-primary">
          Sign up
        </NuxtLink>
      </p>
    </div>
  </div>
</template>