import { Button } from "react-bootstrap";

import UnitBrowserFilterIcon from "./UnitBrowserFilterIcon";
import DropdownIndicator from "../../../../common/components/DropdownIndicator";

type Props = {
  filterName: string;
  className?: string;
  message: string;
  showDropdownIndicator?: boolean;
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLElement>) => void;
};

function UnitBrowserFilterButton({
  filterName,
  className = "",
  showDropdownIndicator = false,
  message,
  ...rest
}: Props) {
  return (
    <Button className={`unit-filter-button ${className}`} {...rest}>
      <UnitBrowserFilterIcon
        className="unit-filter-button__icon"
        filter={filterName}
        aria-hidden="true"
      />
      <span className="unit-filter-button__name">{message}</span>
      {showDropdownIndicator && <DropdownIndicator />}
    </Button>
  );
}

export default UnitBrowserFilterButton;
