import { render, screen, userEvent, act } from "../../testingLibraryUtils";
import SearchContainer from "../SearchContainer";

// Mock SearchBar to keep tests focused on SearchContainer
vi.mock("../SearchBar", () => ({
  default: function MockSearchBar({
    input,
    onInput,
    onSubmit,
    onClear,
    onFocus,
    onKeyDown,
    inputRef,
    searchActive,
    disabled,
  }: any) {
    return (
      <div data-testid="search-bar">
        <input
          ref={inputRef}
          data-testid="search-input"
          value={input}
          onChange={(e) => onInput(e.target.value)}
          onFocus={onFocus}
          onKeyDown={onKeyDown}
          disabled={disabled}
          placeholder="Search..."
        />
        <button onClick={onSubmit} data-testid="search-submit">
          Search
        </button>
        <button onClick={onClear} data-testid="search-clear">
          Clear
        </button>
        <div data-testid="search-active">{searchActive.toString()}</div>
        <div data-testid="search-disabled">{disabled.toString()}</div>
      </div>
    );
  },
}));

const defaultProps = {
  search: "",
  disabled: false,
  suggestions: [],
  isActive: false,
  onFindSuggestions: vi.fn(),
  onSearch: vi.fn(),
  onClear: vi.fn(),
  onAddressClick: vi.fn(),
};

const mockSuggestions = [
  {
    label: "Helsinki",
    coordinates: [1, 2] as [number, number],
    type: "searchable" as const,
    to: "/unit/123",
  },
  {
    label: "Espoo",
    coordinates: [3, 4] as [number, number],
    type: "searchable" as const,
    to: "/unit/456",
  },
];

const renderComponent = (props = {}) =>
  render(<SearchContainer {...defaultProps} {...props} />);

// Helper functions for common assertions
const expectSuggestionsToBeVisible = () => {
  expect(screen.getByRole("link", { name: "Helsinki" })).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "Espoo" })).toBeInTheDocument();
};

const expectSuggestionsToBeHidden = () => {
  expect(
    screen.queryByRole("link", { name: "Helsinki" }),
  ).not.toBeInTheDocument();
  expect(screen.queryByRole("link", { name: "Espoo" })).not.toBeInTheDocument();
};

const expectSuggestionsToAppear = async () => {
  expect(
    await screen.findByRole("link", { name: "Helsinki" }),
  ).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "Espoo" })).toBeInTheDocument();
};

const expectSearchInputToBeEmpty = () => {
  expect(screen.getByTestId("search-input")).toHaveValue("");
};

