import { CookieConsentContextProvider, CookieBanner } from 'hds-react';

import useCookieConsentSettings from './hooks/useCookieConsentSettings';

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    _paq: any[];
  }
}

function CookieConsent() {
  const cookieConsentSettings = useCookieConsentSettings(); 
  // Don't render until we're on the client side and settings are loaded
  if (!cookieConsentSettings) {
    return null;
  }

  return (
    <CookieConsentContextProvider {...cookieConsentSettings}>
      <CookieBanner />
    </CookieConsentContextProvider>
  );
}

export default CookieConsent;
