/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';

import { mount } from '../../../common/enzymeHelpers';
import LanguageChanger from '../LanguageChanger';

const defaultProps = {
  changeLanguage: jest.fn(),
  activeLanguage: 'fi',
};
const getWrapper = (props) => mount(<LanguageChanger {...defaultProps} {...props} />);

describe('<LanguageChanger />', () => {
  it('should add a lang attribute to language options', async () => {
    const wrapper = await getWrapper();

    wrapper.find('a').forEach((element) => {
      expect(element.prop('lang')).toBeDefined();
    });
  });

  it('should change language when an option is clicked', async () => {
    const preventDefault = jest.fn();
    const mockEvent = { preventDefault };
    const wrapper = await getWrapper();
    const element = wrapper.find('a').at(0);

    element.simulate('click', mockEvent);

    expect(preventDefault).toHaveBeenCalledTimes(1);
    expect(defaultProps.changeLanguage).toHaveBeenCalledTimes(1);
  });
});
