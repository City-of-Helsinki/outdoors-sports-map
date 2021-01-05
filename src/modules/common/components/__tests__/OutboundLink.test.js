import React from 'react';

import { mount } from '../../enzymeHelpers';
import OutboundLink from '../OutboundLink';

const defaultProps = {
  href: 'http://localhost',
  children: 'Label',
};
const getWrapper = (props) =>
  mount(<OutboundLink {...defaultProps} {...props} />);

describe('<OutboundLink />', () => {
  it('should render a link with notice that it will be opened into a new window', async () => {
    const wrapper = await getWrapper();
    const link = wrapper.find('a');

    expect(link.length).toEqual(1);
    expect(link.find('[title="Avaa uuden ikkunan"]'));
  });
});
