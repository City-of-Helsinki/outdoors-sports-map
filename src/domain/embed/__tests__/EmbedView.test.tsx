import { describe, expect, it, vi } from "vitest";

import { render, screen } from "../../testingLibraryUtils";
import EmbedView from "../EmbedView";
import { Unit } from "../../unit/types";
import { UnitFilters } from "../../unit/unitConstants";
import { getOffSeasonSportFilters } from "../../unit/unitHelpers";

// ─── Hoisted mocks ───────────────────────────────────────────────────────────

const { mockUseGetUnitByIdQuery, mockUseGetUnitsQuery, mockUseLocation } =
  vi.hoisted(() => ({
    mockUseGetUnitByIdQuery: vi.fn(),
    mockUseGetUnitsQuery: vi.fn(),
    mockUseLocation: vi.fn(),
  }));

// ─── Mocks ───────────────────────────────────────────────────────────────────

vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router-dom")>();
  return { ...actual, useLocation: mockUseLocation };
});

vi.mock("../../unit/state/unitSlice", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../../unit/state/unitSlice")>();
  return {
    ...actual,
    useGetUnitByIdQuery: mockUseGetUnitByIdQuery,
    useGetUnitsQuery: mockUseGetUnitsQuery,
  };
});

// Replace heavy map with a stub so jsdom doesn't choke on Leaflet
vi.mock("../EmbedMap", () => ({
  default: ({
    units,
    isLoading,
  }: {
    units: Unit[];
    isLoading: boolean;
  }) => (
    <div
      data-testid="embed-map"
      data-count={units.length}
      data-loading={String(isLoading)}
    />
  ),
}));

vi.mock("../EmbedUnitPanel", () => ({
  default: ({ unit, onClose }: { unit: Unit; onClose: () => void }) => (
    <div data-testid="embed-unit-panel" data-unit-id={unit.id}>
      <button onClick={onClose}>Close</button>
    </div>
  ),
}));

// ─── Fixtures ────────────────────────────────────────────────────────────────

const mockUnit: Unit = {
  id: "42",
  name: { fi: "Testi", sv: "", en: "" },
  description: { fi: "", sv: "", en: "" },
  location: { coordinates: [24.94, 60.17] },
  street_address: { fi: "", sv: "", en: "" },
  services: [191],
  observations: [],
  www: { fi: "", sv: "", en: "" },
  connections: [],
  geometry: { type: "Point", coordinates: [24.94, 60.17] },
  extra: {},
};

