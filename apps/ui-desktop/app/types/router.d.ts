import type { AppState } from '~/utils/resolve.app.state';
declare module '#app' {
  interface PageMeta {
    appState: AppState;
    roles?: string[];
  }
}

export {};
