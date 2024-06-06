import { IconAngleDown } from "hds-react";
import { useTranslation } from "react-i18next";
import { Link as RRLink, useLocation } from "react-router-dom";

import Link from "../../common/components/Link";
import useLanguage from "../../common/hooks/useLanguage";
import { replaceLanguageInPath } from "../../common/utils/pathUtils";
import FlagFinland24pxFlat from "../assets/icons/flag-finland-24-flat.png";
import FlagSweden24pxFlat from "../assets/icons/flag-sweden-24-flat.png";
import FlagUnitedKingdom24pxFlat from "../assets/icons/flag-united-kingdom-24-flat.png";
import { SUPPORTED_LANGUAGES } from "../i18n/i18nConstants";

type SupportedLanguageValues = typeof SUPPORTED_LANGUAGES[keyof typeof SUPPORTED_LANGUAGES];
const countryFlags: {
  [key in SupportedLanguageValues]: string;
} = {
  fi: FlagFinland24pxFlat,
  sv: FlagSweden24pxFlat,
  en: FlagUnitedKingdom24pxFlat,
};

type ApplicationHeaderProps = {
  toggleExpand: () => void;
  isExpanded: boolean;
};

function ApplicationHeader({toggleExpand, isExpanded}: ApplicationHeaderProps) {
  const { t } = useTranslation();
  const currentLanguage = useLanguage();

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
          <IconAngleDown onClick={toggleExpand} className={ isExpanded ? "home-container-icon-expanded" : "home-container-icon"} />
      </div>
    </header>
  );
}

export default ApplicationHeader;
