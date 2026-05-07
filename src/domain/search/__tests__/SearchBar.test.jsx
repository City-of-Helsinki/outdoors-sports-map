import React from "react";
import {
  fireEvent,
  render,
  screen,
  userEvent,
} from "../../testingLibraryUtils";
import SearchBar from "../SearchBar";

const renderComponent = (props) => render(<SearchBar {...props} />);

describe("<SearchBar />", () => {
  it("should have an input for making a search", () => {
    const value = "Test value";
    const onInput = vi.fn();
    renderComponent({
      onInput,
      ariaExpanded: false,
      ariaControls: "search-suggestions-listbox",
    });
    const input = screen.getByRole("combobox", { name: "Etsi" });

    expect(input).toBeInTheDocument();

    fireEvent.change(input, { target: { value } });

    expect(onInput).toHaveBeenCalledTimes(1);
    expect(onInput).toHaveBeenCalledWith(value);
  });

  it("should have the correct ARIA combobox attributes", () => {
    renderComponent({
      ariaExpanded: false,
      ariaControls: "search-suggestions-listbox",
    });
    const input = screen.getByRole("combobox", { name: "Etsi" });

    expect(input).toHaveAttribute("role", "combobox");
    expect(input).toHaveAttribute("aria-expanded", "false");
    expect(input).toHaveAttribute("aria-controls", "search-suggestions-listbox");
    expect(input).toHaveAttribute("aria-autocomplete", "list");
    expect(input).toHaveAttribute("aria-haspopup", "listbox");
  });

  it("should reflect aria-expanded when suggestions are open", () => {
    renderComponent({
      ariaExpanded: true,
      ariaControls: "search-suggestions-listbox",
    });
    const input = screen.getByRole("combobox", { name: "Etsi" });

    expect(input).toHaveAttribute("aria-expanded", "true");
  });

  it("should set aria-activedescendant when an option is active", () => {
    renderComponent({
      ariaExpanded: true,
      ariaControls: "search-suggestions-listbox",
      ariaActiveDescendant: "search-suggestion-2",
    });
    const input = screen.getByRole("combobox", { name: "Etsi" });

    expect(input).toHaveAttribute("aria-activedescendant", "search-suggestion-2");
  });

  it("should not set aria-activedescendant when no option is active", () => {
    renderComponent({
      ariaExpanded: false,
      ariaControls: "search-suggestions-listbox",
    });
    const input = screen.getByRole("combobox", { name: "Etsi" });

    expect(input).not.toHaveAttribute("aria-activedescendant");
  });

  it("should have a submit button", async () => {
    const onSubmit = vi.fn();
    renderComponent({
      onSubmit,
      ariaExpanded: false,
      ariaControls: "search-suggestions-listbox",
    });
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
      ariaExpanded: false,
      ariaControls: "search-suggestions-listbox",
    });

    expect(
      screen.getByRole("button", { name: "Tyhjennä haku" }),
    ).toBeInTheDocument();
  });

  it("should show a loading indicator when disabled is true", () => {
    renderComponent({
      disabled: true,
      ariaExpanded: false,
      ariaControls: "search-suggestions-listbox",
    });

    const loadingSpinnerStatus = screen.getByRole("status");
    expect(loadingSpinnerStatus).toBeInTheDocument();
    expect(loadingSpinnerStatus).toHaveTextContent("Ladataan");
  });
});
