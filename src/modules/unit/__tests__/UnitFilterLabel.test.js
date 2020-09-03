import React from 'react';
import { shallow } from 'enzyme';

import UnitFilterLabel from '../components/UnitFilterLabel';

jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate HoC receive the t function as a prop
  translate: () => (Component) => {
    // eslint-disable-next-line no-param-reassign
    Component.defaultProps = { ...Component.defaultProps, t: (k) => k };
    return Component;
  },
}));

it('renders snapshot correctly', () => {
  const unitFilterLabel = shallow(<UnitFilterLabel filterName="sport" />);
  expect(unitFilterLabel.html()).toMatchSnapshot();
});
