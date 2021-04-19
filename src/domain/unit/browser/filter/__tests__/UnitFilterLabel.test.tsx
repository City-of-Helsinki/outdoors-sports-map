import { shallow } from "enzyme";

import UnitFilterLabel from "../UnitBrowserFilterLabel";

it("renders snapshot correctly", () => {
  const unitFilterLabel = shallow(<UnitFilterLabel message="sport" />);

  expect(unitFilterLabel.html()).toMatchSnapshot();
});
