import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi, beforeEach } from "vitest";

import { render, screen, fireEvent } from "../../testingLibraryUtils";
import AppEmbedToolModal from "../AppEmbedToolModal";

// ─── Mocks ───────────────────────────────────────────────────────────────────

// VenueSearch uses RTK Query internally; stub it to keep tests focused
vi.mock("../../embed/VenueSearch", () => ({
  default: ({ onSelect }: { onSelect: (id: string, name: string) => void }) => (
    <input
      data-testid="venue-search"
      placeholder="venue-search"
      onChange={(e) => onSelect(e.target.value, e.target.value)}
    />
  ),
}));

// ─── Helpers ─────────────────────────────────────────────────────────────────

const defaultProps = { show: true, onClose: vi.fn() };

function renderModal(overrides?: Partial<typeof defaultProps>) {
  return render(<AppEmbedToolModal {...defaultProps} {...overrides} />);
}

// ─── Tests ───────────────────────────────────────────────────────────────────

describe("AppEmbedToolModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders nothing when show is false", () => {
    renderModal({ show: false });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("renders the dialog when show is true", () => {
    renderModal();
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("renders the title", () => {
    renderModal();
    expect(
      screen.getByRole("heading", { name: "Upotustyökalu" })
    ).toBeInTheDocument();
  });

  it("calls onClose when the close button is clicked", async () => {
    const onClose = vi.fn();
    renderModal({ onClose });
    // The modal has two close buttons (header and footer); click the first
    await userEvent.setup().click(screen.getAllByRole("button", { name: "Sulje upotustyökalu" })[0]);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when Escape is pressed", async () => {
    const onClose = vi.fn();
    renderModal({ onClose });
    await userEvent.setup().keyboard("{Escape}");
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("renders language radio buttons", () => {
    renderModal();
    expect(screen.getByRole("radio", { name: "Suomi" })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "Ruotsi" })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "Englanti" })).toBeInTheDocument();
  });

  it("renders content type radio buttons", () => {
    renderModal();
    expect(screen.getByRole("radio", { name: /kartta ilman/i })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: /tietyn lajin/i })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: /yksittäinen/i })).toBeInTheDocument();
  });

  it("shows the sport select when 'Tietyn lajin kohteet' is chosen", () => {
    renderModal();
    // fireEvent avoids userEvent's synthetic focus/pointer machinery that hangs on HDS radios
    fireEvent.click(screen.getByRole("radio", { name: /tietyn lajin/i }));
    expect(
      screen.getByRole("combobox", { name: /valitse laji/i })
    ).toBeInTheDocument();
  });

  it("hides the sport select when switching back to all content", () => {
    renderModal();
    fireEvent.click(screen.getByRole("radio", { name: /tietyn lajin/i }));
    fireEvent.click(screen.getByRole("radio", { name: /kartta ilman/i }));
    expect(
      screen.queryByRole("combobox", { name: /valitse laji/i })
    ).not.toBeInTheDocument();
  });

  it("shows venue search when 'Yksittäinen kohde' is chosen", () => {
    renderModal();
    fireEvent.click(screen.getByRole("radio", { name: /yksittäinen/i }));
    expect(screen.getByTestId("venue-search")).toBeInTheDocument();
  });

  it("shows width pixel input when fixed width mode is selected", () => {
    renderModal();
    fireEvent.click(screen.getByRole("radio", { name: /kiinteä leveys/i }));
    expect(screen.getByRole("spinbutton", { name: "Leveys" })).toBeInTheDocument();
  });

  it("updates the preview dimensions when width and height change", () => {
    renderModal();
    fireEvent.click(screen.getByRole("radio", { name: /kiinteä leveys/i }));
    fireEvent.click(screen.getByRole("radio", { name: /absoluuttinen \(pikselit\)/i }));

    const widthInput = screen.getByRole("spinbutton", { name: "Leveys" });
    const heightInput = screen.getByRole("spinbutton", { name: "Korkeus" });
    fireEvent.change(widthInput, { target: { value: "400" } });
    fireEvent.change(heightInput, { target: { value: "300" } });

    const previewFrame = document.querySelector(
      ".embed-tool-modal__preview-frame",
    );
    expect(previewFrame).toHaveStyle({
      width: "400px",
      aspectRatio: "400 / 300",
    });
  });

  it("renders the preview iframe", () => {
    renderModal();
    expect(
      screen.getByTitle("Kartan esikatselu")
    ).toBeInTheDocument();
  });

  it("renders the copy URL button", () => {
    renderModal();
    expect(screen.getByRole("button", { name: "Kopioi URL" })).toBeInTheDocument();
  });

  it("renders the copy HTML button", () => {
    renderModal();
    expect(screen.getByRole("button", { name: "Kopioi HTML-koodi" })).toBeInTheDocument();
  });
});