const mockUnits: Unit[] = [
  {
    id: "1",
    services: [191], // SKI_TRACK = SkiingServices
    name: { fi: "Latu 1", sv: "Spår 1", en: "Track 1" },
    location: { coordinates: [25.0, 60.2] },
  } as unknown as Unit,
  {
    id: "2",
    services: [731], // SWIMMING_BEACH = SwimmingServices
    name: { fi: "Ranta 1", sv: "Strand 1", en: "Beach 1" },
    location: { coordinates: [25.1, 60.3] },
  } as unknown as Unit,
  {
    id: "3",
    services: [695], // MECHANICALLY_FROZEN_ICE = IceSkatingServices
    name: { fi: "Kenttä 1", sv: "Plan 1", en: "Rink 1" },
    location: { coordinates: [25.2, 60.1] },
  } as unknown as Unit,
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function isSportOutOfSeason(sport: string | null): boolean {
  return !!sport && getOffSeasonSportFilters().includes(sport);
}

function setupMocks({
  search = "",
  singleUnit = undefined as Unit | undefined,
  isSingleLoading = false,
  unitsData = undefined as { entities: { unit: Record<string, Unit> } } | undefined,
  isUnitsLoading = false,
} = {}) {
  mockUseLocation.mockReturnValue({ search, pathname: "/embed" });
  mockUseGetUnitByIdQuery.mockReturnValue({
    data: singleUnit,
    isLoading: isSingleLoading,
  });
  mockUseGetUnitsQuery.mockReturnValue({
    data: unitsData,
    isLoading: isUnitsLoading,
  });
}

const filterBySport = (units: Unit[], serviceIds: number[]) =>
  units.filter((u) => u.services?.some((s) => serviceIds.includes(s)));

// ─── isSportOutOfSeason ───────────────────────────────────────────────────────

describe("isSportOutOfSeason", () => {
  it("returns false for null sport", () => {
    expect(isSportOutOfSeason(null)).toBe(false);
  });

  it("returns false for unknown sport string", () => {
    expect(isSportOutOfSeason("unknown_sport")).toBe(false);
  });

  // Swimming is a summer sport (May–Oct). August 2026 is in season.
  it("returns false for swimming in August (summer season active)", () => {
    expect(isSportOutOfSeason(UnitFilters.SWIMMING)).toBe(false);
  });

  // Skiing is a winter sport (Nov–Apr). August 2026 is out of season.
  it("returns true for skiing in August (winter season inactive)", () => {
    expect(isSportOutOfSeason(UnitFilters.SKIING)).toBe(true);
  });

  it("returns true for ice_skating in August", () => {
    expect(isSportOutOfSeason(UnitFilters.ICE_SKATING)).toBe(true);
  });

  it("returns true for sledding in August", () => {
    expect(isSportOutOfSeason(UnitFilters.SLEDDING)).toBe(true);
  });

  it("returns true for ice_swimming in August", () => {
    expect(isSportOutOfSeason(UnitFilters.ICE_SWIMMING)).toBe(true);
  });
});

// ─── Unit filtering logic ─────────────────────────────────────────────────────

describe("embed unit filtering logic", () => {
  it("filters only skiing units by service ID 191", () => {
    const result = filterBySport(mockUnits, [191, 318]);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("1");
  });

  it("filters only swimming units by service ID 731", () => {
    const result = filterBySport(mockUnits, [731, 730, 426]);
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("2");
  });

  it("returns empty array when no units match service IDs", () => {
    const result = filterBySport(mockUnits, [1083]); // SleddingServices
    expect(result).toHaveLength(0);
  });
});

// ─── EmbedView component ──────────────────────────────────────────────────────

describe("EmbedView", () => {
  it("renders the map when no unitId param is given", () => {
    setupMocks();
    render(<EmbedView />);
    expect(screen.getByTestId("embed-map")).toBeInTheDocument();
  });

  it("waits for unit data before rendering map when unitId is provided", () => {
    // singleUnit not yet loaded → mapReady is false → shows loading spinner
    setupMocks({ search: "?unit=42", isSingleLoading: true });
    render(<EmbedView />);
    expect(screen.queryByTestId("embed-map")).not.toBeInTheDocument();
    expect(document.querySelector(".embed-view__loading")).toBeInTheDocument();
  });

  it("renders the map once the single unit has loaded", () => {
    setupMocks({ search: "?unit=42", singleUnit: mockUnit });
    render(<EmbedView />);
    expect(screen.getByTestId("embed-map")).toBeInTheDocument();
  });

  it("passes the loaded unit to EmbedMap", () => {
    setupMocks({ search: "?unit=42", singleUnit: mockUnit });
    render(<EmbedView />);
    expect(screen.getByTestId("embed-map")).toHaveAttribute("data-count", "1");
  });

  it("shows loading indicator while fetching units by sport", () => {
    setupMocks({ search: "?sport=skiing", isUnitsLoading: true });
    render(<EmbedView />);
    expect(screen.getByTestId("embed-map")).toHaveAttribute("data-loading", "true");
  });

  it("does not render EmbedUnitPanel initially", () => {
    setupMocks();
    render(<EmbedView />);
    expect(screen.queryByTestId("embed-unit-panel")).not.toBeInTheDocument();
  });

  it("shows the season-ended notice for out-of-season sports", () => {
    // UnitFilters.SKIING = "ski"
    setupMocks({ search: `?sport=${UnitFilters.SKIING}` });
    render(<EmbedView />);
    // HDS LoadingSpinner also uses role="status", so target the specific class
    expect(document.querySelector(".embed-view__season-ended")).toBeInTheDocument();
  });

  it("does not show season-ended notice for in-season sports", () => {
    // UnitFilters.SWIMMING = "swim"
    setupMocks({ search: `?sport=${UnitFilters.SWIMMING}` });
    render(<EmbedView />);
    expect(document.querySelector(".embed-view__season-ended")).not.toBeInTheDocument();
  });
});
