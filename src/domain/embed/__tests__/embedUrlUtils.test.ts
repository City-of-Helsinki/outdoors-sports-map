import { describe, expect, it, beforeEach, afterEach, vi } from "vitest";

import {
  DEFAULT_RELATIVE_HEIGHT,
  DEFAULT_ABSOLUTE_HEIGHT,
  DEFAULT_WIDTH_PX,
} from "../embedConstants";
import { buildEmbedUrl, buildHtmlCode } from "../embedUrlUtils";

// ─── buildEmbedUrl ───────────────────────────────────────────────────────────

describe("buildEmbedUrl", () => {
  beforeEach(() => {
    Object.defineProperty(window, "location", {
      value: { origin: "https://example.com" },
      writable: true,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns a unit URL when unitId is provided", () => {
    expect(buildEmbedUrl("fi", "all", "123")).toBe(
      "https://example.com/fi/embed?unit=123"
    );
  });

  it("encodes special characters in unitId", () => {
    expect(buildEmbedUrl("en", "all", "a b")).toBe(
      "https://example.com/en/embed?unit=a%20b"
    );
  });

  it("trims whitespace from unitId", () => {
    expect(buildEmbedUrl("fi", "all", "  42  ")).toBe(
      "https://example.com/fi/embed?unit=42"
    );
  });

  it("returns a sport URL when sport is not 'all' and unitId is empty", () => {
    expect(buildEmbedUrl("fi", "skiing", "")).toBe(
      "https://example.com/fi/embed?sport=skiing"
    );
  });

  it("encodes special characters in sport", () => {
    expect(buildEmbedUrl("fi", "ice skating", "")).toBe(
      "https://example.com/fi/embed?sport=ice%20skating"
    );
  });

  it("returns the base embed URL when sport is 'all' and unitId is empty", () => {
    expect(buildEmbedUrl("sv", "all", "")).toBe(
      "https://example.com/sv/embed"
    );
  });

  it("uses unitId over sport when both are provided", () => {
    // unitId takes priority
    expect(buildEmbedUrl("fi", "skiing", "99")).toBe(
      "https://example.com/fi/embed?unit=99"
    );
  });
});

// ─── buildHtmlCode ───────────────────────────────────────────────────────────

const URL = "https://example.com/fi/embed";
const TITLE = "Test embed";

describe("buildHtmlCode – relative height mode", () => {
  it("wraps iframe in a padding-bottom div", () => {
    const html = buildHtmlCode(URL, "auto", "", "relative", "56.3", TITLE);
    expect(html).toContain("padding-bottom:56.3%");
    expect(html).toContain(`<iframe src="${URL}"`);
  });

  it("uses DEFAULT_RELATIVE_HEIGHT when heightValue is empty", () => {
    const html = buildHtmlCode(URL, "auto", "", "relative", "", TITLE);
    // buildHtmlCode applies parseFloat().toFixed(1), so "28" becomes "28.0"
    expect(html).toContain(`padding-bottom:${parseFloat(DEFAULT_RELATIVE_HEIGHT).toFixed(1)}%`);
  });

  it("uses DEFAULT_RELATIVE_HEIGHT when heightValue is not a number", () => {
    const html = buildHtmlCode(URL, "auto", "", "relative", "abc", TITLE);
    expect(html).toContain(`padding-bottom:${DEFAULT_RELATIVE_HEIGHT}%`);
  });

  it("sets width to 100% in auto mode", () => {
    const html = buildHtmlCode(URL, "auto", "", "relative", "56.3", TITLE);
    expect(html).toContain("width:100%");
  });

  it("uses widthPx when widthMode is fixed", () => {
    const html = buildHtmlCode(URL, "fixed", "400", "relative", "56.3", TITLE);
    expect(html).toContain("width:400px");
  });

  it("uses DEFAULT_WIDTH_PX when widthPx is empty in fixed mode", () => {
    const html = buildHtmlCode(URL, "fixed", "", "relative", "56.3", TITLE);
    expect(html).toContain(`width:${DEFAULT_WIDTH_PX}px`);
  });

  it("includes the title attribute", () => {
    const html = buildHtmlCode(URL, "auto", "", "relative", "56.3", TITLE);
    expect(html).toContain(`title="${TITLE}"`);
  });

  it("includes allowfullscreen attribute", () => {
    const html = buildHtmlCode(URL, "auto", "", "relative", "56.3", TITLE);
    expect(html).toContain("allowfullscreen");
  });
});

describe("buildHtmlCode – absolute height mode, auto width", () => {
  it("wraps iframe in a div with explicit height", () => {
    const html = buildHtmlCode(URL, "auto", "", "absolute", "500", TITLE);
    expect(html).toContain("height:500px");
    expect(html).toContain("width:100%");
  });

  it("uses DEFAULT_ABSOLUTE_HEIGHT when heightValue is empty", () => {
    const html = buildHtmlCode(URL, "auto", "", "absolute", "", TITLE);
    expect(html).toContain(`height:${DEFAULT_ABSOLUTE_HEIGHT}px`);
  });

  it("renders a div wrapper (not a bare iframe)", () => {
    const html = buildHtmlCode(URL, "auto", "", "absolute", "500", TITLE);
    expect(html.trimStart()).toMatch(/^<div/);
  });
});

describe("buildHtmlCode – absolute height mode, fixed width", () => {
  it("renders a bare iframe without a wrapper div", () => {
    const html = buildHtmlCode(URL, "fixed", "800", "absolute", "600", TITLE);
    expect(html.trimStart()).toMatch(/^<iframe/);
  });

  it("sets width and height directly on the iframe", () => {
    const html = buildHtmlCode(URL, "fixed", "800", "absolute", "600", TITLE);
    expect(html).toContain('width="800px"');
    expect(html).toContain('height="600px"');
  });

  it("uses DEFAULT_WIDTH_PX when widthPx is empty", () => {
    const html = buildHtmlCode(URL, "fixed", "", "absolute", "600", TITLE);
    expect(html).toContain(`width="${DEFAULT_WIDTH_PX}px"`);
  });

  it("uses DEFAULT_ABSOLUTE_HEIGHT when heightValue is empty", () => {
    const html = buildHtmlCode(URL, "fixed", "800", "absolute", "", TITLE);
    expect(html).toContain(`height="${DEFAULT_ABSOLUTE_HEIGHT}px"`);
  });
});
