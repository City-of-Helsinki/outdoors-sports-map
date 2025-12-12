import {
  fireEvent,
  render,
  screen,
  userEvent,
  act,
} from "../../testingLibraryUtils";
import SearchContainer from "../SearchContainer";

// Mock the child components
jest.mock("../SearchBar", () => {
  return function MockSearchBar({
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
  };
});

jest.mock("../SearchSuggestions", () => {
  return function MockSearchSuggestions({
    openAllResults,
    suggestions,
    handleAddressClick,
  }: any) {
    return (
      <div data-testid="search-suggestions">
        <button onClick={openAllResults} data-testid="open-all-results">
          Open All Results
        </button>
        <div data-testid="suggestions-count">{suggestions.length}</div>
        {suggestions.map((suggestion: any, index: number) => (
          <button
            key={index}
            onClick={() => handleAddressClick([1, 2])}
            data-testid={`suggestion-${index}`}
          >
            {suggestion.name}
          </button>
        ))}
      </div>
    );
  };
});

const defaultProps = {
  search: "",
  disabled: false,
  suggestions: [],
  isActive: false,
  onFindSuggestions: jest.fn(),
  onSearch: jest.fn(),
  onClear: jest.fn(),
  onAddressClick: jest.fn(),
};

const mockSuggestions = [
  { name: "Helsinki", coordinates: [1, 2] },
  { name: "Espoo", coordinates: [3, 4] },
];

const renderComponent = (props = {}) =>
  render(<SearchContainer {...defaultProps} {...props} />);

describe("<SearchContainer />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("rendering", () => {
    it("should render SearchBar component", () => {
      renderComponent();
      expect(screen.getByTestId("search-bar")).toBeInTheDocument();
    });

    it("should not show SearchSuggestions by default", () => {
      renderComponent();
      expect(
        screen.queryByTestId("search-suggestions"),
      ).not.toBeInTheDocument();
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
      const onFindSuggestions = jest.fn();
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

      expect(screen.getByTestId("search-suggestions")).toBeInTheDocument();
    });

    it("should call onSearch when search is submitted", async () => {
      const onSearch = jest.fn();
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

      expect(screen.getByTestId("search-suggestions")).toBeInTheDocument();

      const submitButton = screen.getByTestId("search-submit");
      await userEvent.click(submitButton);

      expect(
        screen.queryByTestId("search-suggestions"),
      ).not.toBeInTheDocument();
    });
  });

  describe("clear functionality", () => {
    it("should clear search phrase and call onClear", async () => {
      const onClear = jest.fn();
      renderComponent({ onClear, suggestions: mockSuggestions });

      const input = screen.getByTestId("search-input");
      await userEvent.type(input, "Helsinki");

      expect(screen.getByTestId("search-suggestions")).toBeInTheDocument();

      const clearButton = screen.getByTestId("search-clear");
      await userEvent.click(clearButton);

      expect(screen.getByTestId("search-input")).toHaveValue("");
      expect(
        screen.queryByTestId("search-suggestions"),
      ).not.toBeInTheDocument();
      expect(onClear).toHaveBeenCalledTimes(1);
    });
  });

  describe("focus handling", () => {
    it("should show suggestions on focus if there is text", async () => {
      const onFindSuggestions = jest.fn();
      renderComponent({
        search: "Helsinki",
        suggestions: mockSuggestions,
        onFindSuggestions,
      });

      const input = screen.getByTestId("search-input");
      await userEvent.click(input);

      expect(screen.getByTestId("search-suggestions")).toBeInTheDocument();
      expect(onFindSuggestions).toHaveBeenCalledWith("Helsinki");
    });

    it("should not show suggestions on focus if there is no text", async () => {
      renderComponent({ suggestions: mockSuggestions });

      const input = screen.getByTestId("search-input");
      await userEvent.click(input);

      expect(
        screen.queryByTestId("search-suggestions"),
      ).not.toBeInTheDocument();
    });

    it("should hide suggestions when focus leaves the container", async () => {
      renderComponent({ suggestions: mockSuggestions });

      const container = screen
        .getByTestId("search-input")
        .closest(".search-container");
      const input = screen.getByTestId("search-input");

      // First type to show suggestions
      const user = userEvent.setup();
      await user.type(input, "H");
      expect(screen.getByTestId("search-suggestions")).toBeInTheDocument();

      // Create an external element to focus to
      const externalButton = document.createElement("button");
      document.body.appendChild(externalButton);

      // Focus the external element to simulate focus leaving the container
      externalButton.focus();

      // Simulate blur event on the container with relatedTarget outside
      fireEvent.blur(container!, { relatedTarget: externalButton });

      // Wait for the blur timeout to complete (10ms + small buffer)
      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 50));
      });

      expect(
        screen.queryByTestId("search-suggestions"),
      ).not.toBeInTheDocument();

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
      expect(screen.getByTestId("search-suggestions")).toBeInTheDocument();

      // Press Escape
      const user = userEvent.setup();
      await user.type(input, "{Escape}");

      expect(
        screen.queryByTestId("search-suggestions"),
      ).not.toBeInTheDocument();
    });

    it("should open suggestions on arrow keys if there is text", async () => {
      const onFindSuggestions = jest.fn();
      renderComponent({
        search: "Helsinki",
        suggestions: mockSuggestions,
        onFindSuggestions,
      });

      const input = screen.getByTestId("search-input");

      // Press ArrowDown
      const user = userEvent.setup();
      await user.type(input, "{ArrowDown}");

      expect(screen.getByTestId("search-suggestions")).toBeInTheDocument();
      expect(onFindSuggestions).toHaveBeenCalledWith("Helsinki");
    });

    it("should open suggestions on arrow up key if there is text", async () => {
      const onFindSuggestions = jest.fn();
      renderComponent({
        search: "Helsinki",
        suggestions: mockSuggestions,
        onFindSuggestions,
      });

      const input = screen.getByTestId("search-input");

      // Press ArrowUp
      const user = userEvent.setup();
      await user.type(input, "{ArrowUp}");

      expect(screen.getByTestId("search-suggestions")).toBeInTheDocument();
      expect(onFindSuggestions).toHaveBeenCalledWith("Helsinki");
    });
  });

  describe("address selection", () => {
    it("should handle address click and clear search", async () => {
      const onAddressClick = jest.fn();
      const onClear = jest.fn();
      renderComponent({
        suggestions: mockSuggestions,
        onAddressClick,
        onClear,
      });

      const input = screen.getByTestId("search-input");
      await userEvent.type(input, "Helsinki");

      expect(screen.getByTestId("search-suggestions")).toBeInTheDocument();

      const suggestion = screen.getByTestId("suggestion-0");
      await userEvent.click(suggestion);

      expect(screen.getByTestId("search-input")).toHaveValue("");
      expect(
        screen.queryByTestId("search-suggestions"),
      ).not.toBeInTheDocument();
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

      expect(screen.getByTestId("search-suggestions")).toBeInTheDocument();
      expect(screen.getByTestId("suggestions-count")).toHaveTextContent("2");
    });

    it("should pass suggestions to SearchSuggestions component", async () => {
      renderComponent({ suggestions: mockSuggestions });

      const input = screen.getByTestId("search-input");
      const user = userEvent.setup();
      await user.type(input, "H");

      expect(screen.getByTestId("suggestion-0")).toHaveTextContent("Helsinki");
      expect(screen.getByTestId("suggestion-1")).toHaveTextContent("Espoo");
    });
  });
});
