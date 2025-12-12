import { render, screen } from "../../../domain/testingLibraryUtils";
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
    expect(link.getAttribute("aria-label")).toContain("Avaa uuden ikkunan.");
  });

  it("should render a link with notice that it will move to an external service", () => {
    renderComponent();
    const link = screen.getByRole("link");
    expect(link).toBeInTheDocument();
    expect(link.getAttribute("aria-label")).toContain(
      "Siirtyy ulkopuoliseen palveluun.",
    );
  });
});
