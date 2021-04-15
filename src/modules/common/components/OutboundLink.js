// @flow

import React from 'react';
import { useTranslation } from 'react-i18next';

import SMIcon from '../../home/components/SMIcon';

type Props = {
  href: string,
  children: string,
};

const OutboundLink = ({ href, children, ...rest }: Props) => {
  const { t } = useTranslation();

  const name = t('OUTBOUND_LINK.DESCRIPTION');

  return (
    <a href={href} target="_blank" rel="noopener noreferrer" {...rest}>
      {children} <SMIcon icon="outbound-link" aria-label={name} title={name} />
    </a>
  );
};

export default OutboundLink;
