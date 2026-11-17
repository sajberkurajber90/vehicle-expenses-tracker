import type { AppState } from '../../../../apps/ui-desktop/app/utils/resolve.app.state';
declare module '#app' {
  interface PageMeta {
    appState: AppState;
    roles?: string[];
  }
}

export {};
