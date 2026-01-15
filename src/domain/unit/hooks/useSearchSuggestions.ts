import { useCallback, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';

import { 
  useLazySearchSuggestionsQuery,
  setUnitSuggestions,
  setAddressSuggestions 
} from '../state/searchSlice';

export function useSearchSuggestions() {
  const dispatch = useDispatch();
  const [triggerSearchSuggestions] = useLazySearchSuggestionsQuery();
  
  const currentSearchRef = useRef<string>('');
  const searchTimeoutRef = useRef<number | null>(null);

  const searchSuggestions = useCallback(
    (input: string) => {
      // Update current search term
      currentSearchRef.current = input;
      
      // Cancel previous search timeout if it exists
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
      
      // Debounce the search by 300ms to avoid too many rapid API calls
      searchTimeoutRef.current = setTimeout(async () => {
        // Start new search - let it complete for caching benefits
        const result = await triggerSearchSuggestions(input);
        
        // Only update Redux if this result matches the current search term
        if (input === currentSearchRef.current && result.data) {
          dispatch(setUnitSuggestions(result.data.units));
          dispatch(setAddressSuggestions(result.data.addresses));
        }
      }, 300);
    },
    [dispatch, triggerSearchSuggestions],
  );

  // Cleanup timeout on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  return { searchSuggestions };
}