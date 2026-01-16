import { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';

import { 
  useSearchSuggestionsQuery,
  setUnitSuggestions,
  setAddressSuggestions 
} from '../state/searchSlice';

export function useSearchSuggestions() {
  const dispatch = useDispatch();
  const [debouncedInput, setDebouncedInput] = useState('');
  const searchTimeoutRef = useRef<number | null>(null);

  // Use regular query with debounced input - RTK Query handles caching automatically
  const { data, isLoading } = useSearchSuggestionsQuery(debouncedInput, {
    skip: !debouncedInput.trim(), // Skip query if input is empty
  });

  // Update Redux store when data changes
  useEffect(() => {
    if (data) {
      dispatch(setUnitSuggestions(data.units));
      dispatch(setAddressSuggestions(data.addresses));
    }
  }, [data, dispatch]);

  const searchSuggestions = useCallback(
    (input: string) => {
      // Cancel previous timeout if it exists
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
      
      // Debounce the input state update by 300ms
      searchTimeoutRef.current = setTimeout(() => {
        setDebouncedInput(input);
      }, 300);
    },
    [],
  );

  // Cleanup timeout on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  return { searchSuggestions, isLoading };
}