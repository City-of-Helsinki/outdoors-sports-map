import React from 'react';

import { mount } from '../../enzymeHelpers';
import Page, { MAIN_CONTENT_ID } from '../Page';

const getWrapper = (props) => mount(<Page {...props} />);

describe('<Page />', () => {
  it('should render children within <main />', async () => {
    const children = <div id="test" />;
    const wrapper = await getWrapper({ children });

    expect(wrapper.find(`main#${MAIN_CONTENT_ID}`).prop('children')).toEqual(
      children
    );
  });
});
