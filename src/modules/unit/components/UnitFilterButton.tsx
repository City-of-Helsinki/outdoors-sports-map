import { Button } from "react-bootstrap";

import DropdownIndicator from "./DropdownIndicator";
import UnitFilterIcon from "./UnitFilterIcon";

type Props = {
  filterName: string;
  className?: string;
  message: string;
  showDropdownIndicator?: boolean;
  onClick?: (e: React.MouseEvent<HTMLElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLElement>) => void;
};

function UnitFilterButton({
  filterName,
  className = "",
  showDropdownIndicator = false,
  message,
  ...rest
}: Props) {
  return (
    <Button className={`unit-filter-button ${className}`} {...rest}>
      <UnitFilterIcon
        className="unit-filter-button__icon"
        filter={filterName}
        aria-hidden="true"
      />
      <span className="unit-filter-button__name">{message}</span>
      {showDropdownIndicator && <DropdownIndicator />}
    </Button>
  );
}

export default UnitFilterButton;
