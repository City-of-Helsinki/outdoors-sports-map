// @flow

// $FlowIgnore
import React, { useRef } from 'react';

import useReactRouterNavigationSideEffect from '../hooks/useReactRouterNavigationSideEffect';

/**
 * Ensure that browser focus is set to body when navigating using
 * <Link> from react-router-dom.
 */
const ResetFocus = () => {
  const elementRef = useRef(null);

  useReactRouterNavigationSideEffect(() => {
    const element = elementRef.current;

    if (element) {
      element.focus();
    }
  });

  return <div ref={elementRef} tabIndex={-1} />;
};

export default ResetFocus;
