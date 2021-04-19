import { mount } from "../../../domain/enzymeHelpers";
import OutboundLink from "../OutboundLink";

const defaultProps = {
  href: "http://localhost",
  children: "Label",
};

const getWrapper = (props) =>
  mount(<OutboundLink {...defaultProps} {...props} />);

describe("<OutboundLink />", () => {
  it("should render a link with notice that it will be opened into a new window", () => {
    const wrapper = getWrapper();
    const link = wrapper.find("a");

    expect(link.length).toEqual(1);
    expect(link.find('span[title="Avaa uuden ikkunan"]').length).toEqual(1);
  });
});
