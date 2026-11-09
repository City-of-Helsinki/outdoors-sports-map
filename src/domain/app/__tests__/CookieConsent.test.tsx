import { render, screen, waitFor } from '@testing-library/react';
import { act } from '@testing-library/react';
import { StrictMode } from 'react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import CookieConsent from '../CookieConsent';
import useCookieConsentSettings from '../hooks/useCookieConsentSettings';
import siteSettings from '../hooks/data/siteSettings.json';

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
  CookieBanner: vi.fn(() => <div data-testid="cookie-banner">Cookie Banner</div>)
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
  const result = render(<CookieConsent />);
  act(() => window.dispatchEvent(new Event('hds-cookie-consent-ready')));
  return result;
};

// Helper assertions
const expectBannerToBeVisible = () => {
  expect(screen.getByTestId('cookie-consent-provider')).toBeInTheDocument();
  expect(screen.getByTestId('cookie-banner')).toBeInTheDocument();
};

describe('CookieConsent', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the cookie banner when HDS is ready', () => {
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

  it('should handle multiple re-renders', () => {
    const { rerender } = renderWithSettings();
    mockUseCookieConsentSettings.mockClear();

    for (let i = 0; i < 5; i++) {
      act(() => rerender(<CookieConsent />));
    }

    expectBannerToBeVisible();
    expect(mockUseCookieConsentSettings).toHaveBeenCalledTimes(5);
  });

  it('initializes the real HDS banner when rerendered before settings are ready', async () => {
    const actualHds = await vi.importActual<typeof import('hds-react')>('hds-react');
    const mockedHds = await import('hds-react');
    vi.mocked(mockedHds.CookieConsentContextProvider).mockImplementation(actualHds.CookieConsentContextProvider);
    vi.mocked(mockedHds.CookieBanner).mockImplementation(actualHds.CookieBanner);
    mockUseCookieConsentSettings.mockReturnValue({ siteSettings, options: { language: 'en' } });

    const renderBanner = () => (
      <StrictMode>
        <CookieConsent />
      </StrictMode>
    );
    const { rerender } = render(renderBanner());
    rerender(renderBanner());

    await waitFor(() => {
      expect(document.querySelector('.hds-cc__target')?.shadowRoot?.textContent).toContain('Outdoor Exercise Map');
    });
  });
});
