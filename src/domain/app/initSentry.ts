import * as Sentry from "@sentry/react";

import { getEnvValue } from '../../common/utils/envUtils';

// Enables Sentry only when a DSN is configured; disabled by default in all environments.
export default function initSentry(): void {
  const dsn = getEnvValue('REACT_APP_SENTRY_DSN');
  if (!dsn) {
    return;
  }

  Sentry.init({
    dsn,
    environment: getEnvValue('REACT_APP_SENTRY_ENVIRONMENT'),
    release: getEnvValue('REACT_APP_SENTRY_RELEASE'),
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.browserProfilingIntegration(),
      Sentry.replayIntegration(),
    ],
    tracesSampleRate: Number.parseFloat(
      getEnvValue('REACT_APP_SENTRY_TRACES_SAMPLE_RATE') || '0'
    ),
    tracePropagationTargets: (
      getEnvValue('REACT_APP_SENTRY_TRACE_PROPAGATION_TARGETS') || ''
    )
      .split(',')
      .map((target) => target.trim())
      .filter(Boolean),
    profileSessionSampleRate: Number.parseFloat(
      getEnvValue('REACT_APP_SENTRY_PROFILE_SESSION_SAMPLE_RATE') || '0'
    ),
    profileLifecycle: "trace",
    replaysSessionSampleRate: Number.parseFloat(
      getEnvValue('REACT_APP_SENTRY_REPLAYS_SESSION_SAMPLE_RATE') || '0'
    ),
    replaysOnErrorSampleRate: Number.parseFloat(
      getEnvValue('REACT_APP_SENTRY_REPLAYS_ON_ERROR_SAMPLE_RATE') || '0'
    ),
  });
}
