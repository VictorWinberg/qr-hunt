/// <reference types="vite/client" />
/// <reference types="google.maps" />

declare const __APP_VERSION__: string;

interface ImportMetaEnv {
  // see https://vitejs.dev/guide/env-and-mode.html#env-files
  readonly VITE_APP_GOOGLE_API_KEY: string;
  readonly VITE_APP_WEBSTORAGE_NAMESPACE?: string;
  readonly VITE_SENTRY_DSN?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
