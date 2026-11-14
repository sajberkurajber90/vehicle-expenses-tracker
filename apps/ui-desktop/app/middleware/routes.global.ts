import { useAppState } from '~/composables/useAppState';
import { useAuthorizationStore } from '~/features/authorization/authorization.store';

export default defineNuxtRouteMiddleware(async (to, from) => {
  const { appState } = useAppState();
  const { sessionRole } = storeToRefs(useAuthorizationStore());

  const requiredRoles = to.meta.roles ?? [];
  const requiredState = to.meta.appState ?? 'authenticated';

  // compare current app state with the required state for the route
  if (appState.value !== requiredState) {
    return navigateTo(policies[appState.value].redirectTo);
  }

  // TODO: check if route requires specific roles
});
