import { render } from "../../../domain/testinLibraryUtils";
import JumpLink from "../JumpLink";
import { MAIN_CONTENT_ID } from "../Page";

const renderComponent = (props?: any) => render(<JumpLink {...props} />);
describe("<JumpLink />", () => {
  it("should render an anchor with id of MAIN_CONTENT_ID", () => {
    const { container } = renderComponent();

    expect(container.querySelector(`a[href="#${MAIN_CONTENT_ID}"]`)).toBeInTheDocument();
  });
});
