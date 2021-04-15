/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';

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
});
