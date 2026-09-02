/// <reference types="vite/client" />
/// <reference types="vitest/globals" />
/// <reference types="@testing-library/jest-dom" />

interface ImportMetaEnv {
  readonly REACT_APP_API_URL: string
  readonly REACT_APP_MAP_URL_TEMPLATE: string
  readonly REACT_APP_DIGITRANSIT_API_URL: string
  readonly REACT_APP_DIGITRANSIT_API_KEY: string
  readonly REACT_APP_APP_NAME: string
  // Set to 'true' to disable season-based unit filtering (shows all seasons at once)
  readonly REACT_APP_BYPASS_SEASON_FILTER?: string
  // Leaving this empty disables Sentry entirely
  readonly REACT_APP_SENTRY_DSN?: string
  // One of: review, development, testing, staging, production, local
  readonly REACT_APP_SENTRY_ENVIRONMENT?: string
  readonly REACT_APP_SENTRY_RELEASE?: string
  readonly REACT_APP_SENTRY_TRACES_SAMPLE_RATE?: string
  readonly REACT_APP_SENTRY_TRACE_PROPAGATION_TARGETS?: string
  readonly REACT_APP_SENTRY_PROFILE_SESSION_SAMPLE_RATE?: string
  // Org policy: keep these at 0 unless the Session Replay policy is revised
  readonly REACT_APP_SENTRY_REPLAYS_SESSION_SAMPLE_RATE?: string
  readonly REACT_APP_SENTRY_REPLAYS_ON_ERROR_SAMPLE_RATE?: string
  // Add other REACT_APP_ variables as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}