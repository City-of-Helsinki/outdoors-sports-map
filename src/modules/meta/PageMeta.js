// @flow
import React from 'react';
import Helmet from 'react-helmet';

type Props = {
  title: string,
  description?: string,
};

const PageMeta = ({ title, description }: Props) => (
  <Helmet>
    {/* HTML page level meta */}
    <title>{title}</title>
    <meta name="description" content={description} />

    {/* OpenGraph page level meta */}
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
  </Helmet>
);

export default PageMeta;
