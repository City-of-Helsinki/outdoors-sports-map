import React from "react";
import Helmet from "react-helmet";
import { useTranslation } from "react-i18next";

import * as PathUtils from "../common/pathUtils";
import { SUPPORTED_LANGUAGES } from "../language/constants";
import { getCanonicalUrl } from "./helpers";

function addLanguageInUrl(urlString: string, language: string) {
  const url = new URL(urlString);

  if (!PathUtils.hasPathLanguage(url.pathname)) {
    return new URL(`/${language}${url.pathname}`, url).toString();
  }

  return new URL(
    PathUtils.replaceLanguageInPath(url.pathname, language),
    url
  ).toString();
}

function languageToLanguageAndLocale(language: string) {
  switch (language) {
    case "fi":
      return "fi_FI";
    case "sv":
      return "sv_SV";
    case "en":
      return "en_GB";
    default:
      throw Error("Unsupported language");
  }
}

function LanguageMeta() {
  const {
    i18n: {
      languages: [language],
    },
  } = useTranslation();
  const canonicalUrl = getCanonicalUrl();

  return (
    <Helmet>
      <meta
        property="og:locale"
        content={languageToLanguageAndLocale(language)}
      />
      <meta property="og:url" content={canonicalUrl} />
      {/* $FlowIgnore */}
      {Object.values(SUPPORTED_LANGUAGES).map((supportedLanguage: string) => (
        <link
          key={supportedLanguage}
          rel="alternate"
          hrefLang={supportedLanguage}
          href={addLanguageInUrl(canonicalUrl, supportedLanguage)}
        />
      ))}
      <link
        rel="alternate"
        hrefLang="x-default"
        href={PathUtils.removeLanguageFromUrl(canonicalUrl)}
      />
    </Helmet>
  );
}

export default LanguageMeta;
