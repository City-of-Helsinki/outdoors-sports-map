import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";

import useSearch from "../../common/hooks/useSearch";
import { AppSearch } from "../app/appConstants";
import useIsUnitBrowserSearchView from "../app/useIsUnitBrowserSearchView";
import { useGetServicesQuery } from "../service/serviceSlice";
import { searchUnits } from "../unit/state/search/actions";
import { useGetUnitsQuery } from "../unit/unitSlice";

function useFetchInitialData() {
  const isFirstRender = useRef<Boolean>(true);
  const dispatch = useDispatch();
  const search = useSearch<AppSearch>();
  const isUnitSearchOpen = useIsUnitBrowserSearchView();
  
  // Fetch services and units using RTK Query
  useGetServicesQuery();
  useGetUnitsQuery({});

  useEffect(() => {
    if (isFirstRender.current) {
      const { q, ...params } = search;
      if (isUnitSearchOpen && q) {
        dispatch(searchUnits(q, params));
      }
    }
  }, [dispatch, isUnitSearchOpen, search]);

  useEffect(() => {
    isFirstRender.current = false;
  }, []);
}

export default useFetchInitialData;
