import { CookieModal, ContentSource } from 'hds-react';
import React from 'react';
import { useTranslation } from "react-i18next";

declare global {
  interface Window {
    _paq: any[];
  }
}

function CookieConsent() {
  const { t, i18n } = useTranslation();

  const contentSource: ContentSource = {
    siteName: t("APP.NAME"),
    currentLanguage:  i18n.language as 'fi' | 'sv' | 'en',
    optionalCookies: {
      cookies: [
        {
          commonGroup: 'statistics',
          commonCookie: 'matomo',
        },
      ],
    },
    focusTargetSelector: '#main-content',
    onAllConsentsGiven: function (consents) {
      if (consents.matomo) {
        // Start Matomo tracking if consent is given
        window._paq.push(['trackPageView']);
        window._paq.push(["enableLinkTracking"]);
      }
    },
  };

  return (
      <CookieModal contentSource={contentSource} />
  );
}

export default CookieConsent;
