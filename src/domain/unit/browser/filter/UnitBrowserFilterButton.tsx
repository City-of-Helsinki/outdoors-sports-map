import classNames from "classnames";
import { Tag } from "hds-react";
import { Button } from "react-bootstrap";

import UnitBrowserFilterIcon from "./UnitBrowserFilterIcon";
import DropdownIndicator from "../../../../common/components/DropdownIndicator";

type Props = {
  filterName: string;
  className?: string;
  isActive?: boolean;
  message: string;
  showDropdownIndicator?: boolean;
  onClick?: (
    event:
      | React.MouseEvent<HTMLElement, MouseEvent>
      | React.KeyboardEvent<HTMLElement>,
  ) => void;
  id?: string;
  "aria-haspopup"?: boolean | "grid" | "listbox" | "menu" | "tree" | "dialog";
  "aria-controls"?: string;
  "aria-expanded"?: boolean;
  "aria-label"?: string;
};

function UnitBrowserFilterButton({
  filterName,
  className = "",
  isActive = false,
  showDropdownIndicator = false,
  message,
  onClick,
  ...restProps
}: Props) {
  const icon = (
    <UnitBrowserFilterIcon
      className={
        showDropdownIndicator
          ? "unit-filter-button__icon"
          : "unit-filter-option-button__icon"
      }
      filter={filterName}
      aria-hidden="true"
    />
  );

  if (showDropdownIndicator) {
    return (
      <Button
        className={`unit-filter-button ${className}`}
        onClick={onClick}
        {...restProps}
      >
        {icon}
        <span className="unit-filter-button__name">{message}</span>
        <DropdownIndicator isActive={isActive} />
      </Button>
    );
  }

  return (
    <Tag
      className={classNames(
        "unit-filter-option-button",
        { active: isActive },
        className,
      )}
      iconStart={icon}
      onClick={onClick}
      aria-selected={isActive}
      {...restProps}
    >
      {message}
    </Tag>
  );
}

export default UnitBrowserFilterButton;
