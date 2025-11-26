import { fireEvent, render, screen, userEvent } from "../../testingLibraryUtils";
import SearchBar from "../SearchBar";

const renderComponent = (props) => render(<SearchBar {...props} />);

describe("<SearchBar />", () => {
  it("should have an input for making a search", () => {
    const value = "Test value";
    const onInput = jest.fn();
    renderComponent({ onInput });
    const input = screen.getByRole("textbox", { name: "Etsi" });

    expect(input).toBeTruthy();

    fireEvent.change(input, { target: { value } });

    expect(onInput).toHaveBeenCalledTimes(1);
    expect(onInput).toHaveBeenCalledWith(value);
  });

  it("should have a submit button", async () => {
    const onSubmit = jest.fn();
    renderComponent({ onSubmit });
    const submitButton = screen.getByRole("button", { name: "Etsi" });

    expect(submitButton).toBeTruthy();

    const user = userEvent.setup();
    await user.click(submitButton);
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it("should have a clear button when the input has content and the searchActive prop is active", () => {
    renderComponent({
      input: "Search",
      searchActive: true,
    });

    expect(screen.getByRole("button", { name: "Tyhjennä haku" })).toBeTruthy();
  });

  it("should show a loading indicator when disabled is true", () => {
    renderComponent({
      disabled: true,
    });

    expect(screen.getByLabelText("Ladataan")).toBeTruthy();
  });
});
