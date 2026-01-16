import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { useGetUnitsQuery, receiveUnits, setIsFetching } from '../state/unitSlice';

interface UseUnitsWithStateOptions {
  services?: number[];
  skip?: boolean;
}

/**
 * Custom hook that fetches units via RTK Query and automatically updates Redux state
 * only for the requested services. This prevents overwriting sport arrays with empty data
 * when we haven't actually queried for those services.
 */
export const useUnitsWithState = (options: UseUnitsWithStateOptions = {}) => {
  const { services, skip = false } = options;
  const dispatch = useDispatch();
  
  // Use RTK Query to fetch units
  const queryResult = useGetUnitsQuery(
    services ? { services } : undefined,
    { skip }
  );
  
  const { data, isSuccess, isFetching } = queryResult;
  
  // Update isFetching state in Redux
  useEffect(() => {
    dispatch(setIsFetching(isFetching));
  }, [dispatch, isFetching]);
  
  // When query succeeds, dispatch to Redux state
  useEffect(() => {
    if (isSuccess && data) {
      dispatch(receiveUnits(data));
    }
  }, [dispatch, data, isSuccess]);
  
  return queryResult;
};