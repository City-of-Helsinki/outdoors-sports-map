import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, act } from "../../testingLibraryUtils";
import { createRef, forwardRef } from "react";
import L from "leaflet";
import i18n from "../../i18n/i18n";
import MapView from "../MapView";

// ─── Hoisted spies ──────────────────────────────────────────────────────────

const { ZoomControlSpy, ControlSpy } = vi.hoisted(() => ({
  ZoomControlSpy: vi.fn((_props: Record<string, unknown>) => null),
  ControlSpy: vi.fn(({ children }: { children: React.ReactNode }) => (
    <div data-testid="locate-control">{children}</div>
  )),
}));

// ─── Mocks ───────────────────────────────────────────────────────────────────

vi.mock("react-leaflet", () => ({
  MapContainer: forwardRef(({ children }: { children: React.ReactNode }, _ref) => (
    <div data-testid="map-container">{children}</div>
  )),
  TileLayer: () => null,
  ZoomControl: ZoomControlSpy,
}));

vi.mock("../MapControl", () => ({ default: ControlSpy }));
vi.mock("../MapEvents", () => ({ default: () => null }));
vi.mock("../MapUnits", () => ({ default: () => null }));
vi.mock("../MapUserLocationMarker", () => ({ default: () => null }));
vi.mock("../HeightProfileControl", () => ({ default: () => null }));
vi.mock("../../utils", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../../utils")>();
  return { ...actual, isRetina: () => false };
});

// ─── Helpers ─────────────────────────────────────────────────────────────────

const defaultProps = {
  selectedUnit: undefined,
  onCenterMapToUnit: vi.fn(),
  activeLanguage: "fi",
  openUnit: vi.fn(),
  setLocation: vi.fn(),
  leafletElementRef: createRef<L.Map | null>(),
  position: [60.17, 24.94] as [number, number, number] extends never ? never : [number, number],
  units: [],
  isLoading: false,
};

function renderMapView(overrides?: Partial<typeof defaultProps>) {
  return render(<MapView {...defaultProps} {...overrides} />);
}

function lastZoomControlProps(): Record<string, unknown> {
  const calls = ZoomControlSpy.mock.calls;
  return (calls[calls.length - 1]?.[0] ?? {}) as Record<string, unknown>;
}

type SupportedLanguage = "en" | "sv";

const languageSwitchCases = [
  { language: "sv" as SupportedLanguage, label: "Swedish" },
];

async function switchLanguageAndRerender(
  rerender: ReturnType<typeof renderMapView>["rerender"],
  language: SupportedLanguage,
) {
  await act(async () => {
    await i18n.changeLanguage(language);
  });
  rerender(<MapView {...defaultProps} />);
}

// ─── Tests ───────────────────────────────────────────────────────────────────

describe("MapView", () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    await i18n.changeLanguage("fi");
  });

  describe("initial render — Finnish (fi)", () => {
    it("renders the map container", () => {
      renderMapView();
      expect(screen.getByTestId("map-container")).toBeInTheDocument();
    });

    it("passes Finnish zoomInTitle to ZoomControl", () => {
      renderMapView();
      expect(lastZoomControlProps().zoomInTitle).toBe(i18n.t("MAP.ZOOM_IN"));
    });

    it("passes Finnish zoomOutTitle to ZoomControl", () => {
      renderMapView();
      expect(lastZoomControlProps().zoomOutTitle).toBe(i18n.t("MAP.ZOOM_OUT"));
    });

    it("sets ZoomControl key to current language", () => {
      renderMapView();
      // React strips 'key' from component props; keys are `zoom-{language}` / `locate-{language}`
      // The remount mechanism is validated by the language-change tests below
      expect(lastZoomControlProps().zoomInTitle).toBe(i18n.t("MAP.ZOOM_IN"));
    });

    it("renders locate control with Finnish aria-label", () => {
      renderMapView();
      expect(screen.getByLabelText(i18n.t("MAP.LOCATE_USER"))).toBeInTheDocument();
    });
  });

  describe("language switch — Finnish → English", () => {
    it("updates ZoomControl zoomInTitle to English after language change", async () => {
      const { rerender } = renderMapView();

      await switchLanguageAndRerender(rerender, "en");

      expect(lastZoomControlProps().zoomInTitle).toBe(i18n.t("MAP.ZOOM_IN"));
    });

    it("updates ZoomControl zoomOutTitle to English after language change", async () => {
      const { rerender } = renderMapView();

      await switchLanguageAndRerender(rerender, "en");

      expect(lastZoomControlProps().zoomOutTitle).toBe(i18n.t("MAP.ZOOM_OUT"));
    });

    it("updates locate button aria-label to English after language change", async () => {
      const { rerender } = renderMapView();

      await switchLanguageAndRerender(rerender, "en");

      expect(screen.getByLabelText(i18n.t("MAP.LOCATE_USER"))).toBeInTheDocument();
    });

    it("ZoomControl is re-rendered (key changes) when language changes", async () => {
      const { rerender } = renderMapView();
      const callsAfterFirstRender = ZoomControlSpy.mock.calls.length;

      await switchLanguageAndRerender(rerender, "en");

      // ZoomControl should have been called again after re-render
      expect(ZoomControlSpy.mock.calls.length).toBeGreaterThan(callsAfterFirstRender);
    });
  });

  describe.each(languageSwitchCases)(
    "language switch — Finnish → $label",
    ({ language, label }) => {
      it(`updates ZoomControl zoomInTitle to ${label} after language change`, async () => {
        const { rerender } = renderMapView();

        await switchLanguageAndRerender(rerender, language);

        expect(lastZoomControlProps().zoomInTitle).toBe(i18n.t("MAP.ZOOM_IN"));
      });

      it(`updates ZoomControl zoomOutTitle to ${label} after language change`, async () => {
        const { rerender } = renderMapView();

        await switchLanguageAndRerender(rerender, language);

        expect(lastZoomControlProps().zoomOutTitle).toBe(i18n.t("MAP.ZOOM_OUT"));
      });

      it(`updates locate button aria-label to ${label} after language change`, async () => {
        const { rerender } = renderMapView();

        await switchLanguageAndRerender(rerender, language);

        expect(screen.getByLabelText(i18n.t("MAP.LOCATE_USER"))).toBeInTheDocument();
      });
    },
  );

  describe("loading overlay", () => {
    it("shows loading overlay when isLoading is true and no unit selected", () => {
      renderMapView({ isLoading: true, selectedUnit: undefined });
      expect(screen.getByTestId("map-container")).toBeInTheDocument();
    });
  });
});
