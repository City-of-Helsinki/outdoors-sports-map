import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";

import useSearch from "../../common/hooks/useSearch";
import useIsUnitBrowserSearchView from "../app/useIsUnitBrowserSearchView";
import { Search } from "../search/searchConstants";
import { fetchServices } from "../service/actions";
import { fetchUnits } from "../unit/state/actions";
import { searchUnits } from "../unit/state/search/actions";

function useFetchInitialData() {
  const isFirstRender = useRef<Boolean>(true);
  const dispatch = useDispatch();
  const search = useSearch<Search>();
  const isUnitSearchOpen = useIsUnitBrowserSearchView();

  useEffect(() => {
    if (isFirstRender.current) {
      const { q, ...params } = search;
      if (isUnitSearchOpen && q) {
        dispatch(searchUnits(q, params));
      }

      // Fetch initial data
      dispatch(fetchUnits({}));
      dispatch(fetchServices({}));
    }
  }, [dispatch, isUnitSearchOpen, search]);

  useEffect(() => {
    isFirstRender.current = false;
  }, []);
}

export default useFetchInitialData;
