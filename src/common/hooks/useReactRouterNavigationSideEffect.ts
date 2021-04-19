import { useEffect } from "react";
import { useHistory, useLocation } from "react-router";

/**
 * Call callback when navigating with react-router's <Link />
 *
 * Implementation inspired by
 * https://reacttraining.com/react-router/web/guides/scroll-restoration
 */
const useReactRouterNavigationSideEffect = (callback: () => void) => {
  const { pathname } = useLocation();
  const { action } = useHistory();

  useEffect(() => {
    if (action === "PUSH") {
      callback();
    }
  }, [action, pathname, callback]);
};

export default useReactRouterNavigationSideEffect;
