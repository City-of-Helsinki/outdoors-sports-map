import classNames from "classnames";
import { IconAngleDown } from "hds-react";
import { Dropdown } from "react-bootstrap";
import { useTranslation } from "react-i18next";

type Props = {
  active: string;
  values: string[] | null | undefined;
  onSelect: (value: string | null) => void;
};

function UnitBrowserResultListSort({ active, values, onSelect }: Props) {
  const { t } = useTranslation();

  return (
    <Dropdown
      id="unit-sort-selector"
      className="unit-sort-selector"
      onSelect={onSelect}
    >
      <Dropdown.Toggle>
        {t(`UNIT_DETAILS.SORT.${active.toUpperCase()}`)}
        <span className="custom-caret">
          <IconAngleDown
            aria-hidden={true}
            className={classNames("unit-sort-selector__icon")}
          />
        </span>
      </Dropdown.Toggle>
      <Dropdown.Menu>
        {values &&
          values.map((key) => (
            <Dropdown.Item active={key === active} key={key} eventKey={key}>
              {t(`UNIT_DETAILS.SORT.${key.toUpperCase()}`)}
            </Dropdown.Item>
          ))}
      </Dropdown.Menu>
    </Dropdown>
  );
}

export default UnitBrowserResultListSort;
