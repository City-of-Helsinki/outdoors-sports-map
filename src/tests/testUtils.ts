/* eslint-disable @typescript-eslint/no-explicit-any */
import { configureStore } from '@reduxjs/toolkit';
import { expect } from 'vitest';

import { initialSearchState } from '../domain/unit/state/searchSlice';
import { unitApi, initialUnitState } from '../domain/unit/state/unitSlice';
import unitReducer from '../domain/unit/state/unitSlice';
import { NormalizedUnitSchema, Unit, UnitSearchState, UnitState } from '../domain/unit/types';

/**
 * Test assertion utilities for consistent testing patterns across the application
 */

export const expectEmptyString = (result: string) => {
  expect(result).toBe("");
};

export const expectArrayResult = (result: any[]) => {
  expect(Array.isArray(result)).toBe(true);
};

export const expectNumberArray = (result: any[]) => {
  expectArrayResult(result);
  expect(result.every(id => typeof id === "number")).toBe(true);
};

export const expectStringArray = (result: any[]) => {
  expectArrayResult(result);
  expect(result.every(item => typeof item === "string")).toBe(true);
};

export const expectNonEmptyArray = (result: any[]) => {
  expectArrayResult(result);
  expect(result.length).toBeGreaterThan(0);
};

/**
 * Mock data creation utilities
 */

export const createMockResponse = (data: any, status = 200) => new Response(JSON.stringify(data), {
  status,
  statusText: status === 200 ? 'OK' : 'Error',
  headers: { 'Content-Type': 'application/json' },
});

export const createTranslatableString = (baseText: string, overrides: Record<string, string> = {}) => ({
  fi: baseText,
  en: `${baseText} EN`,
  sv: `${baseText} SV`,
  ...overrides,
});

/**
 * RTK Query test utilities
 */

export const createTestStoreState = (apiState = {}) => ({
  api: {
    queries: {},
    mutations: {},
    provided: {
      tags: {
        AppWideNotification: {},
        Service: {},
        Address: {},
      },
      keys: {},
    },
    subscriptions: {},
    config: {
      reducerPath: 'api' as const,
      online: true,
      focused: true,
      middlewareRegistered: false as boolean | "conflict",
      refetchOnMountOrArgChange: false,
      refetchOnReconnect: false,
      refetchOnFocus: false,
      keepUnusedDataFor: 60,
      invalidationBehavior: 'delayed' as const,
    },
    ...apiState,
  },
});

/**
 * Unit domain test utilities
 */

// Test constants
export const TEST_COORDINATES = {
  HELSINKI: [24.94, 60.17] as [number, number],
  ESPOO: [24.95, 60.18] as [number, number],
  VANTAA: [25.0, 60.2] as [number, number],
  TURKU: [22.27, 60.45] as [number, number],
  TAMPERE: [23.76, 61.50] as [number, number],
};

export const TEST_SERVICES = {
  SKIING: 191, // SKI_TRACK
  SWIMMING: 730, // SWIMMING_PLACE
  ICE_SKATING: 406, // ICE_SKATING_FIELD
  ICE_SWIMMING: 684, // ICE_SWIMMING_PLACE
  SLEDDING: 1083, // SLEDDING_HILL
};

// Helper functions
export const createInitialUnitState = (overrides = {}): UnitState => ({
  ...initialUnitState,
  ...overrides,
});

export const createInitialSearchState = (overrides = {}): UnitSearchState => ({
  ...initialSearchState,
  ...overrides,
});

export const createApiTestStore = () => configureStore({
  reducer: {
    [unitApi.reducerPath]: unitApi.reducer,
    unit: unitReducer,
  },
  middleware: (gDM) => gDM().concat(unitApi.middleware),
});

export const createMockUnit = (id: number, overrides: Partial<Unit> = {}): Unit => ({
  id,
  name: createTranslatableString(`Test Unit ${id}`),
  location: { coordinates: TEST_COORDINATES.HELSINKI },
  services: [TEST_SERVICES.SKIING],
  ...overrides,
} as unknown as Unit);

export const createMockSchema = (units: Unit[]): NormalizedUnitSchema => ({
  entities: {
    unit: Object.fromEntries(units.map(unit => [unit.id, unit])),
  },
  result: units.map(unit => unit.id),
} as unknown as NormalizedUnitSchema);

// Common mock units for reuse
export const createBasicMockUnits = (): Unit[] => [
  createMockUnit(1, { services: [102, 103] }),
  createMockUnit(2, { 
    location: { coordinates: TEST_COORDINATES.ESPOO },
    services: [103, 105]
  }),
];

// Helper for creating app state for selector tests
export const createMockAppState = (unitOverrides = {}, searchOverrides = {}) => ({
  unit: createInitialUnitState({
    byId: {},
    all: [],
    ...unitOverrides,
  }),
  search: createInitialSearchState(searchOverrides),
} as any);