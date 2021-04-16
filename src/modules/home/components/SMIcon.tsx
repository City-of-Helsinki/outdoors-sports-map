import React from "react";

// eslint-disable-next-line react/jsx-props-no-spreading, react/prop-types
function SMIcon({ icon, className, ...rest }) {
  return <span className={`icon-icon-${icon} ${className || ""}`} {...rest} />
}

export default SMIcon;
