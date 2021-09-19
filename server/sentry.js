const Sentry = require("@sentry/node");
const Tracing = require("@sentry/tracing");

const publicKey = "37bf18f64b9947188e9778692147bbca";
const domain = "o1006021.ingest.sentry.io";
const projectId = "5966542";

module.exports = app => {
  Sentry.init({
    dsn: `https://${publicKey}@${domain}/${projectId}`,
    integrations: [
      // enable HTTP calls tracing
      new Sentry.Integrations.Http({ tracing: true }),
      // enable Express.js middleware tracing
      new Tracing.Integrations.Express({ app })
    ],

    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0
  });

  // RequestHandler creates a separate execution context using domains, so that every
  // transaction/span/breadcrumb is attached to its own Hub instance
  app.use(Sentry.Handlers.requestHandler());
  // TracingHandler creates a trace for every incoming request
  app.use(Sentry.Handlers.tracingHandler());
};
