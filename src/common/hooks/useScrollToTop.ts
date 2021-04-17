import useReactRouterNavigationSideEffect from "./useReactRouterNavigationSideEffect";

/**
 * Ensure that browser scrolls to top when navigating using
 * <Link> from react-router-dom.
 */
const useScrollToTop = () => {
  useReactRouterNavigationSideEffect(() => {
    window.scrollTo(0, 0);
  });
};

export default useScrollToTop;
