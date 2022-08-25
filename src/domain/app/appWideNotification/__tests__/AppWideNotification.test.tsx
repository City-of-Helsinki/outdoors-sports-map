import {
  render,
  screen,
} from "../../../testinLibraryUtils";
import AppWideNotification from "../AppWideNotification";

describe("<AppWideNotification />", () => {
  it("dialog should exist", () => {
    const {container} = render(<AppWideNotification initialState={true} />);
    expect(container.firstChild).toBeTruthy();
  });
  it("dialog should not exist", () => {
    const {container} = render(<AppWideNotification initialState={false} />);
    expect(container.firstChild).not.toBeTruthy();
  });
  it("dialog should exist and have a close button", () => {
    const {container} = render(<AppWideNotification initialState={true} />);
    expect(container.firstChild).toBeTruthy();
    const closeButton = screen.getByRole("button");
    expect(closeButton).toBeTruthy();
    expect(closeButton.title).toEqual("Sulje");
  });
});
