import { useEffect, useRef, useMemo } from "react";

import useSearch from "../../common/hooks/useSearch";
import { AppSearch } from "../app/types";
import useAppSearch from "../app/useAppSearch";
import useIsUnitBrowserSearchView from "../app/useIsUnitBrowserSearchView";
import { getServicesForSport, getOnSeasonServices } from "../service/serviceHelpers";
import { useGetServicesQuery } from "../service/state/serviceSlice";
import { useLazySearchUnitsQuery } from "../unit/state/searchSlice";
import { useGetUnitsQuery, useGetAllSeasonalUnitsQuery } from "../unit/state/unitSlice";
import { UnitFilters } from "../unit/unitConstants";

function useFetchInitialData() {
  const isFirstRender = useRef<boolean>(true);
  const search = useSearch<AppSearch>();
  const { sport } = useAppSearch();
  const isUnitSearchOpen = useIsUnitBrowserSearchView();
  const [triggerSearchUnits] = useLazySearchUnitsQuery();
  
  // Get services for current sport + always include supporting services for hiking
  const allRelevantServices = useMemo(() => {
    const sportServices = getServicesForSport(sport);
    const hikingServices = getServicesForSport(UnitFilters.HIKING);
    return [...sportServices, ...hikingServices];
  }, [sport]);
  
  // Filter by on-season services and memoize to avoid unnecessary re-renders
  const selectedServices = useMemo(() => {
    const onSeasonServices = getOnSeasonServices();
    return allRelevantServices.filter(serviceId => 
      onSeasonServices.includes(serviceId)
    );
  }, [allRelevantServices]);
  
  // Memoize query parameters to avoid cache misses
  const queryParams = useMemo(() => {
    const sortedServices = [...selectedServices].sort((a, b) => a - b);
    return sortedServices.length > 0 ? { services: sortedServices } : {};
  }, [selectedServices]);
  
  // Fetch services first
  useGetServicesQuery();
  
  // Fetch ALL seasonal units (for search suggestions)
  useGetAllSeasonalUnitsQuery();
  
  // Fetch units for current sport selection (for map display)
  useGetUnitsQuery(
    queryParams,
    { skip: Object.keys(queryParams).length === 0 }
  );

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
