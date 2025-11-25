import { render, screen, within } from "../../../domain/testinLibraryUtils";
import OutboundLink from "../OutboundLink";

const defaultProps = {
  href: "http://localhost",
  children: "Label",
};

const renderComponent = (props?: any) =>
  render(<OutboundLink {...defaultProps} {...props} />);

describe("<OutboundLink />", () => {
  it("should render a link with notice that it will be opened into a new window", () => {
    renderComponent();
    const link = screen.getByRole("link");
    expect(link).toBeInTheDocument();
    expect(within(link).getByTitle("Avaa uuden ikkunan")).toBeInTheDocument();
  });
});
