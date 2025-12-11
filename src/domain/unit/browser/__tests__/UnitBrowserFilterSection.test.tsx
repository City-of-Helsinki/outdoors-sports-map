import { render, screen, userEvent } from "../../../testingLibraryUtils";
import UnitBrowserFilterSection from "../UnitBrowserFilterSection";

// Mock the hooks
const mockDoSearch = jest.fn();
const mockUseAppSearch = jest.fn();

jest.mock("../../../../common/hooks/useDoSearch", () => ({
  __esModule: true,
  default: () => mockDoSearch,
}));

jest.mock("../../../app/useAppSearch", () => ({
  __esModule: true,
  default: () => mockUseAppSearch(),
}));

// Mock child components with simple implementations
jest.mock("../UnitBrowserAddressBar", () => {
  return function MockUnitBrowserAddressBar() {
    return <div data-testid="unit-browser-address-bar">Address Bar</div>;
  };
});

jest.mock("../filter/UnitBrowserFilter", () => {
  return function MockUnitBrowserFilters() {
    return <div data-testid="unit-browser-filters">Main Filters</div>;
  };
});

jest.mock("../filter/UnitBrowserToggleFilters", () => {
  return function MockUnitBrowserToggleFilters({ name }: any) {
    return <div data-testid={`toggle-filters-${name}`}>Toggle Filters</div>;
  };
});

jest.mock("../filter/supportingServices/HikingFilter", () => {
  return function MockHikingFilter({ handleHikingSelect, isSelected }: any) {
    return (
      <div data-testid="hiking-filter">
        <button
          onClick={() => handleHikingSelect(!isSelected)}
          data-testid="hiking-toggle"
        >
          Hiking {isSelected ? "Selected" : "Not Selected"}
        </button>
      </div>
    );
  };
});

// Mock unit helpers with simple return values
jest.mock("../../unitHelpers", () => ({
  getOnSeasonSportFilters: () => [{ value: "skiing", label: "Skiing" }],
  getSportSpecificationFilters: () => [
    { value: "cross-country", label: "Cross Country" },
  ],
}));

describe("UnitBrowserFilterSection", () => {
  const mockOnViewChange = jest.fn();
  const defaultAddress = {
    location: {
      coordinates: [60.1699, 24.9384] as [number, number],
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAppSearch.mockReturnValue({
      sport: null,
      status: null,
      sportSpecification: [],
    });
  });

  it("renders main components", () => {
    render(
      <UnitBrowserFilterSection
        address={null}
        onViewChange={mockOnViewChange}
      />,
    );

    expect(screen.getByTestId("unit-browser-filters")).toBeInTheDocument();
    expect(screen.getByTestId("hiking-filter")).toBeInTheDocument();
  });

  it("shows skiing sub-filters when skiing is selected", () => {
    mockUseAppSearch.mockReturnValue({
      sport: "ski",
      status: null,
      sportSpecification: [],
    });

    render(
      <UnitBrowserFilterSection
        address={null}
        onViewChange={mockOnViewChange}
      />,
    );

    expect(
      screen.getByTestId("toggle-filters-sportSpecification"),
    ).toBeInTheDocument();
  });

  it("handles hiking selection state", async () => {
    render(
      <UnitBrowserFilterSection
        address={null}
        onViewChange={mockOnViewChange}
      />,
    );

    expect(screen.getByText("Hiking Not Selected")).toBeInTheDocument();

    const user = userEvent.setup();
    await user.click(screen.getByTestId("hiking-toggle"));

    // After clicking, hiking sub-filters should appear
    expect(
      screen.getByTestId("toggle-filters-sportSpecification"),
    ).toBeInTheDocument();
  });

  it("shows address bar when address is provided", () => {
    render(
      <UnitBrowserFilterSection
        address={defaultAddress}
        onViewChange={mockOnViewChange}
      />,
    );

    expect(screen.getByTestId("unit-browser-address-bar")).toBeInTheDocument();
  });

  it("hides address bar when address is null", () => {
    render(
      <UnitBrowserFilterSection
        address={null}
        onViewChange={mockOnViewChange}
      />,
    );

    expect(
      screen.queryByTestId("unit-browser-address-bar"),
    ).not.toBeInTheDocument();
  });

  it("hides address bar when address is empty object", () => {
    render(
      <UnitBrowserFilterSection
        address={{} as any}
        onViewChange={mockOnViewChange}
      />,
    );

    expect(
      screen.queryByTestId("unit-browser-address-bar"),
    ).not.toBeInTheDocument();
  });
});
