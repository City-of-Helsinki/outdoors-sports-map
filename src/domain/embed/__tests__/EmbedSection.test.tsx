import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import EmbedSection from "../EmbedSection";

describe("EmbedSection", () => {
  it("renders a section element", () => {
    const { container } = render(
      <EmbedSection headingId="test-heading" title="Test title">
        <span>child</span>
      </EmbedSection>,
    );
    expect(container.querySelector("section")).toBeInTheDocument();
  });

  it("renders the heading with the correct id and text", () => {
    render(
      <EmbedSection headingId="my-heading" title="My Section">
        <span />
      </EmbedSection>,
    );
    const heading = screen.getByRole("heading", { name: "My Section" });
    expect(heading).toHaveAttribute("id", "my-heading");
  });

  it("renders children inside the section", () => {
    render(
      <EmbedSection headingId="h" title="T">
        <button>click me</button>
      </EmbedSection>,
    );
    expect(screen.getByRole("button", { name: "click me" })).toBeInTheDocument();
  });
});
