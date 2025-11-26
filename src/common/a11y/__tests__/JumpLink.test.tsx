import { render, screen } from "../../../domain/testinLibraryUtils";
import JumpLink from "../JumpLink";
import { MAIN_CONTENT_ID } from "../Page";

const renderComponent = (props?: any) => render(<JumpLink {...props} />);
describe("<JumpLink />", () => {
  it("should render an anchor with id of MAIN_CONTENT_ID", () => {
    renderComponent();

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', `#${MAIN_CONTENT_ID}`);
  });
});
