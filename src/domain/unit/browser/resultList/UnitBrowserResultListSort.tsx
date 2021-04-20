import { Dropdown } from "react-bootstrap";
import { useTranslation } from "react-i18next";

import SMIcon from "../../../../common/components/SMIcon";

type Props = {
  active: string;
  values: string[] | null | undefined;
  onSelect: (value: string | null) => void;
};

function UnitBrowserResultListSort({ active, values, onSelect }: Props) {
  const { t } = useTranslation();

  return (
    <Dropdown id="unit-sort-selector" className="unit-sort-selector">
      <Dropdown.Toggle>
        {t(`UNIT_DETAILS.SORT.${active.toUpperCase()}`)}
        <span className="custom-caret">
          <SMIcon icon="expand" />
        </span>
      </Dropdown.Toggle>
      <Dropdown.Menu>
        {values &&
          values.map((key) => (
            <Dropdown.Item key={key} eventKey={key} onSelect={onSelect}>
              {t(`UNIT_DETAILS.SORT.${key.toUpperCase()}`)}
            </Dropdown.Item>
          ))}
      </Dropdown.Menu>
    </Dropdown>
  );
}

export default UnitBrowserResultListSort;
