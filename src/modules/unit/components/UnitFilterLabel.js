import React from 'react';
import { translate } from 'react-i18next';

jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate HoC receive the t function as a prop
  translate: () => (Component) => {
    // eslint-disable-next-line no-param-reassign
    Component.defaultProps = { ...Component.defaultProps, t: (k) => k };
    return Component;
  },
}));

const filterNameToLabel = (filterName) => {
  switch (filterName) {
    case 'sport': return 'UNIT.FILTER_SPORT';
    case 'status': return 'UNIT.FILTER_STATUS';
    default: return '';
  }
};

// eslint-disable-next-line react/prop-types
const UnitFilterLabel = ({ filterName, t }) => {
  const message = filterNameToLabel(filterName);
  if (!message) {
    return null;
  }
  return (
    <div className="unit-filter-label">
      <span>
        {t(message)}
:
      </span>
    </div>
  );
};

export default translate()(UnitFilterLabel);
