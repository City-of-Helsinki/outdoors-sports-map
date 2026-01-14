import {render} from "../../../../testingLibraryUtils";
import UnitFilterLabel from "../UnitBrowserFilterLabel";

it("renders snapshot correctly", () => {
  const { container } = render(<UnitFilterLabel message="sport" />);

  expect(container).toMatchSnapshot();
});
