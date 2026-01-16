import { render, screen } from '@testing-library/react';
import { act } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import CookieConsent from '../CookieConsent';
import useCookieConsentSettings from '../hooks/useCookieConsentSettings';

// Mock the hook
vi.mock('../hooks/useCookieConsentSettings');
const mockUseCookieConsentSettings = useCookieConsentSettings as ReturnType<typeof vi.mocked<typeof useCookieConsentSettings>>;

// Mock HDS React components
vi.mock('hds-react', () => ({
  CookieConsentContextProvider: vi.fn(({ children, ...props }: any) => (
    <div data-testid="cookie-consent-provider" data-props={JSON.stringify(Object.keys(props))}>
      {children}
    </div>
  )),
  CookieBanner: () => <div data-testid="cookie-banner">Cookie Banner</div>
}));

// Helper function to create mock settings
const createMockSettings = (overrides = {}) => ({
  siteSettings: {
    languages: [{ code: 'en', name: 'English', direction: 'ltr' }],
    siteName: { en: 'Test Site' },
    cookieName: 'test-consents',
    requiredGroups: []
  },
  options: {
    focusTargetSelector: '#main-content',
    language: 'en'
  },
  onChange: vi.fn(),
  ...overrides
});

// Helper function to render with settings
const renderWithSettings = (settings = createMockSettings()) => {
  mockUseCookieConsentSettings.mockReturnValue(settings);
  return render(<CookieConsent />);
};

// Helper assertions
const expectBannerToBeVisible = () => {
  expect(screen.getByTestId('cookie-consent-provider')).toBeInTheDocument();
  expect(screen.getByTestId('cookie-banner')).toBeInTheDocument();
};

const expectBannerToBeHidden = () => {
  expect(screen.queryByTestId('cookie-banner')).not.toBeInTheDocument();
};

describe('CookieConsent', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render null when cookie consent settings are not loaded', () => {
    mockUseCookieConsentSettings.mockReturnValue(null);
    const { container } = render(<CookieConsent />);
    expect(container.firstChild).toBeNull();
  });

  it('should render components when settings are loaded', () => {
    renderWithSettings();
    expectBannerToBeVisible();
    expect(screen.getByText('Cookie Banner')).toBeInTheDocument();
  });

  it('should render with custom settings', () => {
    renderWithSettings(createMockSettings({
      siteSettings: {
        languages: [{ code: 'fi', name: 'Finnish', direction: 'ltr' }],
        siteName: { fi: 'Testisivusto' },
        cookieName: 'fi-consents',
        requiredGroups: [{ groupId: 'required', title: { fi: 'Pakolliset' } }]
      },
      options: { focusTargetSelector: '#main-content', language: 'fi' }
    }));
    expectBannerToBeVisible();
  });

  it('should handle settings state transitions', () => {
    // Null -> Loaded
    mockUseCookieConsentSettings.mockReturnValue(null);
    const { rerender } = render(<CookieConsent />);
    expectBannerToBeHidden();

    // Update mock to return settings and rerender
    mockUseCookieConsentSettings.mockReturnValue(createMockSettings());
    rerender(<CookieConsent />);
    expectBannerToBeVisible();

    // Loaded -> Null
    mockUseCookieConsentSettings.mockReturnValue(null);
    expect(() => rerender(<CookieConsent />)).not.toThrow();
    expectBannerToBeHidden();
  });

  it('should handle multiple re-renders', () => {
    const { rerender } = renderWithSettings();

    for (let i = 0; i < 5; i++) {
      act(() => rerender(<CookieConsent />));
    }

    expectBannerToBeVisible();
    expect(mockUseCookieConsentSettings).toHaveBeenCalledTimes(6);
  });
});
