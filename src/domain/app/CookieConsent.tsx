import { CookieConsentContextProvider, CookieBanner } from 'hds-react';

import useCookieConsentSettings from './hooks/useCookieConsentSettings';

declare global {
  interface Window {
    _paq: any[];
  }
}

function CookieConsent() {
  const cookieConsentSettings =  useCookieConsentSettings(); 

  return (
    <CookieConsentContextProvider {...cookieConsentSettings}>
      <CookieBanner />
    </CookieConsentContextProvider>
  );
}

export default CookieConsent;
