import React from 'react';

import { mount } from '../../enzymeHelpers';
import Page, { MAIN_CONTENT_ID } from '../Page';

const getWrapper = (props) => mount(<Page {...props} />);

describe('<Page />', () => {
  it('should render children within <main />', () => {
    const children = <div id="test" />;
    const wrapper = getWrapper({ children });

    expect(wrapper.find(`main#${MAIN_CONTENT_ID}`).prop('children')).toEqual(
      children
    );
  });

  it('should set title', () => {
    const title = 'Title';
    getWrapper({ title, children: <div /> });

    expect(document.title).toEqual(title);
  });
});
