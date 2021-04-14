// @flow
import React from 'react';
import { useTranslation } from 'react-i18next';
// $FlowIgnore
import { useLocation, Link } from 'react-router-dom';

import { replaceLanguageInPath } from '../../common/helpers';
import { SUPPORTED_LANGUAGES } from '../../language/constants';

type Props = {
  isMobile?: boolean,
};

const LanguageChanger = ({ isMobile = false }: Props) => {
  const {
    i18n: {
      languages: [activeLanguage],
    },
  } = useTranslation();
  const { pathname } = useLocation();

  return (
    <div className={isMobile ? 'language-changer__mobile' : 'language-changer'}>
      {Object.entries(SUPPORTED_LANGUAGES)
        .filter(
          ([language]) => SUPPORTED_LANGUAGES[language] !== activeLanguage
        )
        .map(([languageKey, languageValue], index) => (
          <div key={languageKey} style={{ display: 'flex' }}>
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
            <Link
              lang={languageValue}
              // $FlowIgnore
              to={replaceLanguageInPath(pathname, languageValue)}
            >
              {languageKey}
            </Link>
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
