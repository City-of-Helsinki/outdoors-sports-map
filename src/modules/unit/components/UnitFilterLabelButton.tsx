import invert from "lodash/invert";
import pick from "lodash/pick";
import { useTranslation } from "react-i18next";

import { UnitFilters } from "../constants";
import UnitFilterButton from "./UnitFilterButton";
import UnitFilterLabel from "./UnitFilterLabel";

const filterNameToLabel = (filterName: string) => {
  switch (filterName) {
    case "sport":
      return "UNIT.FILTER_SPORT";

    case "status":
      return "UNIT.FILTER_STATUS";

    default:
      return "";
  }
};

type Filter = {
  name: string;
  active: string;
};

type UnitFilterLabelButtonProps = {
  filter: Filter;
  onAction: (filter: Filter) => void;
  isActive: boolean;
  id?: string;
};

function UnitFilterLabelButton({
  filter,
  onAction,
  isActive,
  ...rest
}: UnitFilterLabelButtonProps) {
  const { t } = useTranslation();
  const labelMessage = t(filterNameToLabel(filter.name));
  const buttonMessage = t(`UNIT.FILTER.${invert(UnitFilters)[filter.active]}`);

  return (
    <div>
      <UnitFilterLabel message={labelMessage} />
      <UnitFilterButton
        filterName={filter.active}
        className={isActive ? "active" : ""}
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

export default UnitFilterLabelButton;
