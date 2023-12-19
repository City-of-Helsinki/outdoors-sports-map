import { CookieModal, ContentSource } from 'hds-react';
import React from 'react';
import { useTranslation } from "react-i18next";

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
      if (!consents.matomo) {
        // stop matomo tracking
      }
    },
  };

  return (
    <>
      <CookieModal contentSource={contentSource} />
    </>
  );
}

export default CookieConsent;
