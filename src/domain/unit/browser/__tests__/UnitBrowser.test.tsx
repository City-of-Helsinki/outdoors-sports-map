import { render, screen } from "../../../testingLibraryUtils";
import UnitBrowser from "../UnitBrowser";

// Mock child components to focus on the loading logic
vi.mock("../UnitBrowserHeader", () => ({
  default: function MockUnitBrowserHeader() {
    return <div data-testid="unit-browser-header">Header</div>;
  },
}));

vi.mock("../UnitBrowserFilterSection", () => ({
  default: function MockUnitBrowserFilterSection() {
    return <div data-testid="unit-browser-filter-section">Filter Section</div>;
  },
}));

vi.mock("../resultList/UnitBrowserResultList", () => ({
  default: function MockUnitBrowserResultList() {
    return <div data-testid="unit-browser-result-list">Result List</div>;
  },
}));

describe("UnitBrowser", () => {
  const mockOnViewChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
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
      api: {
        queries: {
          'getServices(undefined)': {
            status: 'fulfilled',
            endpointName: 'getServices',
            requestId: 'test-request-id',
            originalArgs: undefined,
            startedTimeStamp: Date.now(),
            fulfilledTimeStamp: Date.now(),
            data: { byId: {}, all: [] },
          },
        },
        mutations: {},
        provided: {},
        subscriptions: {},
        config: {
          online: true,
          focused: true,
          middlewareRegistered: true,
          refetchOnFocus: false,
          refetchOnReconnect: false,
          refetchOnMountOrArgChange: false,
          keepUnusedDataFor: 60,
          reducerPath: 'api',
        },
      },
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
