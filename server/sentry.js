const Sentry = require("@sentry/node");
const Tracing = require("@sentry/tracing");

const publicKey = "37bf18f64b9947188e9778692147bbca";
const domain = "o1006021.ingest.sentry.io";
const projectId = "5966542";

function init(app) {
  if (process.env.NODE_ENV !== "production") return;

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
    tracesSampleRate: 0.2
  });
}

function beforeHandlers(app) {
  if (process.env.NODE_ENV !== "production") return;

  // RequestHandler creates a separate execution context using domains, so that every
  // transaction/span/breadcrumb is attached to its own Hub instance
  app.use(Sentry.Handlers.requestHandler());
  // TracingHandler creates a trace for every incoming request
  app.use(Sentry.Handlers.tracingHandler());
}

function afterHandlers(app) {
  if (process.env.NODE_ENV !== "production") return;

  // The error handler must be before any other error middleware and after all controllers
  app.use(Sentry.Handlers.errorHandler());
}

module.exports = {
  init,
  beforeHandlers,
  afterHandlers
};
