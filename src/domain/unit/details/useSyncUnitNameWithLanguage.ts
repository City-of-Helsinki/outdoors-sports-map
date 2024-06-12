import { useEffect } from "react";
import { useHistory, useLocation } from "react-router";

import useLanguage from "../../../common/hooks/useLanguage";
import { Unit } from "../unitConstants";

// If a user receives a link without the language parameter, but with the slug,
// the slug can end up being in the wrong language.
//
// If the user switches languages, the slug will be kept as it.
//
// To combat the two above niche cases this hook will attempt to keep the slug
// in sync with the application language.
function useSyncUnitNameWithLanguage(unit?: Unit) {
  const language = useLanguage();
  const history = useHistory();
  const { pathname, state } = useLocation();

  useEffect(() => {
    if (unit) {
      let nextPathname = `/${language}/unit/${unit.id}`;
      // @ts-ignore
      const unitNameInLanguage = unit.name[language];

      // If the unit has a name in the current language, add it into the slug
      if (unitNameInLanguage) {
        nextPathname = `${nextPathname}-${encodeURIComponent(
          unitNameInLanguage,
        )}`;
      }

      // If the pathname we want is not applied, apply it and don't lose current
      // navigation state.
      if (nextPathname !== pathname) {
        history.replace({ pathname: nextPathname, state });
      }
    }
  }, [history, language, unit, pathname, state]);
}

export default useSyncUnitNameWithLanguage;
