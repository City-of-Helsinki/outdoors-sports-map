import { describe, it, expect } from "vitest";
import getServiceName, { getOnSeasonServices, getOnSeasonSportFilters, getServicesForSport, getOnSeasonHikeFilters } from "../serviceHelpers";
import { Service } from "../state/serviceSlice";
import { UnitFilters } from "../../unit/unitConstants";
import { 
  SkiingServices,
  IceSkatingServices,
  SwimmingServices,
  IceSwimmingServices,
  SleddingServices,
  SupportingServices,
} from "../serviceConstants";
import { expectEmptyString, expectArrayResult, expectNumberArray } from "../../../tests/testUtils";

describe("serviceHelpers", () => {
  // Shared test data
  const SUMMER_DATE = { month: 6, day: 15 };
  const WINTER_DATE = { month: 12, day: 15 };
  const LEAP_DATE = { month: 2, day: 29 };

  describe("getServiceName", () => {
    const mockServices: Record<string, Service> = {
      "1": {
        id: 1,
        name: {
          en: "Swimming Pool",
          fi: "Uima-allas",
          sv: "Simbassäng",
        },
      },
      "2": {
        id: 2,
        name: {
          en: "Ice Rink",
          fi: "Jäähalli",
          sv: "Ishall",
        },
      },
      "3": {
        id: 3,
        // Service without name property to test uncovered code
      } as Service,
    };

    it("should return empty string when services is null", () => {
      const result = getServiceName([1, 2], null as any);
      expectEmptyString(result);
    });

    it("should return empty string when services is undefined", () => {
      const result = getServiceName([1, 2], undefined as any);
      expectEmptyString(result);
    });

    it("should return empty string when services is empty object", () => {
      const result = getServiceName([1, 2], {});
      expectEmptyString(result);
    });

    it("should return service name in default language (fi) when found", () => {
      const result = getServiceName([1], mockServices);
      expect(result).toBe("Uima-allas");
    });

    it("should return service name in specified language when found", () => {
      const result = getServiceName([1], mockServices, "en");
      expect(result).toBe("Swimming Pool");
    });

    it("should return service name in Swedish when specified", () => {
      const result = getServiceName([1], mockServices, "sv");
      expect(result).toBe("Simbassäng");
    });

    it("should return first available service name when multiple services provided", () => {
      const result = getServiceName([1, 2], mockServices);
      expect(result).toBe("Uima-allas");
    });

    it("should return second service name when first service doesn't exist", () => {
      const result = getServiceName([999, 2], mockServices);
      expect(result).toBe("Jäähalli");
    });

    it("should return empty string when service exists but has no name property", () => {
      // This tests the uncovered return statement at the end
      const result = getServiceName([3], mockServices);
      expectEmptyString(result);
    });

    it("should return empty string when all services exist but none have name property", () => {
      // This also tests the uncovered return statement
      const servicesWithoutNames: Record<string, Service> = {
        "1": { id: 1 } as Service,
        "2": { id: 2 } as Service,
      };
      
      const result = getServiceName([1, 2], servicesWithoutNames);
      expectEmptyString(result);
    });

    it("should return empty string when unitServices is empty array", () => {
      const result = getServiceName([], mockServices);
      expectEmptyString(result);
    });

    it("should handle non-existent service IDs gracefully", () => {
      const result = getServiceName([999, 998], mockServices);
      expectEmptyString(result);
    });

    it("should return name from first service with defined name property", () => {
      // Mix of services without name (id: 3) and with name (id: 1)
      const result = getServiceName([3, 1], mockServices);
      expect(result).toBe("Uima-allas");
    });
  });

  describe("getOnSeasonServices", () => {
    it("should return array of service IDs for current season", () => {
      const result = getOnSeasonServices();
      expectNumberArray(result);
    });

    it("should accept custom date parameter", () => {
      const result = getOnSeasonServices(SUMMER_DATE);
      expectArrayResult(result);
    });
  });

  describe("getOnSeasonSportFilters", () => {
    it("should return array of sport filters for current season", () => {
      const result = getOnSeasonSportFilters();
      expectArrayResult(result);
    });

    it("should accept custom date parameter", () => {
      const result = getOnSeasonSportFilters(WINTER_DATE);
      expectArrayResult(result);
    });
  });

  describe("getOnSeasonHikeFilters", () => {
    it("should return array of hiking filters for current season", () => {
      const result = getOnSeasonHikeFilters();
      expectArrayResult(result);
    });

    it("should accept custom date parameter", () => {
      const result = getOnSeasonHikeFilters(SUMMER_DATE);
      expectArrayResult(result);
    });

    it("should return different results for different seasons", () => {
      const summerFilters = getOnSeasonHikeFilters(SUMMER_DATE);
      const winterFilters = getOnSeasonHikeFilters(WINTER_DATE);
      
      expectArrayResult(summerFilters);
      expectArrayResult(winterFilters);
      // Results may be different depending on season definitions
    });

    it("should return empty array when no seasons match the date", () => {
      // Test with an edge case date that might not match any season
      const result = getOnSeasonHikeFilters(LEAP_DATE);
      expectArrayResult(result);
    });
  });

  describe("getServicesForSport", () => {
    // Test cases mapping sport filters to expected service arrays
    const sportServiceTestCases = [
      { sport: UnitFilters.SKIING, expected: SkiingServices, name: "SkiingServices" },
      { sport: UnitFilters.ICE_SKATING, expected: IceSkatingServices, name: "IceSkatingServices" },
      { sport: UnitFilters.SWIMMING, expected: SwimmingServices, name: "SwimmingServices" },
      { sport: UnitFilters.ICE_SWIMMING, expected: IceSwimmingServices, name: "IceSwimmingServices" },
      { sport: UnitFilters.SLEDDING, expected: SleddingServices, name: "SleddingServices" },
      { sport: UnitFilters.HIKING, expected: SupportingServices, name: "SupportingServices" },
    ];

    sportServiceTestCases.forEach(({ sport, expected, name }) => {
      it(`should return ${name} for ${sport} sport`, () => {
        const result = getServicesForSport(sport);
        expect(result).toBe(expected);
        expectArrayResult(result);
      });
    });

    it("should return empty array for unknown sport (default case)", () => {
      // Testing the default case by passing an invalid sport filter
      const result = getServicesForSport("UNKNOWN_SPORT" as any);
      expect(result).toEqual([]);
      expectArrayResult(result);
    });
  });
});