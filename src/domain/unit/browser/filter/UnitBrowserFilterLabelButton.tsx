import invert from "lodash/invert";
import pick from "lodash/pick";
import { useTranslation } from "react-i18next";

import UnitBrowserFilterButton from "./UnitBrowserFilterButton";
import UnitBrowserFilterLabel from "./UnitBrowserFilterLabel";
import { UnitFilters } from "../../unitConstants";

const filterNameToLabel = (filterName: string) => {
  switch (filterName) {
    case "hiking":
      return "UNIT_DETAILS.SUPPORTING_SERVICES";
    case "sport":
      return "UNIT_DETAILS.FILTER_SPORT";

    case "status":
      return "UNIT_DETAILS.FILTER_STATUS";

    default:
      return "";
  }
};

type Filter = {
  name: string;
  active: string;
  isHiking?: boolean;
};

type UnitFilterLabelButtonProps = {
  filter: Filter;
  onAction: (filter: Filter) => void;
  isActive: boolean;
  id?: string;
};

function UnitBrowserFilterLabelButton({
  filter,
  onAction,
  isActive,
  ...rest
}: UnitFilterLabelButtonProps) {
  const { t } = useTranslation();
  const labelMessage = t(filterNameToLabel(filter.name));
  const buttonMessage = t(
    `UNIT_DETAILS.FILTER.${invert(UnitFilters)[filter.active]}`,
  );

  return (
    <div>
      <UnitBrowserFilterLabel message={labelMessage} />
      <UnitBrowserFilterButton
        filterName={filter.active}
        className={isActive ? "active" : ""}
        isActive={isActive}
        onClick={() => onAction(filter)}
        showDropdownIndicator
        message={buttonMessage}
        aria-label={[buttonMessage, labelMessage].join(", ")}
        aria-expanded={isActive}
        {...pick(rest, ["aria-haspopup", "aria-controls", "id"])}
      />
    </div>
  );
}

export default UnitBrowserFilterLabelButton;
