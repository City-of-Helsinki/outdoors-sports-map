// @flow
import React from 'react';
import { useTranslation } from 'react-i18next';

import { SUPPORTED_LANGUAGES } from '../../language/constants';

type Props = {
  isMobile?: boolean,
};

const LanguageChanger = ({ isMobile = false }: Props) => {
  const {
    i18n,
    i18n: {
      languages: [activeLanguage],
    },
  } = useTranslation();

  return (
    <div className={isMobile ? 'language-changer__mobile' : 'language-changer'}>
      {Object.entries(SUPPORTED_LANGUAGES)
        .filter(
          ([language]) => SUPPORTED_LANGUAGES[language] !== activeLanguage
        )
        .map(([languageKey, languageValue], index) => (
          <div key={languageKey} style={{ display: 'flex' }}>
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
            <a
              onClick={(e) => {
                e.preventDefault();
                i18n.changeLanguage(SUPPORTED_LANGUAGES[languageKey]);
              }}
              lang={languageValue}
              // Empty href makes the anchor focusable
              href=""
            >
              {languageKey}
            </a>
            {index < Object.keys(SUPPORTED_LANGUAGES).length - 2 &&
            !isMobile ? (
              <div style={{ marginLeft: 2, marginRight: 2 }}>|</div>
            ) : null}
          </div>
        ))}
    </div>
  );
};

export default LanguageChanger;
