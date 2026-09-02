import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as Sentry from '@sentry/react';
import initSentry from '../initSentry';

vi.mock('@sentry/react', () => ({
  init: vi.fn(),
  browserTracingIntegration: vi.fn(() => 'browserTracingIntegration'),
  browserProfilingIntegration: vi.fn(() => 'browserProfilingIntegration'),
  replayIntegration: vi.fn(() => 'replayIntegration'),
}));

describe('initSentry', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('does not initialize Sentry when no DSN is configured', () => {
    vi.stubEnv('REACT_APP_SENTRY_DSN', '');

    initSentry();

    expect(Sentry.init).not.toHaveBeenCalled();
  });

  it('initializes Sentry with the configured DSN, environment and release', () => {
    vi.stubEnv('REACT_APP_SENTRY_DSN', 'https://example@sentry.io/1');
    vi.stubEnv('REACT_APP_SENTRY_ENVIRONMENT', 'staging');
    vi.stubEnv('REACT_APP_SENTRY_RELEASE', '1.2.3');

    initSentry();

    expect(Sentry.init).toHaveBeenCalledWith(
      expect.objectContaining({
        dsn: 'https://example@sentry.io/1',
        environment: 'staging',
        release: '1.2.3',
      })
    );
  });

  it('wires up browser tracing, profiling and replay integrations', () => {
    vi.stubEnv('REACT_APP_SENTRY_DSN', 'https://example@sentry.io/1');

    initSentry();

    expect(Sentry.browserTracingIntegration).toHaveBeenCalled();
    expect(Sentry.browserProfilingIntegration).toHaveBeenCalled();
    expect(Sentry.replayIntegration).toHaveBeenCalled();
    expect(Sentry.init).toHaveBeenCalledWith(
      expect.objectContaining({
        integrations: ['browserTracingIntegration', 'browserProfilingIntegration', 'replayIntegration'],
        profileLifecycle: 'trace',
      })
    );
  });

  it('forces Session Replay sample rates to 0 by default per org policy', () => {
    vi.stubEnv('REACT_APP_SENTRY_DSN', 'https://example@sentry.io/1');
    vi.stubEnv('REACT_APP_SENTRY_REPLAYS_SESSION_SAMPLE_RATE', '');
    vi.stubEnv('REACT_APP_SENTRY_REPLAYS_ON_ERROR_SAMPLE_RATE', '');

    initSentry();

    expect(Sentry.init).toHaveBeenCalledWith(
      expect.objectContaining({
        replaysSessionSampleRate: 0,
        replaysOnErrorSampleRate: 0,
      })
    );
  });

  it('defaults sample rates to 0 and trace propagation targets to an empty array entry when unset', () => {
    vi.stubEnv('REACT_APP_SENTRY_DSN', 'https://example@sentry.io/1');
    vi.stubEnv('REACT_APP_SENTRY_TRACES_SAMPLE_RATE', '');
    vi.stubEnv('REACT_APP_SENTRY_PROFILE_SESSION_SAMPLE_RATE', '');
    vi.stubEnv('REACT_APP_SENTRY_TRACE_PROPAGATION_TARGETS', '');

    initSentry();

    expect(Sentry.init).toHaveBeenCalledWith(
      expect.objectContaining({
        tracesSampleRate: 0,
        profileSessionSampleRate: 0,
        tracePropagationTargets: [''],
      })
    );
  });

  it('parses configured sample rates and trace propagation targets', () => {
    vi.stubEnv('REACT_APP_SENTRY_DSN', 'https://example@sentry.io/1');
    vi.stubEnv('REACT_APP_SENTRY_TRACES_SAMPLE_RATE', '0.5');
    vi.stubEnv('REACT_APP_SENTRY_PROFILE_SESSION_SAMPLE_RATE', '1');
    vi.stubEnv('REACT_APP_SENTRY_TRACE_PROPAGATION_TARGETS', 'api.hel.fi,localhost');

    initSentry();

    expect(Sentry.init).toHaveBeenCalledWith(
      expect.objectContaining({
        tracesSampleRate: 0.5,
        profileSessionSampleRate: 1,
        tracePropagationTargets: ['api.hel.fi', 'localhost'],
      })
    );
  });
});
