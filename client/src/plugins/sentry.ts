import Vue from "vue";
import * as Sentry from "@sentry/vue";
import { Integrations } from "@sentry/tracing";

import router from "../router";

const publicKey = "785c1ccde4314c398c91d4b78e9ae3ee";
const domain = "o1006021.ingest.sentry.io";
const projectId = "5966493";

if (process.env.NODE_ENV === "production") {
  Sentry.init({
    Vue,
    dsn: `https://${publicKey}@${domain}/${projectId}`,
    integrations: [
      new Integrations.BrowserTracing({
        routingInstrumentation: Sentry.vueRouterInstrumentation(router),
        tracingOrigins: ["qrhunt.ml", "qr.zolly.ml", /^\//]
      })
    ],
    beforeSend: (event, hint) => {
      if (hint) {
        console.error(hint.originalException || hint.syntheticException);
      }
      return event;
    },
    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0
  });
}
