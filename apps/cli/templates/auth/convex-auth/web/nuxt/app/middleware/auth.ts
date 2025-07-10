export default defineNuxtRouteMiddleware((to) => {
  const { $auth } = useNuxtApp();
  
  if (!$auth.isLoading.value && !$auth.user.value) {
    return navigateTo("/login");
  }
});