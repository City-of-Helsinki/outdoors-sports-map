import { forwardRef } from "react";
import { describe, expect, it, vi, beforeEach } from "vitest";

import { render, screen } from "../../testingLibraryUtils";
import EmbedMap from "../EmbedMap";
import { Unit } from "../../unit/types";

// ─── Hoisted spies ───────────────────────────────────────────────────────────

const { isRetinaSpy, mapUnitsSpy } = vi.hoisted(() => ({
  isRetinaSpy: vi.fn(() => false),
  mapUnitsSpy: vi.fn(),
}));

// ─── Mocks ───────────────────────────────────────────────────────────────────

vi.mock("react-leaflet", () => ({
  MapContainer: forwardRef(({ children }: { children: React.ReactNode }, _ref) => (
    <div data-testid="map-container">{children}</div>
  )),
  TileLayer: () => null,
  ZoomControl: ({ zoomInTitle, zoomOutTitle }: { zoomInTitle: string; zoomOutTitle: string }) => (
    <div data-testid="zoom-control" data-zoom-in={zoomInTitle} data-zoom-out={zoomOutTitle} />
  ),
}));

vi.mock("../../map/MapUnits", () => ({
  default: (props: { units: unknown[]; zoomLevel: number; selectedUnit?: Unit; openUnit: (id: string) => void }) => {
    mapUnitsSpy(props);
    return <div data-testid="map-units" data-count={props.units.length} />;
  },
}));

vi.mock("../../utils", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../../utils")>();
  return { ...actual, isRetina: isRetinaSpy };
});

// ─── Helpers ─────────────────────────────────────────────────────────────────

const defaultProps = {
  units: [],
  position: [60.17, 24.94] as [number, number],
  isLoading: false,
  activeLanguage: "fi",
};

function renderEmbedMap(overrides?: Partial<typeof defaultProps & { targetZoom?: number }>) {
  return render(<EmbedMap {...defaultProps} {...overrides} />);
}

function lastMapUnitsProps() {
  const calls = mapUnitsSpy.mock.calls;
  return calls[calls.length - 1]?.[0] as Parameters<typeof mapUnitsSpy>[0];
}

// ─── Tests ───────────────────────────────────────────────────────────────────

describe("EmbedMap", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    isRetinaSpy.mockReturnValue(false);
  });

  it("renders the map container", () => {
    renderEmbedMap();
    expect(screen.getByTestId("map-container")).toBeInTheDocument();
  });

  it("has an aria-label on the map container element", () => {
    renderEmbedMap();
    expect(document.getElementById("map-view")).toHaveAttribute("aria-label");
  });

  it("renders the zoom control", () => {
    renderEmbedMap();
    expect(screen.getByTestId("zoom-control")).toBeInTheDocument();
  });

  it("zoom control titles are non-empty translated strings", () => {
    renderEmbedMap();
    const zc = screen.getByTestId("zoom-control");
    expect(zc.getAttribute("data-zoom-in")).toBeTruthy();
    expect(zc.getAttribute("data-zoom-out")).toBeTruthy();
  });

  it("passes units to MapUnits", () => {
    const units = [
      { id: "1", name: { fi: "Unit 1" } },
      { id: "2", name: { fi: "Unit 2" } },
    ] as never[];
    renderEmbedMap({ units });
    expect(screen.getByTestId("map-units")).toHaveAttribute("data-count", "2");
  });

  it("passes selectedUnit to MapUnits when provided", () => {
    const selected = { id: "99" } as Unit;
    renderEmbedMap({ selectedUnit: selected } as never);
    expect(lastMapUnitsProps().selectedUnit).toBe(selected);
  });

  it("passes undefined selectedUnit to MapUnits when omitted", () => {
    renderEmbedMap();
    expect(lastMapUnitsProps().selectedUnit).toBeUndefined();
  });

  it("passes onSelectUnit callback to MapUnits when provided", () => {
    const onSelectUnit = vi.fn();
    renderEmbedMap({ onSelectUnit } as never);
    lastMapUnitsProps().openUnit("42");
    expect(onSelectUnit).toHaveBeenCalledWith("42");
  });

  it("passes a no-op to MapUnits when onSelectUnit is omitted", () => {
    renderEmbedMap();
    // Calling the default no-op must not throw
    expect(() => lastMapUnitsProps().openUnit("42")).not.toThrow();
  });

  it("passes targetZoom to MapUnits as zoomLevel", () => {
    renderEmbedMap({ targetZoom: 14 } as never);
    expect(lastMapUnitsProps().zoomLevel).toBe(14);
  });

  it("shows loading overlay when isLoading is true", () => {
    renderEmbedMap({ isLoading: true });
    expect(document.querySelector(".map-view-loading-overlay")).toBeInTheDocument();
  });

  it("hides loading overlay when isLoading is false", () => {
    renderEmbedMap({ isLoading: false });
    expect(document.querySelector(".map-view-loading-overlay")).not.toBeInTheDocument();
  });
});
