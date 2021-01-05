import React from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';

import { MAIN_CONTENT_ID } from './Page';

const JumpLink = ({ t }) => (
  <a href={`#${MAIN_CONTENT_ID}`} className="jump-link">
    {t('JUMP_LINK.LABEL')}
  </a>
);

JumpLink.propTypes = {
  t: PropTypes.func.isRequired,
};

export default translate()(JumpLink);
