// Import with `import * as Sentry from "@sentry/node"` if you are using ESM
import * as Sentry from "@sentry/node"
import {nodeProfilingIntegration} from "@sentry/profiling-node";

Sentry.init({
  dsn: "https://da1e614814d1c9aedb3b1542fab03eed@o4509151709364224.ingest.us.sentry.io/4509152270745600",
  integrations: [
    nodeProfilingIntegration(),
    Sentry.mongooseIntegration()  
  ],
  // tracesSampleRate: 1.0,
  
});

Sentry.profiler.startProfiler();

Sentry.startSpan({
    name: "My First Transaction",
}, () => {

});

Sentry.profiler.stopProfiler();


