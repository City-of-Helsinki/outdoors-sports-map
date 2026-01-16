import { render } from "@testing-library/react";
import Time, { formatTime } from "../Time";
import "../../../domain/i18n/i18n"; // Initialize i18n

describe("Time Component", () => {
  beforeEach(() => {
    vi.setSystemTime(new Date("2023-05-15T15:30:00Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("formatTime function", () => {
    // Since we're using real i18n, we can't predict exact translations
    // but we can test the function logic and structure
    it("should return a string for today", () => {
      const date = new Date("2023-05-15T10:00:00Z");
      const mockT = vi.fn(() => "mocked translation");
      
      const result = formatTime(date, mockT);
      
      expect(typeof result).toBe("string");
      expect(mockT).toHaveBeenCalledWith("TIME.TODAY", {});
    });

    it("should return a string for yesterday", () => {
      const date = new Date("2023-05-14T10:00:00Z");
      const mockT = vi.fn(() => "mocked translation");
      
      const result = formatTime(date, mockT);
      
      expect(typeof result).toBe("string");
      expect(mockT).toHaveBeenCalledWith("TIME.YESTERDAY", {});
    });

    it("should return a string with days option for days ago", () => {
      const date = new Date("2023-05-12T10:00:00Z");
      const mockT = vi.fn(() => "mocked translation");
      
      const result = formatTime(date, mockT);
      
      expect(typeof result).toBe("string");
      expect(mockT).toHaveBeenCalledWith("TIME.DAYS_AGO", { days: 3 });
    });

    it("should return a string with weeks option for weeks ago", () => {
      const date = new Date("2023-05-01T10:00:00Z");
      const mockT = vi.fn(() => "mocked translation");
      
      const result = formatTime(date, mockT);
      
      expect(typeof result).toBe("string");
      expect(mockT).toHaveBeenCalledWith("TIME.WEEKS_AGO", { weeks: 2 });
    });

    it("should return a string with months option for months ago", () => {
      const date = new Date("2023-02-15T10:00:00Z");
      const mockT = vi.fn(() => "mocked translation");
      
      const result = formatTime(date, mockT);
      
      expect(typeof result).toBe("string");
      expect(mockT).toHaveBeenCalledWith("TIME.MONTHS_AGO", { months: 3 });
    });

    it("should return not available for very old dates", () => {
      const date = new Date("2021-05-15T10:00:00Z");
      const mockT = vi.fn(() => "mocked translation");
      
      const result = formatTime(date, mockT);
      
      expect(typeof result).toBe("string");
      expect(mockT).toHaveBeenCalledWith("TIME.NOT_AVAILABLE", {});
    });
  });

  describe("Time component rendering", () => {
    it("should render time with today's date and show hours:minutes", () => {
      const todayTime = new Date("2023-05-15T10:30:00Z");
      
      const { container } = render(<Time time={todayTime} />);
      
      const timeElement = container.querySelector("time");
      expect(timeElement).toBeInTheDocument();
      expect(timeElement?.getAttribute("dateTime")).toBe(todayTime.toISOString());
      expect(timeElement?.textContent).toContain("10:30"); // Local time displayed
    });

    it("should render time with yesterday's date and show hours:minutes", () => {
      const yesterdayTime = new Date("2023-05-14T14:45:00Z");
      
      const { container } = render(<Time time={yesterdayTime} />);
      
      const timeElement = container.querySelector("time");
      expect(timeElement).toBeInTheDocument();
      expect(timeElement?.getAttribute("dateTime")).toBe(yesterdayTime.toISOString());
      expect(timeElement?.textContent).toContain("14:45"); 
    });

    it("should render time without hours:minutes for dates older than 2 days", () => {
      const oldTime = new Date("2023-05-10T10:30:00Z");
      
      const { container } = render(<Time time={oldTime} />);
      
      const timeElement = container.querySelector("time");
      expect(timeElement).toBeInTheDocument();
      expect(timeElement?.getAttribute("dateTime")).toBe(oldTime.toISOString());
      expect(timeElement?.textContent).not.toContain("10:30");
    });

    it("should have correct dateTime attribute", () => {
      const testTime = new Date("2023-05-15T09:15:30.123Z");
      
      const { container } = render(<Time time={testTime} />);
      
      const timeElement = container.querySelector("time");
      expect(timeElement?.getAttribute("dateTime")).toBe("2023-05-15T09:15:30.123Z");
    });
  });
});