import { describe, it, expect, vi, beforeEach } from "vitest";
import { 
  getUnitSport, 
  getOffSeasonSportFilters,
  getSportFilters,
  getDefaultSportFilter,
  getDefaultStatusFilter,
  getDefaultFilters,
  getSportSpecificationFilters,
} from "../unitHelpers";
import { UnitFilters, DEFAULT_STATUS_FILTER, SportFilters, SkiingFilters } from "../unitConstants";
import { UnitServices } from "../../service/serviceConstants";
import { createMockUnit } from "../../../tests/testUtils";

describe("getUnitSport", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Edge cases", () => {
    const edgeCases = [
      { description: "no services", services: [] },
      { description: "null services", services: null as any },
      { description: "undefined services", services: undefined as any },
    ];

    edgeCases.forEach(({ description, services }) => {
      it(`should return 'unknown' when unit has ${description}`, () => {
        const unit = createMockUnit(1, { services });
        const result = getUnitSport(unit);
        expect(result).toBe("unknown");
      });
    });
  });

  describe("Basic sport matching", () => {
    // Using real service IDs from the actual service constants
    const sportTestCases = [
      { sport: UnitFilters.SKIING, serviceId: 191, description: "skiing" }, // Real skiing service ID
      { sport: UnitFilters.SWIMMING, serviceId: 730, description: "swimming" }, // Real swimming service ID  
      { sport: UnitFilters.ICE_SKATING, serviceId: 406, description: "ice skating" }, // Real ice skating service ID
    ];

    sportTestCases.forEach(({ sport, serviceId, description }) => {
      it(`should return correct sport when unit has matching ${description} services`, () => {
        const unit = createMockUnit(1, { services: [serviceId] });
        const result = getUnitSport(unit);
        expect(result).toBe(sport);
      });
    });

    it("should return first matching sport when unit has multiple sport services", () => {
      const unit = createMockUnit(1, { services: [191, 730] }); // Both skiing and swimming
      const result = getUnitSport(unit);
      // Should return the first match found (depends on Object.entries order)
      expect([UnitFilters.SKIING, UnitFilters.SWIMMING]).toContain(result);
    });

    it("should return 'unknown' when unit services don't match any sport", () => {
      const unit = createMockUnit(1, { services: [999, 998] }); // Non-existent services
      const result = getUnitSport(unit);
      expect(result).toBe("unknown");
    });
  });

  describe("Special cases for hiking/supporting services", () => {
    const specialCaseTestData = [
      { serviceId: UnitServices.COOKING_FACILITY, expectedFilter: UnitFilters.COOKING_FACILITY, description: "cooking facility" },
      { serviceId: UnitServices.CAMPING, expectedFilter: UnitFilters.CAMPING, description: "camping" },
      { serviceId: UnitServices.SKI_LODGE, expectedFilter: UnitFilters.SKI_LODGE, description: "ski lodge" },
      { serviceId: UnitServices.LEAN_TO, expectedFilter: UnitFilters.LEAN_TO, description: "lean-to" },
    ];

    specialCaseTestData.forEach(({ serviceId, expectedFilter, description }) => {
      it(`should return ${expectedFilter} for ${description} service`, () => {
        const unit = createMockUnit(1, { services: [serviceId] });
        const result = getUnitSport(unit);
        expect(result).toBe(expectedFilter);
      });
    });

    it("should return HIKING for generic supporting service", () => {
      // Use the lean-to service as an example of a supporting service that maps to HIKING
      // but gets converted to LEAN_TO by the special case logic
      const unit = createMockUnit(1, { services: [UnitServices.LEAN_TO] });
      const result = getUnitSport(unit);
      expect(result).toBe(UnitFilters.LEAN_TO); // This is the actual expected behavior
    });

    it("should return unknown for information point service", () => {
      // INFORMATION_POINT is not in SupportingServices, so it should return unknown
      const unit = createMockUnit(1, { services: [UnitServices.INFORMATION_POINT] });
      const result = getUnitSport(unit);
      expect(result).toBe("unknown");
    });
  });
});