describe("<SearchContainer />", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("rendering", () => {
    it("should render SearchBar component", () => {
      renderComponent();
      expect(screen.getByTestId("search-bar")).toBeInTheDocument();
    });

    it("should not show SearchSuggestions by default", () => {
      renderComponent();
      expectSuggestionsToBeHidden();
    });

    it("should pass props correctly to SearchBar", () => {
      renderComponent({
        search: "test search",
        disabled: true,
        isActive: true,
      });

      expect(screen.getByDisplayValue("test search")).toBeInTheDocument();
      expect(screen.getByTestId("search-disabled")).toHaveTextContent("true");
      expect(screen.getByTestId("search-active")).toHaveTextContent("true");
    });
  });

  describe("search functionality", () => {
    it("should update search phrase when input changes", async () => {
      const onFindSuggestions = vi.fn();
      renderComponent({ onFindSuggestions });

      const input = screen.getByTestId("search-input");
      await userEvent.type(input, "Helsinki");

      expect(onFindSuggestions).toHaveBeenCalledWith("H");
      expect(onFindSuggestions).toHaveBeenCalledWith("He");
      expect(onFindSuggestions).toHaveBeenCalledWith("Hel");
      expect(onFindSuggestions).toHaveBeenCalledWith("Hels");
      expect(onFindSuggestions).toHaveBeenCalledWith("Helsi");
      expect(onFindSuggestions).toHaveBeenCalledWith("Helsin");
      expect(onFindSuggestions).toHaveBeenCalledWith("Helsinki");
    });

    it("should show suggestions when typing", async () => {
      renderComponent({ suggestions: mockSuggestions });

      const input = screen.getByTestId("search-input");
      await userEvent.type(input, "H");

      // Wait for suggestions to appear
      await expectSuggestionsToAppear();
    });

    it("should call onSearch when search is submitted", async () => {
      const onSearch = vi.fn();
      renderComponent({ onSearch });

      const input = screen.getByTestId("search-input");
      await userEvent.type(input, "Helsinki");

      const submitButton = screen.getByTestId("search-submit");
      await userEvent.click(submitButton);

      expect(onSearch).toHaveBeenCalledWith("Helsinki");
    });

    it("should hide suggestions when search is submitted", async () => {
      renderComponent({ suggestions: mockSuggestions });

      const input = screen.getByTestId("search-input");
      await userEvent.type(input, "H");

      expect(await screen.findByText("Helsinki")).toBeInTheDocument();

      const submitButton = screen.getByTestId("search-submit");
      await userEvent.click(submitButton);

      expectSuggestionsToBeHidden();
    });
  });

  describe("clear functionality", () => {
    it("should clear search phrase and call onClear", async () => {
      const onClear = vi.fn();
      renderComponent({ onClear, suggestions: mockSuggestions });

      const input = screen.getByTestId("search-input");
      await userEvent.type(input, "Helsinki");

      await expectSuggestionsToAppear();

      const clearButton = screen.getByTestId("search-clear");
      await userEvent.click(clearButton);

      expectSearchInputToBeEmpty();
      expectSuggestionsToBeHidden();
      expect(onClear).toHaveBeenCalledTimes(1);
    });
  });

  describe("focus handling", () => {
    it("should show suggestions on focus if there is text", async () => {
      const onFindSuggestions = vi.fn();
      renderComponent({
        search: "Helsinki",
        suggestions: mockSuggestions,
        onFindSuggestions,
      });

      const input = screen.getByTestId("search-input");
      await userEvent.click(input);

      await expectSuggestionsToAppear();
      expect(onFindSuggestions).toHaveBeenCalledWith("Helsinki");
    });

    it("should not show suggestions on focus if there is no text", async () => {
      renderComponent({ suggestions: mockSuggestions });

      const input = screen.getByTestId("search-input");
      await userEvent.click(input);

      expectSuggestionsToBeHidden();
    });

    it("should hide suggestions when focus leaves the container", async () => {
      renderComponent({ suggestions: mockSuggestions });

      const input = screen.getByTestId("search-input");

      // First type to show suggestions
      const user = userEvent.setup();
      await user.type(input, "H");
      await expectSuggestionsToAppear();

      // Create an external element to focus to
      const externalButton = document.createElement("button");
      document.body.appendChild(externalButton);

      // Focus the external element to simulate focus leaving the container
      externalButton.focus();

      // Simulate blur event on the container with relatedTarget outside
      await userEvent.click(externalButton);

      // Wait for the blur timeout to complete (10ms + small buffer)
      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 50));
      });

      expectSuggestionsToBeHidden();

      // Cleanup
      document.body.removeChild(externalButton);
    });
  });

  describe("preventBlurClose logic", () => {
    it("should allow clicking on suggestion links", async () => {
      const onAddressClick = vi.fn();
      const onClear = vi.fn();
      renderComponent({
        search: "Helsinki",
        suggestions: mockSuggestions,
        onAddressClick,
        onClear,
      });

      const input = screen.getByTestId("search-input");

      // Focus to show suggestions
      await userEvent.click(input);

      // Wait for suggestions to appear
      const helsinkiLink = await screen.findByRole("link", {
        name: "Helsinki",
      });
      expect(helsinkiLink).toBeInTheDocument();

      // Click on the Helsinki suggestion - this should work thanks to preventBlurClose
      await userEvent.click(helsinkiLink);

      // Verify the link click was handled properly
      expect(onAddressClick).toHaveBeenCalledWith([1, 2]);
      expect(onClear).toHaveBeenCalledTimes(1);
      expectSearchInputToBeEmpty();

      // Suggestions should be hidden after successful click
      expectSuggestionsToBeHidden();
    });

    it("should allow clicking on 'show all results' button", async () => {
      const onSearch = vi.fn();
      renderComponent({
        search: "Helsinki",
        suggestions: mockSuggestions,
        onSearch,
      });

      const input = screen.getByTestId("search-input");

      // Focus to show suggestions
      await userEvent.click(input);

      // Wait for suggestions and "show all results" button to appear
      const showAllButton = await screen.findByText(
        "Näytä kaikki hakutulokset",
      );
      expect(showAllButton).toBeInTheDocument();

      // Click on the "show all results" button - this should work thanks to preventBlurClose
      await userEvent.click(showAllButton);

      // Verify the button click was handled properly (it should trigger a search)
      expect(onSearch).toHaveBeenCalledWith("Helsinki");

      // Suggestions should be hidden after successful button click
      expectSuggestionsToBeHidden();
    });

    it("should maintain suggestions visibility during quick interactions", async () => {
      renderComponent({ suggestions: mockSuggestions });

      const input = screen.getByTestId("search-input");

      // First type to show suggestions
      const user = userEvent.setup();
      await user.type(input, "H");

      // Wait for suggestions to appear
      const helsinkiLink = await screen.findByText("Helsinki");
      expect(helsinkiLink).toBeInTheDocument();

      // Test that suggestions remain visible after focus changes within the container
      // This simulates the real-world scenario where preventBlurClose helps
      input.focus();
      expectSuggestionsToBeVisible();
    });

    it("should properly handle blur events when focus moves outside container", async () => {
      renderComponent({ suggestions: mockSuggestions });
      const input = screen.getByTestId("search-input");

      // First type to show suggestions
      const user = userEvent.setup();
      await user.type(input, "H");

      // Wait for suggestions to appear
      const helsinkiLink = await screen.findByText("Helsinki");
      expect(helsinkiLink).toBeInTheDocument();

      // Create an external element and focus it (simulating normal blur without preventBlurClose)
      const externalButton = document.createElement("button");
      document.body.appendChild(externalButton);

      // Click external element to trigger blur
      await userEvent.click(externalButton);

      // Wait for the blur timeout to complete
      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 50));
      });

      // Suggestions should be hidden normally
      expectSuggestionsToBeHidden();

      // Cleanup
      document.body.removeChild(externalButton);
    });
  });

  describe("keyboard navigation", () => {
    it("should close suggestions and focus input on Escape key", async () => {
      renderComponent({ suggestions: mockSuggestions });

      const input = screen.getByTestId("search-input");

      // First type to show suggestions
      await userEvent.type(input, "H");
      expect(await screen.findByText("Helsinki")).toBeInTheDocument();

      // Press Escape
      const user = userEvent.setup();
      await user.type(input, "{Escape}");

      expectSuggestionsToBeHidden();
    });

    it("should open suggestions on arrow keys if there is text", async () => {
      const onFindSuggestions = vi.fn();
      renderComponent({
        search: "Helsinki",
        suggestions: mockSuggestions,
        onFindSuggestions,
      });

      const input = screen.getByTestId("search-input");

      // Press ArrowDown
      const user = userEvent.setup();
      await user.type(input, "{ArrowDown}");

      await expectSuggestionsToAppear();
      expect(onFindSuggestions).toHaveBeenCalledWith("Helsinki");
    });

    it("should open suggestions on arrow up key if there is text", async () => {
      const onFindSuggestions = vi.fn();
      renderComponent({
        search: "Helsinki",
        suggestions: mockSuggestions,
        onFindSuggestions,
      });

      const input = screen.getByTestId("search-input");

      // Press ArrowUp
      const user = userEvent.setup();
      await user.type(input, "{ArrowUp}");

      await expectSuggestionsToAppear();
      expect(onFindSuggestions).toHaveBeenCalledWith("Helsinki");
    });

    it("should not open suggestions on arrow keys if there is no text", async () => {
      const onFindSuggestions = vi.fn();
      renderComponent({
        search: "",
        suggestions: mockSuggestions,
        onFindSuggestions,
      });

      const input = screen.getByTestId("search-input");

      // Press ArrowDown with no text
      const user = userEvent.setup();
      await user.type(input, "{ArrowDown}");

      expectSuggestionsToBeHidden();
      expect(onFindSuggestions).not.toHaveBeenCalled();
    });
  });

  describe("address selection", () => {
    it("should handle address click and clear search", async () => {
      const onAddressClick = vi.fn();
      const onClear = vi.fn();
      renderComponent({
        suggestions: mockSuggestions,
        onAddressClick,
        onClear,
      });

      const input = screen.getByTestId("search-input");
      await userEvent.type(input, "Helsinki");

      // Wait for suggestions to appear
      await expectSuggestionsToAppear();

      // Click on the Helsinki suggestion
      const helsinkiLink = screen.getByRole("link", { name: "Helsinki" });
      await userEvent.click(helsinkiLink);

      expectSearchInputToBeEmpty();
      expect(onClear).toHaveBeenCalledTimes(1);
      expect(onAddressClick).toHaveBeenCalledWith([1, 2]);
    });
  });

  describe("suggestions display", () => {
    it("should show suggestions when there are suggestions and showSuggestions is true", async () => {
      renderComponent({ suggestions: mockSuggestions });

      const input = screen.getByTestId("search-input");
      const user = userEvent.setup();
      await user.type(input, "H");

      // Check that the suggestions container exists
      const suggestionsContainer = await screen
        .findByText("Helsinki")
        .then((el) => el.closest(".search-suggestions"));
      expect(suggestionsContainer).toBeInTheDocument();

      // Check that both suggestions are displayed
      expectSuggestionsToBeVisible();
    });

    it("should pass suggestions to SearchSuggestions component", async () => {
      renderComponent({ suggestions: mockSuggestions });

      const input = screen.getByTestId("search-input");
      const user = userEvent.setup();
      await user.type(input, "H");

      // The real SearchSuggestions component renders Link elements with the label text
      expectSuggestionsToBeVisible();
    });
  });
});
