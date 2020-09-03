import React from 'react';

// eslint-disable-next-line react/jsx-props-no-spreading, react/prop-types
const OSMIcon = ({ icon, className, ...rest }) => <span className={`icon-${icon} ${className || ''}`} {...rest} />;

export default OSMIcon;
