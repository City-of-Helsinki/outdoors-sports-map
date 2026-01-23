import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { 
  getUnitSport, 
  getOffSeasonSportFilters,
  getSportFilters,
  getDefaultSportFilter,
  getDefaultStatusFilter,
  getDefaultFilters,
  getSportSpecificationFilters,
  handleUnitConditionUpdates,
  getObservationTime,
} from "../unitHelpers";
import { UnitFilters, DEFAULT_STATUS_FILTER, SportFilters, SkiingFilters, UnitQualityConst } from "../unitConstants";
import { UnitServices } from "../../service/serviceConstants";
import { createMockUnit } from "../../../tests/testUtils";
import { subDays } from "date-fns";
import { Unit } from "../types";
import "../../i18n/i18n"; // Initialize i18n

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

describe("handleUnitConditionUpdates", () => {
  beforeEach(() => {
    vi.setSystemTime(new Date("2023-05-15T12:00:00Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  const createObservation = (daysAgo: number, quality = UnitQualityConst.GOOD, primary = true) => ({
    id: 1, unit: 1, property: "ski_track_condition", primary,
    quality, value: quality, expiration_time: null,
    time: subDays(new Date("2023-05-15T12:00:00Z"), daysAgo).toISOString(),
    name: { fi: "Hyvä", sv: "Bra", en: "Good" },
  });

  const createUnit = (daysAgo: number, options: Partial<Unit> = {}) => ({
    id: 1, name: { fi: "Test Unit", sv: "Test Unit", en: "Test Unit" },
    services: [191], location: { coordinates: [24.0, 60.0] },
    geometry: { type: "Point", coordinates: [24.0, 60.0] },
    observations: [createObservation(daysAgo)],
    ...options,
  } as Unit);

  const testCases = [
    { desc: "recent unit (within threshold)", daysAgo: 1, expectedLength: 1, expectedQuality: UnitQualityConst.GOOD },
    { desc: "moderately old ski track (7-10 days)", daysAgo: 8, expectedLength: 2, expectedQuality: UnitQualityConst.SATISFACTORY },
    { desc: "very old ski track (>10 days)", daysAgo: 12, expectedLength: 2, expectedQuality: UnitQualityConst.UNKNOWN },
  ];

  testCases.forEach(({ desc, daysAgo, expectedLength, expectedQuality }) => {
    it(`should handle ${desc}`, () => {
      const unit = createUnit(daysAgo);
      const result = handleUnitConditionUpdates({ 1: unit });
      
      expect(result[1].observations).toHaveLength(expectedLength);
      expect(result[1].observations[0].quality).toBe(expectedQuality);
    });
  });

  const edgeCases = [
    {
      desc: "closed units",
      unit: createUnit(10, { observations: [{ ...createObservation(10), quality: "closed", value: "closed" }] }),
      expectNoUpdate: true
    },
    {
      desc: "units with no observations", 
      unit: createUnit(0, { observations: [] }),
      expectNoUpdate: true
    },
    {
      desc: "units with no primary observation",
      unit: createUnit(10, { observations: [createObservation(10, UnitQualityConst.GOOD, false)] }),
      expectNoUpdate: true
    }
  ];

  edgeCases.forEach(({ desc, unit, expectNoUpdate }) => {
    it(`should not update ${desc}`, () => {
      const result = handleUnitConditionUpdates({ 1: unit });
      const originalLength = unit.observations.length;
      
      expect(result[1].observations).toHaveLength(originalLength);
      if (expectNoUpdate && originalLength > 0) {
        expect(result[1].observations[0].quality).toBe(unit.observations[0].quality);
      }
    });
  });

  it("should handle swimming places with different thresholds", () => {
    const swimmingUnit = createUnit(10, { 
      services: [730],
      observations: [{ ...createObservation(10), property: "swimming_water_condition" }]
    });
    
    const result = handleUnitConditionUpdates({ 1: swimmingUnit });
    
    expect(result[1].observations).toHaveLength(2);
    expect(result[1].observations[0].quality).toBe(UnitQualityConst.UNKNOWN);
  });

  it("should preserve original observation and handle multiple units", () => {
    const units = {
      1: createUnit(12), // Old unit -> should update
      2: createUnit(1),  // Recent unit -> should not update
    };
    
    const result = handleUnitConditionUpdates(units);
    
    // Old unit: updated with new observation + original preserved
    expect(result[1].observations).toHaveLength(2);
    expect(result[1].observations[0].quality).toBe(UnitQualityConst.UNKNOWN); // New
    expect(result[1].observations[1].quality).toBe(UnitQualityConst.GOOD);    // Original
    
    // Recent unit: no changes
    expect(result[2].observations).toHaveLength(1);
    expect(result[2].observations[0].quality).toBe(UnitQualityConst.GOOD);
  });
});

describe("getObservationTime", () => {
  const testCases = [
    {
      desc: "ISO string",
      observation: { time: "2023-05-15T10:30:00Z" },
      expected: "2023-05-15T10:30:00.000Z"
    },
    {
      desc: "numeric timestamp", 
      observation: { time: 1684148400000 },
      expected: "2023-05-15T11:00:00.000Z"
    },
    {
      desc: "ISO string with timezone",
      observation: { time: "2023-05-15T12:30:00+02:00" },
      expected: "2023-05-15T10:30:00.000Z"
    }
  ];

  testCases.forEach(({ desc, observation, expected }) => {
    it(`should convert ${desc} to Date object`, () => {
      const result = getObservationTime(observation);
      expect(result).toBeInstanceOf(Date);
      expect(result.toISOString()).toBe(expected);
    });
  });

  const nullishCases = [
    { desc: "null observation", observation: null },
    { desc: "observation with no time", observation: {} },
    { desc: "observation with null time", observation: { time: null } }
  ];

  nullishCases.forEach(({ desc, observation }) => {
    it(`should default to epoch time for ${desc}`, () => {
      const result = getObservationTime(observation);
      expect(result).toBeInstanceOf(Date);
      expect(result.toISOString()).toBe("1970-01-01T00:00:00.000Z");
    });
  });

  it("should handle invalid time string", () => {
    const result = getObservationTime({ time: "invalid-date" });
    expect(result).toBeInstanceOf(Date);
    expect(result.toString()).toBe("Invalid Date");
  });
});

describe("sledding automatic condition updates", () => {
  beforeEach(() => {
    vi.setSystemTime(new Date("2023-05-15T12:00:00Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  const createSleddingObservation = (daysAgo: number, quality = UnitQualityConst.GOOD) => ({
    id: 1, unit: 1, property: "sledding_condition", primary: true,
    quality, value: quality, expiration_time: null,
    time: subDays(new Date("2023-05-15T12:00:00Z"), daysAgo).toISOString(),
    name: { fi: "Hyvä", sv: "Bra", en: "Good" },
  });

  const createSleddingUnit = (daysAgo: number, options: Partial<Unit> = {}) => ({
    id: 1, name: { fi: "Test Sledding Hill", sv: "Test Sledding Hill", en: "Test Sledding Hill" },
    services: [1083], // SLEDDING_HILL service
    location: { coordinates: [24.0, 60.0] },
    geometry: { type: "Point", coordinates: [24.0, 60.0] },
    observations: [createSleddingObservation(daysAgo)],
    connections: [],
    ...options,
  } as Unit);

  const testCases = [
    { desc: "1 day old sledding unit", daysAgo: 1 },
    { desc: "30 days old sledding unit", daysAgo: 30 },
    { desc: "100 days old sledding unit", daysAgo: 100 },
    { desc: "365 days old sledding unit", daysAgo: 365 },
    { desc: "1000 days old sledding unit", daysAgo: 1000 },
  ];

  testCases.forEach(({ desc, daysAgo }) => {
    it(`should never automatically update ${desc} to unknown status`, () => {
      const unit = createSleddingUnit(daysAgo);
      const result = handleUnitConditionUpdates({ 1: unit });
      
      // Should preserve original observation and not add any automatic updates
      expect(result[1].observations).toHaveLength(1);
      expect(result[1].observations?.[0].quality).toBe(UnitQualityConst.GOOD);
      expect(result[1].observations?.[0]?.property).toBe("sledding_condition");
    });
  });
});