import { renderHook } from '@testing-library/react';
import { act } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import useCookieConsentSettings, { COOKIE_CONSENT_GROUP } from '../useCookieConsentSettings';

// Mock useLocale hook
vi.mock('../useLocale', () => ({
  default: () => 'en',
}));

// Mock window._paq
const mockPaq = {
  push: vi.fn()
};

Object.defineProperty(window, '_paq', {
  value: mockPaq,
  writable: true,
  configurable: true
});

describe('useCookieConsentSettings', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockPaq.push.mockClear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return cookie consent settings immediately', () => {
    const { result } = renderHook(() => useCookieConsentSettings());
    expect(result.current).not.toBeNull();

    // Test structure without specific values since we're using real data
    expect(result.current).toMatchObject({
      siteSettings: expect.objectContaining({
        languages: expect.arrayContaining([
          expect.objectContaining({ code: expect.any(String), name: expect.any(String) })
        ]),
        siteName: expect.any(Object),
        cookieName: expect.any(String),
        requiredGroups: expect.any(Array)
      }),
      options: expect.objectContaining({
        focusTargetSelector: '#main-content',
        language: 'en'
      })
    });

    expect(typeof result.current?.onChange).toBe('function');
  });

  it('should handle statistics consent acceptance', () => {
    const { result } = renderHook(() => useCookieConsentSettings());

    const changeEvent = {
      acceptedGroups: [COOKIE_CONSENT_GROUP.Statistics],
      consentGiven: true
    };

    act(() => {
      result.current?.onChange(changeEvent);
    });

    expect(mockPaq.push).toHaveBeenCalledWith(['trackPageView']);
    expect(mockPaq.push).toHaveBeenCalledWith(['enableLinkTracking']);
  });

  it('should handle statistics consent rejection', () => {
    const { result } = renderHook(() => useCookieConsentSettings());

    const changeEvent = {
      acceptedGroups: [],
      consentGiven: true
    };

    act(() => {
      result.current?.onChange(changeEvent);
    });

    expect(mockPaq.push).toHaveBeenCalledWith(['forgetConsentGiven']);
  });

  it('should handle missing window._paq gracefully', () => {
    // Temporarily remove _paq
    const originalPaq = window._paq;
    delete (window as any)._paq;

    const { result } = renderHook(() => useCookieConsentSettings());

    const changeEvent = {
      acceptedGroups: [COOKIE_CONSENT_GROUP.Statistics],
      consentGiven: true
    };

    // Should not throw
    expect(() => {
      act(() => {
        result.current?.onChange(changeEvent);
      });
    }).not.toThrow();

    // Restore _paq
    window._paq = originalPaq;
  });

  it('should cleanup properly on unmount', () => {
    const { unmount } = renderHook(() => useCookieConsentSettings());
    
    // Should not throw on unmount
    expect(() => unmount()).not.toThrow();
  });
});