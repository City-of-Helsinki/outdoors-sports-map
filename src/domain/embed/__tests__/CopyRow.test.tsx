import userEvent from "@testing-library/user-event";

import { render, screen } from "../../testingLibraryUtils";
import CopyRow from "../CopyRow";

describe("CopyRow", () => {
  const defaultProps = {
    id: "test-copy",
    label: "URL link",
    value: "http://example.com",
    copyLabel: "Copy URL",
    copiedLabel: "Copied!",
    copied: false,
    onCopy: vi.fn(),
  };

  it("renders label and value", () => {
    render(<CopyRow {...defaultProps} />);
    expect(screen.getByText("URL link")).toBeInTheDocument();
    expect(screen.getByDisplayValue("http://example.com")).toBeInTheDocument();
  });

  it("shows copy label when not copied", () => {
    render(<CopyRow {...defaultProps} copied={false} />);
    expect(screen.getByRole("button", { name: /Copy URL/i })).toBeInTheDocument();
  });

  it("shows copied label when copied", () => {
    render(<CopyRow {...defaultProps} copied={true} />);
    expect(screen.getByRole("button", { name: /Copied!/i })).toBeInTheDocument();
  });

  it("calls onCopy when button is clicked", async () => {
    const onCopy = vi.fn();
    render(<CopyRow {...defaultProps} onCopy={onCopy} />);
    await userEvent.setup().click(screen.getByRole("button"));
    expect(onCopy).toHaveBeenCalledTimes(1);
  });

  it("input is read-only", () => {
    render(<CopyRow {...defaultProps} />);
    expect(screen.getByDisplayValue("http://example.com")).toHaveAttribute("readOnly");
  });

  it("label is associated with input via htmlFor", () => {
    render(<CopyRow {...defaultProps} />);
    expect(screen.getByLabelText("URL link")).toBeInTheDocument();
  });
});
