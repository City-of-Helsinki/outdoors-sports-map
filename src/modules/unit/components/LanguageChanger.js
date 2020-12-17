// @flow
import React from 'react';
import PropTypes from 'prop-types';

import { SUPPORTED_LANGUAGES } from '../../language/constants';

const LanguageChanger = ({ changeLanguage, activeLanguage, isMobile }) => (
  <div className={isMobile ? 'language-changer__mobile' : 'language-changer'}>
    {Object.entries(SUPPORTED_LANGUAGES)
      .filter(([language]) => SUPPORTED_LANGUAGES[language] !== activeLanguage)
      .map(([languageKey, languageValue], index) => (
        <div key={languageKey} style={{ display: 'flex' }}>
          <a
            onClick={(e) => {
              e.preventDefault();
              changeLanguage(SUPPORTED_LANGUAGES[languageKey]);
            }}
            lang={languageValue}
            // Empty href makes the anchor focusable
            href
          >
            {languageKey}
          </a>
          {index < Object.keys(SUPPORTED_LANGUAGES).length - 2 && !isMobile
            ? <div style={{ marginLeft: 2, marginRight: 2 }}>|</div>
            : null}
        </div>
      ))}
  </div>
);

LanguageChanger.propTypes = {
  changeLanguage: PropTypes.func.isRequired,
  activeLanguage: PropTypes.string.isRequired,
  isMobile: PropTypes.bool,
};

LanguageChanger.defaultProps = {
  isMobile: false,
};

export default LanguageChanger;
