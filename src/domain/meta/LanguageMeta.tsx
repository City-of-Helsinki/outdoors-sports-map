import { Helmet } from "react-helmet-async";

import { getCanonicalUrl } from "./helpers";
import useLanguage from "../../common/hooks/useLanguage";
import * as PathUtils from "../../common/utils/pathUtils";
import { SUPPORTED_LANGUAGES } from "../i18n/i18nConstants";

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
  const language = useLanguage();
  const canonicalUrl = getCanonicalUrl();

  return (
    <Helmet>
      <link rel="canonical" href={canonicalUrl} />
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
      <meta
        property="og:locale"
        content={languageToLanguageAndLocale(language)}
      />
      <meta property="og:url" content={canonicalUrl} />
    </Helmet>
  );
}

export default LanguageMeta;
