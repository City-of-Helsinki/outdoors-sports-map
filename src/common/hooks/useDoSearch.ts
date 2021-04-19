import { useCallback } from "react";
import { useHistory, useLocation } from "react-router";

function useDoSearch() {
  const { search } = useLocation();
  const history = useHistory();

  const doSearch = useCallback(
    (key: string, value: string) => {
      const searchParams = new URLSearchParams(search);

      searchParams.set(key, value);
      history.replace({
        search: searchParams.toString(),
      });
    },
    [history, search]
  );

  return doSearch;
}

export default useDoSearch;
