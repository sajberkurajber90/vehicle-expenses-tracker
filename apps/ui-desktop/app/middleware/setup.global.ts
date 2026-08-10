export default defineNuxtRouteMiddleware(async (to, from) => {
  const config = useRuntimeConfig();
  if (import.meta.server) {
    const { data } = await useFetch(
      (config.apiInternalBase as string) + '/auth/get-session',
    );
    console.log('data:', data.value);
  }
});
