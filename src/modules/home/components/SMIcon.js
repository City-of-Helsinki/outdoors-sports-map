import React from 'react';

// eslint-disable-next-line react/jsx-props-no-spreading, react/prop-types
const SMIcon = ({ icon, className, ...rest }) => <span className={`icon-icon-${icon} ${className || ''}`} {...rest} />;

export default SMIcon;
