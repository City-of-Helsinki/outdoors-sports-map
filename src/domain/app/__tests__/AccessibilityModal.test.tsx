import { render, screen } from "../../testingLibraryUtils";
import AppAccessibilityModal from "../AppAccessibilityModal";

const renderComponent = () =>
  render(
    <AppAccessibilityModal
      onClose={() => {
        // pass
      }}
      show
    />
  );

describe("<AppAccessibilityModal />", () => {
  it("renders correctly", () => {
    renderComponent();
    const dialog = screen.getByRole("dialog"); 
    expect(dialog.innerHTML).toMatchSnapshot();
  });
});
