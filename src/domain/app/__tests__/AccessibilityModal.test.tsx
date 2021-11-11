import { mount } from "../../enzymeHelpers";
import AppAccessibilityModal from "../AppAccessibilityModal";

const getWrapper = () =>
  mount(
    <AppAccessibilityModal
      onClose={() => {
        // pass
      }}
      show
    />
  );

describe("<AppAccessibilityModal />", () => {
  it("renders correctly", () => {
    const wrapper = getWrapper();

    expect(wrapper.html()).toMatchSnapshot();
  });
});
