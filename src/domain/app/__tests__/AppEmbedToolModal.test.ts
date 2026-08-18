import { describe, expect, it } from "vitest";

// These are extracted from AppEmbedToolModal for unit testing.
// The file-level helpers are tested here without rendering the full modal.

function buildEmbedUrl(lang: string, sport: string, unitId: string): string {
  const origin = "https://ulkoliikunta.fi";
  const base = `${origin}/${lang}/embed`;
  if (unitId.trim()) return `${base}?unit=${encodeURIComponent(unitId.trim())}`;
  if (sport !== "all") return `${base}?sport=${encodeURIComponent(sport)}`;
  return base;
}

function buildHtmlCode(
  embedUrl: string,
  width: string,
  height: string,
  responsive: boolean,
  title: string,
): string {
  const w = width.trim() || "100%";
  const h = height.trim() || "600";
  const hPx = h.endsWith("px") || h.endsWith("%") ? h : `${h}px`;

  if (responsive) {
    const ratio = parseFloat(h) / (parseFloat(w) || 800);
    const paddingBottom = isNaN(ratio) ? "75" : (ratio * 100).toFixed(1);
    return (
      `<div style="position:relative;width:${w};padding-bottom:${paddingBottom}%;">` +
      `<iframe src="${embedUrl}" style="position:absolute;top:0;left:0;width:100%;height:100%;border:none;" ` +
      `title="${title}" allowfullscreen></iframe></div>`
    );
  }

  const wValue = w.endsWith("px") || w.endsWith("%") ? w : `${w}px`;
  return (
    `<iframe src="${embedUrl}" width="${wValue}" height="${hPx}" ` +
    `style="border:none;" title="${title}" allowfullscreen></iframe>`
  );
}

describe("buildEmbedUrl", () => {
  it("returns base URL when no sport and no unitId", () => {
    expect(buildEmbedUrl("en", "all", "")).toBe(
      "https://ulkoliikunta.fi/en/embed",
    );
  });

  it("appends sport param when sport is not all", () => {
    expect(buildEmbedUrl("fi", "ski", "")).toBe(
      "https://ulkoliikunta.fi/fi/embed?sport=ski",
    );
  });

  it("unit param takes precedence over sport", () => {
    const url = buildEmbedUrl("sv", "skiing", "42");
    expect(url).toBe("https://ulkoliikunta.fi/sv/embed?unit=42");
    expect(url).not.toContain("sport");
  });

  it("trims and encodes whitespace in unitId", () => {
    expect(buildEmbedUrl("en", "all", "  99  ")).toBe(
      "https://ulkoliikunta.fi/en/embed?unit=99",
    );
  });

  it("reflects language in path", () => {
    expect(buildEmbedUrl("sv", "all", "")).toContain("/sv/embed");
  });
});

describe("buildHtmlCode", () => {
  const url = "https://ulkoliikunta.fi/en/embed?sport=ski";

  it("generates responsive wrapper when responsive=true", () => {
    const html = buildHtmlCode(url, "100%", "600", true, "Map");
    expect(html).toContain("padding-bottom:");
    expect(html).toContain("position:absolute");
    expect(html).toContain(`src="${url}"`);
  });

  it("generates plain iframe when responsive=false", () => {
    const html = buildHtmlCode(url, "800", "500", false, "Map");
    expect(html).toMatch(/<iframe /);
    expect(html).not.toContain("<div");
    expect(html).toContain('width="800px"');
    expect(html).toContain('height="500px"');
  });

  it("includes the title attribute", () => {
    const html = buildHtmlCode(url, "100%", "600", false, "My Title");
    expect(html).toContain('title="My Title"');
  });

  it("appends px to numeric width/height in non-responsive mode", () => {
    const html = buildHtmlCode(url, "640", "480", false, "Map");
    expect(html).toContain('width="640px"');
    expect(html).toContain('height="480px"');
  });

  it("preserves % width as-is in non-responsive mode", () => {
    const html = buildHtmlCode(url, "100%", "400", false, "Map");
    expect(html).toContain('width="100%"');
  });
});
