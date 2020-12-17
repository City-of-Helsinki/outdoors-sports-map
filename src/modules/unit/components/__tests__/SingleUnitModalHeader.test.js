import React from 'react';

import { mount } from '../../../common/enzymeHelpers';
import { ModalHeader } from '../SingleUnitModalContainer';

const defaultProps = {
  t: (translationPath) => translationPath,
};
const getWrapper = (props) =>
  mount(<ModalHeader {...defaultProps} {...props} />);

describe('<ModalHeader />', () => {
  it('should have a close button', async () => {
    const handleClick = jest.fn();
    const mockEvent = { preventDefault: jest.fn() };
    const wrapper = await getWrapper({ handleClick });

    const closeButton = wrapper
      .find({ 'aria-label': 'MODAL.CLOSE' })
      .at(0)
      .parent();

    // It should exists
    expect(closeButton).toBeTruthy();
    // It should have an empty href
    expect(closeButton.prop('href')).toEqual('');

    // Simulating clicks does not work due to some reason I was not able
    // to pin down. Enzyme's simulate more or less just calls the
    // onClick function so this should be an equivalent approach.
    closeButton.prop('onClick')(mockEvent);

    expect(mockEvent.preventDefault).toHaveBeenCalledTimes(1);
    expect(handleClick).toHaveBeenCalledWith(mockEvent);
  });
});
