import { describe, expect, it, vi } from "vitest";
import userEvent from "@testing-library/user-event";

import { render, screen } from "../../testingLibraryUtils";
import EmbedUnitPanel from "../EmbedUnitPanel";
import { Unit } from "../../unit/types";

// ─── Mocks ───────────────────────────────────────────────────────────────────

vi.mock("../../service/state/serviceSlice", () => ({
  selectServicesObject: () => ({}),
}));

vi.mock("../unit/UnitIcon", () => ({
  default: ({ alt }: { alt: string }) => <img alt={alt} data-testid="unit-icon" />,
}));

vi.mock("../unit/UnitObservationStatus", () => ({
  default: () => <div data-testid="unit-observation-status" />,
  StatusUpdated: ({ time }: { time: string }) => (
    <div data-testid="status-updated">{time}</div>
  ),
  StatusUpdatedAgo: ({ time }: { time: string }) => (
    <div data-testid="status-updated-ago">{time}</div>
  ),
}));

// ─── Fixtures ────────────────────────────────────────────────────────────────

const baseUnit: Unit = {
  id: "1",
  name: { fi: "Testipaikka", sv: "Testplats", en: "Test Place" },
  description: { fi: "", sv: "", en: "" },
  location: { coordinates: [24.94, 60.17] },
  street_address: { fi: "Testikatu 1", sv: "Testgatan 1", en: "Test Street 1" },
  address_zip: "00100",
  municipality: "Helsinki",
  services: [],
  observations: [],
  www: { fi: "", sv: "", en: "" },
  connections: [],
  geometry: { type: "Point", coordinates: [24.94, 60.17] },
  extra: {},
};

// ─── Tests ───────────────────────────────────────────────────────────────────

describe("EmbedUnitPanel", () => {
  it("renders the unit name", () => {
    render(<EmbedUnitPanel unit={baseUnit} onClose={vi.fn()} />);
    expect(screen.getByRole("heading", { name: /Testipaikka/i })).toBeInTheDocument();
  });

  it("renders the street address", () => {
    render(<EmbedUnitPanel unit={baseUnit} onClose={vi.fn()} />);
    expect(screen.getByText(/Testikatu 1/)).toBeInTheDocument();
  });

  it("renders zip and municipality", () => {
    render(<EmbedUnitPanel unit={baseUnit} onClose={vi.fn()} />);
    expect(screen.getByText(/00100/)).toBeInTheDocument();
    expect(screen.getByText(/Helsinki/)).toBeInTheDocument();
  });

  it("calls onClose when close button is clicked", async () => {
    const onClose = vi.fn();
    render(<EmbedUnitPanel unit={baseUnit} onClose={onClose} />);
    await userEvent.setup().click(screen.getByRole("button"));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("renders complementary landmark region", () => {
    render(<EmbedUnitPanel unit={baseUnit} onClose={vi.fn()} />);
    expect(screen.getByRole("complementary")).toBeInTheDocument();
  });

  it("renders route and service map links", () => {
    render(<EmbedUnitPanel unit={baseUnit} onClose={vi.fn()} />);
    expect(document.querySelector('a[href*="reittiopas.hsl.fi"]')).toBeInTheDocument();
    expect(document.querySelector('a[href*="palvelukartta.hel.fi"]')).toBeInTheDocument();
  });

  it("renders phone link when unit has a phone number", () => {
    const unit = { ...baseUnit, phone: "+358401234567" };
    render(<EmbedUnitPanel unit={unit} onClose={vi.fn()} />);
    expect(screen.getByRole("link", { name: "+358401234567" })).toHaveAttribute(
      "href",
      "tel:+358401234567"
    );
  });

  it("does not render phone section when unit has no phone or www", () => {
    render(<EmbedUnitPanel unit={baseUnit} onClose={vi.fn()} />);
    // No phone link should exist
    expect(screen.queryByRole("link", { name: /^\+/ })).not.toBeInTheDocument();
  });

  it("shows notice observation when present", () => {
    const unit: Unit = {
      ...baseUnit,
      observations: [
        {
          property: ["notice"],
          primary: false,
          quality: "good",
          name: { fi: "Huomio", sv: "", en: "" },
          value: { fi: "Suljettu", sv: "", en: "" },
          time: "2024-01-01T12:00:00Z",
        },
      ],
    };
    render(<EmbedUnitPanel unit={unit} onClose={vi.fn()} />);
    expect(screen.getByText(/Suljettu/)).toBeInTheDocument();
  });

  it("shows temperature observation when present", () => {
    const unit: Unit = {
      ...baseUnit,
      observations: [
        {
          property: ["temperature"],
          primary: false,
          quality: "good",
          name: { fi: "18 °C", sv: "", en: "" },
          value: "18",
          time: "2024-01-01T12:00:00Z",
        },
      ],
    };
    render(<EmbedUnitPanel unit={unit} onClose={vi.fn()} />);
    // Shows the name (non-live temperature renders name.fi)
    expect(screen.getByText("18 °C")).toBeInTheDocument();
  });
});
