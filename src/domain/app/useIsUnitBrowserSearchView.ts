import { useRouteMatch } from "react-router";

import routerPaths from "../app/appRoutes";

function useIsUnitBrowserSearchView() {
  const match = useRouteMatch({
    path: routerPaths.unitBrowserSearch,
    exact: true,
  });

  return Boolean(match && match.isExact);
}

export default useIsUnitBrowserSearchView;
