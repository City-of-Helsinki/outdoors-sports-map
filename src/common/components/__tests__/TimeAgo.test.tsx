import { render } from "@testing-library/react";
import TimeAgo from "../TimeAgo";
import "../../../domain/i18n/i18n"; // Initialize i18n

const renderTimeAgo = (time: Date) => {
  const { container } = render(<TimeAgo time={time} />);
  const timeElement = container.querySelector("time");
  expect(timeElement).toBeInTheDocument();
  expect(timeElement?.getAttribute("dateTime")).toBe(time.toISOString());
  return timeElement;
};

describe("TimeAgo Component", () => {
  beforeEach(() => {
    vi.setSystemTime(new Date("2023-05-15T12:00:00.000Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  const testCases = [
    { desc: "1 hour ago", date: "2023-05-15T11:00:00Z", expected: "noin tunti sitten" },
    { desc: "30 minutes ago", date: "2023-05-15T11:30:00Z", expected: "30 minuuttia sitten" },
    { desc: "just now", date: "2023-05-15T12:00:00Z", expected: "alle minuutti sitten" },
    { desc: "2 days ago", date: "2023-05-13T12:00:00Z", expected: "2 päivää sitten" },
    { desc: "future time", date: "2023-05-15T14:00:00Z", expected: "noin 2 tunnin kuluttua" },
    { desc: "epoch time", date: "1970-01-01T00:00:00.000Z", expected: "yli 53 vuotta sitten" }
  ];

  testCases.forEach(({ desc, date, expected }) => {
    it(`should render time ago for ${desc}`, () => {
      const testDate = new Date(date);
      const timeElement = renderTimeAgo(testDate);
      expect(timeElement?.textContent).toBe(expected);
    });
  });

  it("should have correct dateTime attribute", () => {
    const testTime = new Date("2023-05-15T10:30:45.123Z");
    renderTimeAgo(testTime);
  });
});