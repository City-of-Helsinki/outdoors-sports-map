import { describe, expect, it, vi } from "vitest";
import userEvent from "@testing-library/user-event";

import { render, screen } from "../../testingLibraryUtils";
import VenueSearch from "../VenueSearch";
import { Unit } from "../../unit/types";

// ─── Hoisted mocks ───────────────────────────────────────────────────────────

const { mockSearchSuggestions, mockUseSelector } = vi.hoisted(() => ({
  mockSearchSuggestions: vi.fn(),
  mockUseSelector: vi.fn(),
}));

// ─── Mocks ───────────────────────────────────────────────────────────────────

vi.mock("../../unit/hooks/useSearchSuggestions", () => ({
  useSearchSuggestions: () => ({ searchSuggestions: mockSearchSuggestions }),
}));

vi.mock("react-redux", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-redux")>();
  return { ...actual, useSelector: mockUseSelector };
});

// Render a simple icon stub so HDS icons don't break jsdom
vi.mock("hds-react", async (importOriginal) => {
  const actual = await importOriginal<typeof import("hds-react")>();
  return {
    ...actual,
    IconCrossCircle: () => <span data-testid="icon-cross" />,
  };
});

vi.mock("../unit/UnitIcon", () => ({
  default: () => <div data-testid="unit-icon" />,
}));

vi.mock("../unit/UnitObservationStatus", () => ({
  StatusBar: () => <div data-testid="status-bar" />,
}));

// ─── Fixtures ────────────────────────────────────────────────────────────────

const makeUnit = (id: string, name: string): Unit =>
  ({
    id,
    name: { fi: name, sv: "", en: "" },
    services: [],
    observations: [],
    location: { coordinates: [24.94, 60.17] },
    street_address: { fi: "", sv: "", en: "" },
    www: { fi: "", sv: "", en: "" },
    connections: [],
    geometry: { type: "Point", coordinates: [24.94, 60.17] },
    extra: {},
  }) as unknown as Unit;

const unitA = makeUnit("1", "Paikka A");
const unitB = makeUnit("2", "Paikka B");

// ─── Helpers ─────────────────────────────────────────────────────────────────

function setup(suggestions: Unit[] = []) {
  mockUseSelector.mockReturnValue(suggestions);
  const onSelect = vi.fn();
  render(<VenueSearch onSelect={onSelect} />);
  return { onSelect };
}

// ─── Tests ───────────────────────────────────────────────────────────────────

describe("VenueSearch", () => {
  it("renders a combobox input", () => {
    setup();
    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });

  it("does not show suggestions when input is empty", () => {
    setup([unitA]);
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("shows suggestions after typing", async () => {
    setup([unitA, unitB]);
    await userEvent.setup().type(screen.getByRole("combobox"), "Pai");
    expect(mockSearchSuggestions).toHaveBeenCalledWith("Pai");
    expect(screen.getByRole("listbox")).toBeInTheDocument();
    expect(screen.getAllByRole("option")).toHaveLength(2);
  });

  it("calls onSelect with empty strings when input is cleared by the user", async () => {
    const { onSelect } = setup([unitA]);
    const user = userEvent.setup();
    await user.type(screen.getByRole("combobox"), "Pai");
    await user.clear(screen.getByRole("combobox"));
    expect(onSelect).toHaveBeenLastCalledWith("", "");
  });

  it("shows clear button when there is input text", async () => {
    setup();
    await userEvent.setup().type(screen.getByRole("combobox"), "x");
    expect(screen.getByRole("button")).toBeInTheDocument();
  });

  it("hides clear button when input is empty", () => {
    setup();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("clicking clear button resets the input and hides suggestions", async () => {
    const { onSelect } = setup([unitA]);
    const user = userEvent.setup();
    await user.type(screen.getByRole("combobox"), "Pai");
    await user.click(screen.getByRole("button"));
    expect(screen.getByRole("combobox")).toHaveValue("");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    expect(onSelect).toHaveBeenLastCalledWith("", "");
  });

  it("selects a unit by clicking a suggestion", async () => {
    const { onSelect } = setup([unitA, unitB]);
    const user = userEvent.setup();
    await user.type(screen.getByRole("combobox"), "Pai");
    await user.click(screen.getAllByRole("option")[0]);
    expect(onSelect).toHaveBeenCalledWith("1", "Paikka A");
    expect(screen.getByRole("combobox")).toHaveValue("Paikka A");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("navigates suggestions with ArrowDown and selects with Enter", async () => {
    const { onSelect } = setup([unitA, unitB]);
    const user = userEvent.setup();
    const input = screen.getByRole("combobox");
    await user.type(input, "Pai");
    await user.keyboard("{ArrowDown}{ArrowDown}{Enter}");
    // ArrowDown twice selects index 1 (unitB)
    expect(onSelect).toHaveBeenCalledWith("2", "Paikka B");
  });

  it("closes suggestions with Escape", async () => {
    setup([unitA]);
    const user = userEvent.setup();
    await user.type(screen.getByRole("combobox"), "Pai");
    expect(screen.getByRole("listbox")).toBeInTheDocument();
    await user.keyboard("{Escape}");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("ArrowUp does not go below index -1", async () => {
    setup([unitA]);
    const user = userEvent.setup();
    await user.type(screen.getByRole("combobox"), "Pai");
    await user.keyboard("{ArrowUp}");
    // aria-activedescendant should be absent when activeIndex is -1
    expect(screen.getByRole("combobox")).not.toHaveAttribute(
      "aria-activedescendant"
    );
  });
});
