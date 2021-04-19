import { useRef } from "react";

import useReactRouterNavigationSideEffect from "../hooks/useReactRouterNavigationSideEffect";

/**
 * Ensure that browser focus is set to body when navigating using
 * <Link> from react-router-dom.
 */
function ResetFocus() {
  const elementRef = useRef<HTMLDivElement | null>(null);

  useReactRouterNavigationSideEffect(() => {
    const element = elementRef.current;

    if (element) {
      element.focus();
    }
  });

  return <div ref={elementRef} tabIndex={-1} />;
}

export default ResetFocus;
