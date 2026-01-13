import { useEffect, useRef } from "react";

import useSearch from "../../common/hooks/useSearch";
import { AppSearch } from "../app/appConstants";
import useIsUnitBrowserSearchView from "../app/useIsUnitBrowserSearchView";
import { useGetServicesQuery } from "../service/serviceSlice";
import { useLazySearchUnitsQuery } from "../unit/state/search/searchSlice";
import { useGetUnitsQuery } from "../unit/unitSlice";

function useFetchInitialData() {
  const isFirstRender = useRef<Boolean>(true);
  const search = useSearch<AppSearch>();
  const isUnitSearchOpen = useIsUnitBrowserSearchView();
  const [triggerSearchUnits] = useLazySearchUnitsQuery();
  
  // Fetch services and units using RTK Query
  useGetServicesQuery();
  useGetUnitsQuery({});

  useEffect(() => {
    if (isFirstRender.current) {
      const { q, ...params } = search;
      if (isUnitSearchOpen && q) {
        triggerSearchUnits({ input: q, params });
      }
    }
  }, [triggerSearchUnits, isUnitSearchOpen, search]);

  useEffect(() => {
    isFirstRender.current = false;
  }, []);
}

export default useFetchInitialData;
