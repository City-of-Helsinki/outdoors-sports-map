/*
   eslint-disable
   react/prop-types,
*/

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Dropdown, MenuItem } from 'react-bootstrap';
import SMIcon from '../../home/components/SMIcon';

const SortSelectorDropdown = ({ active, values, onSelect }) => {
  const { t } = useTranslation();

  return (
    <Dropdown id="unit-sort-selector" className="unit-sort-selector">
      <Dropdown.Toggle noCaret>
        {t(`UNIT.SORT.${active.toUpperCase()}`)}
        <span className="custom-caret">
          <SMIcon icon="expand" />
        </span>
      </Dropdown.Toggle>
      <Dropdown.Menu>
        {values &&
          values.map((key) => (
            <MenuItem key={key} eventKey={key} onSelect={onSelect}>
              {t(`UNIT.SORT.${key.toUpperCase()}`)}
            </MenuItem>
          ))}
      </Dropdown.Menu>
    </Dropdown>
  )
);

export default SortSelectorDropdown;
