import {render} from "@testing-library/react";

import UnitFilterLabel from "../UnitBrowserFilterLabel";

it("renders snapshot correctly", () => {
  const { container } = render(<UnitFilterLabel message="sport" />);

  expect(container).toMatchSnapshot();
});
