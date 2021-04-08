import React from 'react';

import { mount } from '../../../common/enzymeHelpers';
import { Header } from '../SingleUnitContainer';

const defaultProps = {};
const getWrapper = (props) =>
  mount(<ModalHeader {...defaultProps} {...props} />);

describe('<Header />', () => {
  it('should have a close button', () => {
    const wrapper = getWrapper();
    const closeButton = wrapper.find({ 'aria-label': 'Sulje' }).at(0).parent();

    // It should exists
    expect(closeButton.length > 0).toBeTruthy();
    // It should take the user to the root route
    expect(closeButton.prop('href')).toEqual('/');
  });
});
