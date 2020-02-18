import React from 'react';
import { Link } from 'react-router';
import { withNamespaces } from 'react-i18next';

import OutboundLink from '../../common/components/OutboundLink';

export default withNamespaces()(({ attributionLink, t }) => (
  <div className="disclaimer">
    <div className="disclaimer__content">
      {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
      <Link to="#">{t('APP.ABOUT')}</Link>
      <OutboundLink href={attributionLink}>
        {t('MAP.ATTRIBUTION')}{' '}
      </OutboundLink>
    </div>
  </div>
));
