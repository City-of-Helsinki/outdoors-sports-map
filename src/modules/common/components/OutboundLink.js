import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

import SMIcon from '../../home/components/SMIcon';

const OutboundLink = ({ href, children, ...rest }) => {
  const { t } = useTranslation();

  const name = t('OUTBOUND_LINK.DESCRIPTION');

  return (
    <a href={href} target="_blank" rel="noopener noreferrer" {...rest}>
      {children} <SMIcon icon="outbound-link" aria-label={name} title={name} />
    </a>
  );
};

OutboundLink.propTypes = {
  href: PropTypes.string.isRequired,
  children: PropTypes.string.isRequired,
};

export default OutboundLink;
