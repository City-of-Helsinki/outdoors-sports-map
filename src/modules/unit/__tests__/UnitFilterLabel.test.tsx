import { shallow } from "enzyme";
import React from "react";

import UnitFilterLabel from "../components/UnitFilterLabel";

it("renders snapshot correctly", () => {
  const unitFilterLabel = shallow(<UnitFilterLabel message="sport" />);

  expect(unitFilterLabel.html()).toMatchSnapshot();
});
