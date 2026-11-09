import { useAppState } from '~/composables/useAppState';

export default defineNuxtRouteMiddleware(async (to, from) => {
  const { appState } = useAppState();
  if (!policies[appState.value].allow(to.path)) {
    return navigateTo(policies[appState.value].redirectTo);
  }
});
