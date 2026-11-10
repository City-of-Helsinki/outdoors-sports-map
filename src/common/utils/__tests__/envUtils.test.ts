import { afterEach, describe, expect, it, vi } from 'vitest';

import { getEnvValue } from '../envUtils';

describe('getEnvValue', () => {
  afterEach(() => {
    delete window._env_;
    vi.unstubAllEnvs();
  });

  it('prefers runtime values over build-time values', () => {
    vi.stubEnv('REACT_APP_API_URL', 'build-time');
    window._env_ = { REACT_APP_API_URL: 'runtime' };

    expect(getEnvValue('REACT_APP_API_URL')).toBe('runtime');
  });

  it('preserves empty runtime values', () => {
    vi.stubEnv('REACT_APP_API_URL', 'build-time');
    window._env_ = { REACT_APP_API_URL: '' };

    expect(getEnvValue('REACT_APP_API_URL')).toBe('');
  });

  it('normalizes primitive runtime values', () => {
    window._env_ = { ENABLED: false, RATE: 0.5 };

    expect(getEnvValue('ENABLED')).toBe('false');
    expect(getEnvValue('RATE')).toBe('0.5');
  });

  it('falls back when runtime values are missing or invalid', () => {
    vi.stubEnv('REACT_APP_API_URL', 'fallback');
    window._env_ = { REACT_APP_API_URL: null };

    expect(getEnvValue('REACT_APP_API_URL')).toBe('fallback');
    delete window._env_;
    expect(getEnvValue('REACT_APP_API_URL')).toBe('fallback');
  });

  it('returns undefined for missing values', () => {
    expect(getEnvValue('REACT_APP_MISSING_TEST_VALUE')).toBeUndefined();
  });

  it('reads process values without runtime configuration', () => {
    vi.stubEnv('REACT_APP_API_URL', 'process');

    expect(getEnvValue('REACT_APP_API_URL')).toBe('process');
  });
});