import { CookieConsentContextProvider, CookieBanner } from 'hds-react';
import { useEffect, useState } from 'react';

import useCookieConsentSettings from './hooks/useCookieConsentSettings';

const initializedInstances = new WeakSet<object>();

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    _paq: any[];
  }
}

function CookieConsent() {
  const cookieConsentSettings = useCookieConsentSettings();
  const [isReady, setIsReady] = useState(() =>
    !!window.hds?.cookieConsent && initializedInstances.has(window.hds.cookieConsent)
  );

  useEffect(() => {
    const handleReady = () => {
      if (window.hds?.cookieConsent) {
        initializedInstances.add(window.hds.cookieConsent);
      }
      setIsReady(true);
    };

    window.addEventListener('hds-cookie-consent-ready', handleReady);
    return () => window.removeEventListener('hds-cookie-consent-ready', handleReady);
  }, []);

  return (
    <CookieConsentContextProvider {...cookieConsentSettings}>
      {isReady && <CookieBanner />}
    </CookieConsentContextProvider>
  );
}

export default CookieConsent;
