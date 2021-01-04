import React from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';

const OutboundLink = translate()(({ t, href, children, ...rest }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="outbound-link"
    {...rest}
  >
    {children}{' '}
    <span className="outbound-link__outbound_warning">
      {t('OUTBOUND_LINK.DESCRIPTION')}
    </span>
  </a>
));

OutboundLink.propTypes = {
  href: PropTypes.string.isRequired,
  children: PropTypes.string.isRequired,
};

export default OutboundLink;
