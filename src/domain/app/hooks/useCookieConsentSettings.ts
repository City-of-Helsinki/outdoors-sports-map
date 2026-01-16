import { CookieConsentChangeEvent, CookieConsentReactProps } from "hds-react";
import { useMemo, useState, useEffect, useCallback } from "react";

import useLocale from "./useLocale";
import { MAIN_CONTENT_ID } from "../../../common/a11y/Page";

export enum COOKIE_CONSENT_GROUP {
  Statistics = "statistics",
}

interface CookieConsentState {
  siteSettings: CookieConsentReactProps["siteSettings"] | null;
  isLoading: boolean;
}

const useCookieConsentSettings = (): CookieConsentReactProps | null => {
  const locale = useLocale();
  const [state, setState] = useState<CookieConsentState>({
    siteSettings: null,
    isLoading: true,
  });

  useEffect(() => {
    let isMounted = true;
    
    const loadSettings = async () => {
      const module = await import("./data/siteSettings.json");
      const settings = module.default as CookieConsentReactProps["siteSettings"];
        
      if (isMounted) {
        setState({
          siteSettings: settings,
          isLoading: false,
        });
      }
    };

    loadSettings();
    
    return () => {
      isMounted = false;
    };
  }, []);

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

  const cookieConsentProps: CookieConsentReactProps | null = useMemo(() => {
    if (state.isLoading || !state.siteSettings) {
      return null;
    }

    return {
      onChange: handleConsentChange,
      siteSettings: state.siteSettings,
      options: { focusTargetSelector: `#${MAIN_CONTENT_ID}`, language: locale },
    };
  }, [state.isLoading, state.siteSettings, handleConsentChange, locale]);

  return cookieConsentProps;
};

export default useCookieConsentSettings;
