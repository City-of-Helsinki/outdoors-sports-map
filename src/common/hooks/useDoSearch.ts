import { useCallback } from "react";
import { useHistory, useLocation } from "react-router";

function useDoSearch() {
  const { search } = useLocation();
  const history = useHistory();

  const doSearch = useCallback(
    (keyOrMultiple: string | Record<string, string>, value?: string) => {
      const searchParams = new URLSearchParams(search);

      if (typeof keyOrMultiple === "string") {
        const key = keyOrMultiple;

        if (!value) {
          searchParams.delete(key);
        } else {
          searchParams.set(key, value);
        }
      } else {
        Object.entries(keyOrMultiple).forEach(([key, valueOfMultiple]) => {
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
    [history, search]
  );

  return doSearch;
}

export default useDoSearch;
