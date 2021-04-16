/* eslint-disable react/prop-types */
import React from "react";

export function View({ id, isSelected, className, children }) {
  return <div
    id={id}
    className={`view ${isSelected ? "view--selected" : ""} ${className}`}
  >
    {children}
  </div>
}

export default View;
