import React from "react";
import { useTranslation } from "react-i18next";
// @ts-ignore
import { Link as RRLink, useLocation } from "react-router-dom";

import FlagFinland24pxFlat from "../../../assets/icons/flag-finland-24-flat.png";
import FlagSweden24pxFlat from "../../../assets/icons/flag-sweden-24-flat.png";
import FlagUnitedKingdom24pxFlat from "../../../assets/icons/flag-united-kingdom-24-flat.png";
import { SUPPORTED_LANGUAGES } from "../../language/constants";
import { replaceLanguageInPath } from "../pathUtils";
import Link from "./Link";

const countryFlags = {
  fi: FlagFinland24pxFlat,
  sv: FlagSweden24pxFlat,
  en: FlagUnitedKingdom24pxFlat,
};

function ApplicationHeader() {
  const {
    t,
    i18n: {
      languages: [currentLanguage],
    },
  } = useTranslation();

  const { pathname } = useLocation();

  return (
    <header className="application-header">
      <h1 className="application-header__title">
        <Link to="/">{t("APP.NAME")}</Link>
      </h1>
      <div className="application-header__language-selector">
        {Object.entries(SUPPORTED_LANGUAGES)
          .filter(([, language]) => language !== currentLanguage)
          .map((
            [languageKey, languageValue] // Use Link that does not try to infer language
          ) => (
            <RRLink
              className="application-header__language-selector__link"
              key={languageKey}
              lang={languageValue}
              to={replaceLanguageInPath(pathname, languageValue)}
            >
              <img
                className="application-header__language-selector__flag"
                src={countryFlags[languageValue]}
                alt={languageKey}
              />
            </RRLink>
          ))}
      </div>
    </header>
  );
}

export default ApplicationHeader;
