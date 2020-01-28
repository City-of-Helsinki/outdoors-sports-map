/* eslint-disable react/prop-types */

import React from 'react';

export const View = ({
  id, isSelected, className, children,
}) => (
  <div id={id} className={`view ${isSelected ? 'view--selected' : ''} ${className}`}>
    {children}
  </div>
);

export default View;
