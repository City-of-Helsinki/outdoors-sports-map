/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';

import i18n from '../../../common/i18n';
import { mount } from '../../../common/enzymeHelpers';
import LanguageChanger from '../LanguageChanger';

const defaultProps = {};
const getWrapper = (props) =>
  mount(<LanguageChanger {...defaultProps} {...props} />);

describe('<LanguageChanger />', () => {
  it('should add a lang attribute to language options', () => {
    const wrapper = getWrapper();

    wrapper.find('a').forEach((element) => {
      expect(element.prop('lang')).toBeDefined();
    });
  });

  it('should change language when an option is clicked', () => {
    const preventDefault = jest.fn();
    const mockEvent = { preventDefault };
    const wrapper = getWrapper();
    const element = wrapper.find('a').at(0);
    const changeLanguageSpy = jest.spyOn(i18n, 'changeLanguage');

    element.simulate('click', mockEvent);

    expect(preventDefault).toHaveBeenCalledTimes(1);
    expect(changeLanguageSpy).toHaveBeenCalledTimes(1);
  });
});
