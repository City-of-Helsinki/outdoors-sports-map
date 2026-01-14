import { useLocation } from "react-router";

function getAllSearchParamsAsObject<
  Params extends { [K in keyof Params]?: string } = Record<string, string>,
>(search: string): Params {
  const searchParams = new URLSearchParams(search);
  const params: Record<string, string> = {};

  for (const [key, value] of searchParams.entries()) {
    params[key] = value;
  }

  return params as Params;
}

function useSearch<
  Params extends { [K in keyof Params]?: string } = Record<string, string>,
>(): Params {
  const { search } = useLocation();

  return getAllSearchParamsAsObject<Params>(search);
}

export default useSearch;
