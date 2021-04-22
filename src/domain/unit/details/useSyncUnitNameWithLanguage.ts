import { useEffect } from "react";
import { useHistory, useParams } from "react-router";

import useLanguage from "../../../common/hooks/useLanguage";
import { Unit } from "../unitConstants";
import { getAttr } from "../unitHelpers";

type UnitDetailsParams = {
  unitName?: string;
};

// If a user receives a link without the language parameter, but with the slug,
// the slug can end up being in the wrong language.
//
// If the user switches languages, the slug will be kept as it.
//
// To combat the two above niche cases this hook will attempt to keep the slug
// in sync with the application language.
function useSyncUnitNameWithLanguage(unit?: Unit) {
  const { unitName } = useParams<UnitDetailsParams>();
  const language = useLanguage();
  const history = useHistory();

  useEffect(() => {
    if (unit) {
      const unitNameInLanguage = getAttr(unit.name, language);

      if (unitName && decodeURIComponent(unitName) !== unitNameInLanguage) {
        history.replace(
          `/${language}/unit/${unit.id}-${encodeURIComponent(
            unitNameInLanguage
          )}`
        );
      }
    }
  }, [history, language, unit, unitName]);
}

export default useSyncUnitNameWithLanguage;
