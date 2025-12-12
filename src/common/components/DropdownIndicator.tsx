import classNames from "classnames";
import { IconAngleDown } from "hds-react";

type Props = {
  isActive?: boolean;
};

function DropdownIndicator({ isActive = false }: Readonly<Props>) {
  return (
    <span
      className={classNames("dropdown-indicator", { active: isActive })}
      aria-hidden="true"
      data-testid="dropdown-indicator"
    >
      <IconAngleDown />
    </span>
  );
}

export default DropdownIndicator;
