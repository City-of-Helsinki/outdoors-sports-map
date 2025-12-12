import { render, screen, userEvent } from "../../../../testingLibraryUtils";
import UnitBrowserFilter, { filterEquals } from "../UnitBrowserFilter";

// Mock child components with simple implementations
jest.mock("../UnitBrowserFilterButton", () => {
  return function MockUnitFilterButton({
    filterName,
    isActive,
    onClick,
    message,
  }: any) {
    return (
      <button
        data-testid={`filter-button-${filterName}`}
        onClick={onClick}
        className={isActive ? "active" : ""}
      >
        {message}
      </button>
    );
  };
});

jest.mock("../UnitBrowserFilterLabelButton", () => {
  return function MockUnitFilterLabelButton({
    filter,
    onAction,
    isActive,
    ...props
  }: any) {
    return (
      <button
        data-testid={`filter-label-${filter.name}`}
        onClick={onAction}
        className={isActive ? "active" : ""}
        {...props}
      >
        {filter.name} ({filter.active || "none"})
      </button>
    );
  };
});

jest.mock("../UnitBrowserFilterOptionsWrapper", () => {
  return function MockUnitFilterOptionsWrapper({ children, ...props }: any) {
    return (
      <div data-testid="filter-options-wrapper" {...props}>
        {children}
      </div>
    );
  };
});

describe("UnitBrowserFilter", () => {
  const mockUpdateFilter = jest.fn();
  const defaultFilters = [
    {
      name: "sport",
      active: "swimming",
      options: ["swimming", "skiing"],
    },
    {
      name: "status",
      active: "ok",
      options: ["ok", "closed"],
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders filter buttons for each filter", () => {
    render(
      <UnitBrowserFilter
        filters={defaultFilters}
        updateFilter={mockUpdateFilter}
      />,
    );

    expect(screen.getByTestId("filter-label-sport")).toBeInTheDocument();
    expect(screen.getByTestId("filter-label-status")).toBeInTheDocument();
  });

  it("shows filter active values", () => {
    render(
      <UnitBrowserFilter
        filters={defaultFilters}
        updateFilter={mockUpdateFilter}
      />,
    );

    expect(screen.getByText("sport (swimming)")).toBeInTheDocument();
    expect(screen.getByText("status (ok)")).toBeInTheDocument();
  });

  it("expands filter options when filter label is clicked", async () => {
    render(
      <UnitBrowserFilter
        filters={defaultFilters}
        updateFilter={mockUpdateFilter}
      />,
    );

    const user = userEvent.setup();
    await user.click(screen.getByTestId("filter-label-sport"));

    expect(screen.getByTestId("filter-options-wrapper")).toBeInTheDocument();
  });

  it("collapses filter options when same filter label is clicked again", async () => {
    render(
      <UnitBrowserFilter
        filters={defaultFilters}
        updateFilter={mockUpdateFilter}
      />,
    );

    // Expand
    const user = userEvent.setup();
    await user.click(screen.getByTestId("filter-label-sport"));
    expect(screen.getByTestId("filter-options-wrapper")).toBeInTheDocument();

    // Collapse
    await user.click(screen.getByTestId("filter-label-sport"));
    expect(
      screen.queryByTestId("filter-options-wrapper"),
    ).not.toBeInTheDocument();
  });

  it("switches between different expanded filters", async () => {
    render(
      <UnitBrowserFilter
        filters={defaultFilters}
        updateFilter={mockUpdateFilter}
      />,
    );

    // Expand sport filter
    const user = userEvent.setup();
    await user.click(screen.getByTestId("filter-label-sport"));
    expect(screen.getByTestId("filter-options-wrapper")).toBeInTheDocument();

    // Switch to status filter - should still show options wrapper but for different filter

    await user.click(screen.getByTestId("filter-label-status"));
    expect(screen.getByTestId("filter-options-wrapper")).toBeInTheDocument();
  });

  it("calls updateFilter when filter option is selected", async () => {
    render(
      <UnitBrowserFilter
        filters={defaultFilters}
        updateFilter={mockUpdateFilter}
      />,
    );

    const user = userEvent.setup();
    // Expand sport filter
    await user.click(screen.getByTestId("filter-label-sport"));

    // Find and click a filter button
    const filterButton = screen.getByTestId("filter-button-skiing");
    await user.click(filterButton);

    expect(mockUpdateFilter).toHaveBeenCalledWith("sport", "skiing");
  });
});

describe("filterEquals utility function", () => {
  it("returns true when objects have same name", () => {
    const a = { name: "sport" };
    const b = { name: "sport" };

    expect(filterEquals(a, b)).toBe(true);
  });

  it("returns false when objects have different names", () => {
    const a = { name: "sport" };
    const b = { name: "status" };

    expect(filterEquals(a, b)).toBe(false);
  });

  it("returns false when one object is null", () => {
    const a = { name: "sport" };
    const b = null;

    expect(filterEquals(a, b)).toBe(false);
    expect(filterEquals(b, a)).toBe(false);
  });

  it("returns false when both objects are null", () => {
    expect(filterEquals(null, null)).toBe(false);
  });
});
