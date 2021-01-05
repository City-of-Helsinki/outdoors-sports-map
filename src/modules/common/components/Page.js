import React from 'react';
import PropTypes from 'prop-types';

export const MAIN_CONTENT_ID = 'main-content';

const Page = ({ children }) => (
  <main id={MAIN_CONTENT_ID} className="main-content">
    {children}
  </main>
);

Page.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Page;
