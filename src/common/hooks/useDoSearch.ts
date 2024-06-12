import { useCallback } from "react";
import { useHistory, useLocation } from "react-router";

function useDoSearch() {
  const { search } = useLocation();
  const history = useHistory();

  const doSearch = useCallback(
    (keyOrMultiple: string | Record<string, string>, value?: string) => {
      const searchParams = new URLSearchParams(search);
      const sportKey = "sport";
      const sportSpecificationKey = "sportSpecification";

      const handleClearSportSpecification = (key: string, newValue: string) => {
        // Check if "sport" is being updated and
        // if the value is not the same as the previous value
        if (key === sportKey && searchParams.get(sportKey) !== newValue) {
          // User changed sport to something else, so clear sportSpecification filters
          searchParams.delete(sportSpecificationKey);
        }
      };

      if (typeof keyOrMultiple === "string") {
        const key = keyOrMultiple;
        handleClearSportSpecification(key, value || "");

        if (!value) {
          searchParams.delete(key);
        } else {
          searchParams.set(key, value);
        }
      } else {
        Object.entries(keyOrMultiple).forEach(([key, valueOfMultiple]) => {
          handleClearSportSpecification(key, valueOfMultiple || "");

          if (!valueOfMultiple) {
            searchParams.delete(key);
          } else {
            searchParams.set(key, valueOfMultiple);
          }
        });
      }

      history.replace({
        search: searchParams.toString(),
      });
    },
    [history, search],
  );

  return doSearch;
}

export default useDoSearch;
