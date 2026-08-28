import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { render, screen } from "../../testingLibraryUtils";
import AppMapToolsPanel from "../AppMapToolsPanel";

describe("<AppMapToolsPanel />", () => {
  const onClose = vi.fn();
  const onOpenEmbedTool = vi.fn();

  const renderPanel = (focusAfterCloseRef?: React.RefObject<HTMLElement>) =>
    render(
      <AppMapToolsPanel
        onClose={onClose}
        onOpenEmbedTool={onOpenEmbedTool}
        focusAfterCloseRef={focusAfterCloseRef}
      />,
    );

  afterEach(() => vi.clearAllMocks());

  it("renders the menu with accessible role and name", () => {
    renderPanel();
    expect(
      screen.getByRole("menu", { name: /karttaty/i }),
    ).toBeInTheDocument();
  });

  it("renders the embedding tool menuitem", () => {
    renderPanel();
    expect(
      screen.getByRole("menuitem", { name: /upotusty/i }),
    ).toBeInTheDocument();
  });

  it("focuses the first menuitem on mount", () => {
    renderPanel();
    expect(screen.getByRole("menuitem", { name: /upotusty/i })).toHaveFocus();
  });

  it("renders no close button (menu closes via Escape / outside click)", () => {
    renderPanel();
    expect(
      screen.queryByRole("button", { name: /sulje/i }),
    ).not.toBeInTheDocument();
  });

  it("calls onOpenEmbedTool (not onClose) when embedding tool is clicked", async () => {
    renderPanel();
    await userEvent.setup().click(screen.getByRole("menuitem", { name: /upotusty/i }));
    expect(onOpenEmbedTool).toHaveBeenCalledTimes(1);
    expect(onClose).not.toHaveBeenCalled();
  });

  it("calls onClose when Escape is pressed", async () => {
    renderPanel();
    await userEvent.setup().keyboard("{Escape}");
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("wraps focus from the last to the first menuitem on ArrowDown", async () => {
    renderPanel();
    const item = screen.getByRole("menuitem", { name: /upotusty/i });
    item.focus();
    await userEvent.setup().keyboard("{ArrowDown}");
    expect(item).toHaveFocus();
  });

  it("closes when clicking outside the panel", async () => {
    render(<div data-testid="outside">outside</div>);
    renderPanel();
    await userEvent.setup().click(screen.getByTestId("outside"));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("does not close when clicking the trigger element", async () => {
    function Wrapper() {
      const triggerRef = { current: null } as React.RefObject<HTMLElement>;
      return (
        <>
          <button ref={triggerRef as React.RefObject<HTMLButtonElement>}>trigger</button>
          <AppMapToolsPanel
            onClose={onClose}
            onOpenEmbedTool={onOpenEmbedTool}
            focusAfterCloseRef={triggerRef}
          />
        </>
      );
    }
    render(<Wrapper />);
    await userEvent.setup().click(screen.getByRole("button", { name: "trigger" }));
    expect(onClose).not.toHaveBeenCalled();
  });
});
