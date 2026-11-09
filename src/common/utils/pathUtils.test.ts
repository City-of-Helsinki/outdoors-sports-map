import { describe, expect, it } from "vitest";

import { removeLanguageFromUrl } from "./pathUtils";

describe("removeLanguageFromUrl", () => {
  it.each([
    ["/fi//", "//"],
    ["/sv///", "///"],
    ["/en//example.com/path", "//example.com/path"],
    ["/fi/search", "/search"],
    ["/sv/", "/"],
    ["/en", "/"],
  ])("removes the language from %s without changing the origin", (path, expected) => {
    expect(removeLanguageFromUrl(`https://ulkoliikunta.fi${path}`)).toBe(
      `https://ulkoliikunta.fi${expected}`,
    );
  });
});