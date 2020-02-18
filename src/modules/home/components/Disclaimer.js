import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';

import OutboundLink from '../../common/components/OutboundLink';

const Disclaimer = ({ attributionLink }) => {
  const { t } = useTranslation();

  return (
    <div className="disclaimer">
      <div className="disclaimer__content">
        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
        <Link to="#">{t('APP.ABOUT')}</Link>
        <OutboundLink href={attributionLink}>
          {t('MAP.ATTRIBUTION')}{' '}
        </OutboundLink>
      </div>
    </div>
  );
};

Disclaimer.propTypes = {
  attributionLink: PropTypes.string.isRequired,
};

export default Disclaimer;