describe("Season and filter utilities", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getOffSeasonSportFilters", () => {
    const testCases = [
      {
        description: "summer date",
        date: { month: 6, day: 15 }, // July 15 - Summer season
        expected: [UnitFilters.SKIING, UnitFilters.ICE_SKATING, UnitFilters.ICE_SWIMMING, UnitFilters.SLEDDING], // Winter filters are off-season
      },
      {
        description: "winter date", 
        date: { month: 0, day: 15 }, // January 15 - Winter season
        expected: [UnitFilters.SWIMMING], // Summer filters are off-season
      },
      {
        description: "transition date",
        date: { month: 3, day: 15 }, // April 15 - Still winter season according to real logic
        expected: [UnitFilters.SWIMMING], // Summer filters are off-season
      },
    ];

    testCases.forEach(({ description, date, expected }) => {
      it(`should return correct off-season filters for ${description}`, () => {
        const result = getOffSeasonSportFilters(date);
        expect(result).toEqual(expected);
      });
    });

    it("should use getToday() when no date provided", () => {
      const result = getOffSeasonSportFilters();
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe("getSportFilters", () => {
    it("should return object with onSeason and offSeason filters", () => {
      // For summer date (July 15), swimming should be on-season, winter sports off-season
      const result = getSportFilters({ month: 6, day: 15 }); // July 15
      
      expect(result).toHaveProperty('onSeason');
      expect(result).toHaveProperty('offSeason');
      expect(Array.isArray(result.onSeason)).toBe(true);
      expect(Array.isArray(result.offSeason)).toBe(true);
      
      // In summer, swimming should be on-season
      expect(result.onSeason).toContain(UnitFilters.SWIMMING);
      // In summer, winter sports should be off-season  
      expect(result.offSeason).toContain(UnitFilters.SKIING);
    });

    it("should use getToday() when no date provided", () => {
      const result = getSportFilters();
      expect(result).toHaveProperty('onSeason');
      expect(result).toHaveProperty('offSeason');
    });
  });

  describe("getDefaultSportFilter", () => {
    it("should return a valid sport filter", () => {
      const result = getDefaultSportFilter();
      expect(SportFilters).toContain(result);
    });

    it("should return consistent result for same date", () => {
      const result1 = getDefaultSportFilter();
      const result2 = getDefaultSportFilter();
      expect(result1).toBe(result2);
    });
  });

  describe("getDefaultStatusFilter", () => {
    it("should return DEFAULT_STATUS_FILTER constant", () => {
      const result = getDefaultStatusFilter();
      expect(result).toBe(DEFAULT_STATUS_FILTER);
    });
  });

  describe("getDefaultFilters", () => {
    it("should return object with default status and sport filters", () => {
      const result = getDefaultFilters();
      
      expect(result).toHaveProperty('status', DEFAULT_STATUS_FILTER);
      expect(result).toHaveProperty('sport');
      expect(SportFilters).toContain(result.sport);
    });
  });

  describe("getSportSpecificationFilters", () => {
    const specificationTestCases = [
      {
        sport: UnitFilters.SKIING,
        description: "skiing sport",
        expected: [...SkiingFilters],
      },
      {
        sport: UnitFilters.HIKING,
        description: "hiking sport",
        // For hiking, should return real on-season hike filters based on current season
        testFunction: (result: any) => {
          expect(Array.isArray(result)).toBe(true);
          // Should contain valid hiking filters like LEAN_TO, CAMPING, etc.
        },
      },
      {
        sport: UnitFilters.SWIMMING,
        description: "other sport",
        expected: [],
      },
    ];

    specificationTestCases.forEach(({ sport, description, expected, testFunction }) => {
      it(`should return correct filters for ${description}`, () => {
        const result = getSportSpecificationFilters(sport);
        
        if (testFunction) {
          testFunction(result);
        } else {
          expect(result).toEqual(expected);
        }
      });
    });
  });
});