import { render as renderRTL } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it, vi, beforeEach } from "vitest";

import { screen } from "../../testingLibraryUtils";

import LanguageAwareRoutes from "../AppLanguageAwareRoutes";

// ─── Hoisted mocks ───────────────────────────────────────────────────────────

const { mockUseLanguage, mockUseRouteMatch, mockReplaceLanguageInPath } =
  vi.hoisted(() => ({
    mockUseLanguage: vi.fn(() => "fi"),
    mockUseRouteMatch: vi.fn(() => ({ params: { language: "fi" } })),
    mockReplaceLanguageInPath: vi.fn((path: string) => path),
  }));

// ─── Mocks ───────────────────────────────────────────────────────────────────

vi.mock("../../../common/hooks/useLanguage", () => ({ default: mockUseLanguage }));

vi.mock("../../../common/utils/pathUtils", () => ({
  replaceLanguageInPath: mockReplaceLanguageInPath,
}));

vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router-dom")>();
  return { ...actual, useRouteMatch: mockUseRouteMatch };
});

// Stub heavy routed components to keep tests fast and focused
vi.mock("../../embed/EmbedView", () => ({
  default: () => <div data-testid="embed-view" />,
}));

vi.mock("../../home/HomeContainer", () => ({
  default: () => <div data-testid="home-container" />,
}));

// ─── Helpers ─────────────────────────────────────────────────────────────────

function renderAt(url: string) {
  return renderRTL(
    <MemoryRouter initialEntries={[url]}>
      <LanguageAwareRoutes />
    </MemoryRouter>
  );
}

// ─── Tests ───────────────────────────────────────────────────────────────────

describe("LanguageAwareRoutes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseLanguage.mockReturnValue("fi");
    mockUseRouteMatch.mockReturnValue({ params: { language: "fi" } });
  });

  describe("routing", () => {
    it("renders EmbedView for the embed route", () => {
      renderAt("/fi/embed");
      expect(screen.getByTestId("embed-view")).toBeInTheDocument();
    });

    it("does not render HomeContainer on the embed route", () => {
      renderAt("/fi/embed");
      expect(screen.queryByTestId("home-container")).not.toBeInTheDocument();
    });

    it("renders HomeContainer for the language root", () => {
      renderAt("/fi");
      expect(screen.getByTestId("home-container")).toBeInTheDocument();
    });

    it("renders EmbedView for other supported languages", () => {
      mockUseRouteMatch.mockReturnValue({ params: { language: "en" } });
      mockUseLanguage.mockReturnValue("en");
      renderAt("/en/embed");
      expect(screen.getByTestId("embed-view")).toBeInTheDocument();
    });
  });

  describe("language redirect effect", () => {
    it("computes redirect path when route language differs from active language", () => {
      mockUseRouteMatch.mockReturnValue({ params: { language: "sv" } });
      mockUseLanguage.mockReturnValue("fi");
      renderAt("/sv");
      expect(mockReplaceLanguageInPath).toHaveBeenCalledWith(
        expect.any(String),
        "sv"
      );
    });

    it("does not redirect when route language matches active language", () => {
      mockUseRouteMatch.mockReturnValue({ params: { language: "fi" } });
      mockUseLanguage.mockReturnValue("fi");
      renderAt("/fi");
      expect(mockReplaceLanguageInPath).not.toHaveBeenCalled();
    });

    it("does not redirect when useRouteMatch returns null", () => {
      mockUseRouteMatch.mockReturnValue(null);
      renderAt("/fi");
      expect(mockReplaceLanguageInPath).not.toHaveBeenCalled();
    });
  });
});
