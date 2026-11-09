import { getCanonicalUrl } from "../helpers";

describe("getCanonicalUrl", () => {
  it("preserves a double-slash pathname while removing query and hash", () => {
    expect(
      getCanonicalUrl({
        href: "https://ulkoliikunta.fi//?query=value#section",
      }),
    ).toBe("https://ulkoliikunta.fi//");
  });
});
