import { render, screen } from "../../../testingLibraryUtils";
import UnitBrowser from "../UnitBrowser";

// Mock child components to focus on the loading logic
jest.mock("../UnitBrowserHeader", () => {
  return function MockUnitBrowserHeader() {
    return <div data-testid="unit-browser-header">Header</div>;
  };
});

jest.mock("../UnitBrowserFilterSection", () => {
  return function MockUnitBrowserFilterSection() {
    return <div data-testid="unit-browser-filter-section">Filter Section</div>;
  };
});

jest.mock("../resultList/UnitBrowserResultList", () => {
  return function MockUnitBrowserResultList() {
    return <div data-testid="unit-browser-result-list">Result List</div>;
  };
});

describe("UnitBrowser", () => {
  const mockOnViewChange = jest.fn();

  beforeEach(() => {
    mockOnViewChange.mockClear();
  });

  it("renders filter section in default state", () => {
    render(<UnitBrowser onViewChange={mockOnViewChange} />);

    // In default state (not loading), filter section should be visible
    expect(
      screen.getByTestId("unit-browser-filter-section"),
    ).toBeInTheDocument();
  });

  it("hides filter section when loading", () => {
    // Create state that triggers loading = true (unit.isFetching=true AND unit.all is empty)
    const loadingState = {
      unit: {
        isFetching: true,
        all: [], // Empty array triggers loading state
        fetchError: null,
        byId: {},
        iceskate: [],
        ski: [],
        swim: [],
        iceswim: [],
        sledding: [],
        status_ok: [],
        hike: [],
      },
      service: {
        isFetching: false,
        all: [],
        fetchError: null,
        byId: {},
      },
    } as any; // Use type assertion to bypass strict typing for test

    render(<UnitBrowser onViewChange={mockOnViewChange} />, {}, loadingState);

    // When loading, filter section should not be visible
    expect(
      screen.queryByTestId("unit-browser-filter-section"),
    ).not.toBeInTheDocument();
    // But header should still be visible
    expect(screen.getByTestId("unit-browser-header")).toBeInTheDocument();
  });
});
