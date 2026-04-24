import type { App } from 'vue';

import * as Sentry from '@sentry/vue';

const defaultDsn = 'https://785c1ccde4314c398c91d4b78e9ae3ee@o1006021.ingest.sentry.io/5966493';

export function initSentry(app: App): void {
  if (!import.meta.env.PROD) return;
  Sentry.init({
    app,
    dsn: import.meta.env.VITE_SENTRY_DSN || defaultDsn,
    tracesSampleRate: 0.2
  });
}
