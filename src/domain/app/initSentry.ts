import * as Sentry from "@sentry/react";

// Enables Sentry only when a DSN is configured; disabled by default in all environments.
export default function initSentry(): void {
  if (!import.meta.env.REACT_APP_SENTRY_DSN) {
    return;
  }

  Sentry.init({
    dsn: import.meta.env.REACT_APP_SENTRY_DSN,
    environment: import.meta.env.REACT_APP_SENTRY_ENVIRONMENT,
    release: import.meta.env.REACT_APP_SENTRY_RELEASE,
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.browserProfilingIntegration(),
      Sentry.replayIntegration(),
    ],
    tracesSampleRate: Number.parseFloat(
      import.meta.env.REACT_APP_SENTRY_TRACES_SAMPLE_RATE || '0'
    ),
    tracePropagationTargets: (
      import.meta.env.REACT_APP_SENTRY_TRACE_PROPAGATION_TARGETS || ''
    ).split(','),
    profileSessionSampleRate: Number.parseFloat(
      import.meta.env.REACT_APP_SENTRY_PROFILE_SESSION_SAMPLE_RATE || '0'
    ),
    profileLifecycle: "trace",
    // Org policy: Session Replay stays disabled (sample rates default to 0)
    replaysSessionSampleRate: Number.parseFloat(
      import.meta.env.REACT_APP_SENTRY_REPLAYS_SESSION_SAMPLE_RATE || '0'
    ),
    replaysOnErrorSampleRate: Number.parseFloat(
      import.meta.env.REACT_APP_SENTRY_REPLAYS_ON_ERROR_SAMPLE_RATE || '0'
    ),
  });
}
