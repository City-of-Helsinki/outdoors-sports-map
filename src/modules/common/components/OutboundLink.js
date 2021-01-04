import React from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';

import SMIcon from '../../home/components/SMIcon';

const OutboundLink = translate()(({ t, href, children, ...rest }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" {...rest}>
    {children}{' '}
    <SMIcon icon="outbound-link" title={t('OUTBOUND_LINK.DESCRIPTION')} />
  </a>
));

OutboundLink.propTypes = {
  href: PropTypes.string.isRequired,
  children: PropTypes.string.isRequired,
};

export default OutboundLink;
