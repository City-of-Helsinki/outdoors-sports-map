import { CookieConsentChangeEvent, CookieConsentReactProps } from "hds-react";
import { useMemo, useCallback } from "react";

import siteSettings from "./data/siteSettings.json";
import useLocale from "./useLocale";
import { MAIN_CONTENT_ID } from "../../../common/a11y/Page";

export enum COOKIE_CONSENT_GROUP {
  Statistics = "statistics",
}

const useCookieConsentSettings = (): CookieConsentReactProps => {
  const locale = useLocale();

  const handleConsentChange = useCallback((changeEvent: CookieConsentChangeEvent) => {
    const { acceptedGroups } = changeEvent;

    const hasStatisticsConsent =
      acceptedGroups.indexOf(COOKIE_CONSENT_GROUP.Statistics) > -1;

    if (hasStatisticsConsent) {
      //  start tracking
      if (window._paq) {
        window._paq.push(["trackPageView"]);
        window._paq.push(["enableLinkTracking"]);
      }
    } else {
      // tell matomo to forget consent
      if (window._paq) {
        window._paq.push(["forgetConsentGiven"]);
      }
    }
  }, []);

  const cookieConsentProps = useMemo(() => {
    return {
      onChange: handleConsentChange,
      siteSettings: siteSettings as CookieConsentReactProps["siteSettings"],
      options: { focusTargetSelector: `#${MAIN_CONTENT_ID}`, language: locale },
    };
  }, [handleConsentChange, locale]);

  return cookieConsentProps;
};

export default useCookieConsentSettings;
