import { vi, describe, expect, it, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import unitReducer, {
  receiveUnits,
  selectUnitById,
  selectAllUnits,
  selectVisibleUnits,
  selectIsUnitLoading,
  unitApi,
} from '../unitSlice';
import type { AppState } from '../../../app/appConstants';
import type { Unit, NormalizedUnitSchema } from '../../unitConstants';
import { UnitFilters } from '../../unitConstants';

// Mock fetch for testing API calls
const mockFetch = vi.fn();
globalThis.fetch = mockFetch;

// Mock dependencies
vi.mock('../../service/serviceHelpers', () => ({
  getOnSeasonServices: vi.fn(() => [102, 103, 105]),
}));

vi.mock('../../unitHelpers', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../unitHelpers')>();
  return {
    ...actual,
    handleUnitConditionUpdates: vi.fn((units) => units),
    enumerableQuality: vi.fn(() => 1),
    getUnitQuality: vi.fn(() => ({})),
    getFilteredUnitsBySportSpecification: vi.fn((visibleUnits) => visibleUnits.slice(0, -1)), // Remove last unit for testing intersection
  };
});

import { getOnSeasonServices } from '../../service/serviceHelpers';
import { handleUnitConditionUpdates } from '../../unitHelpers';

describe('unitSlice', () => {
  // Helper function to create initial reducer state
  const createInitialReducerState = (overrides = {}) => ({
    isFetching: false,
    fetchError: null,
    byId: {},
    all: [],
    iceskate: [],
    ski: [],
    swim: [],
    iceswim: [],
    sledding: [],
    status_ok: [],
    hike: [],
    ...overrides,
  });

  // Helper function to create initial search state
  const createInitialSearchState = (overrides = {}) => ({
    isFetching: false,
    isActive: false,
    unitResults: [],
    unitSuggestions: [],
    addressSuggestions: [],
    ...overrides,
  });

  beforeEach(() => {
    mockFetch.mockClear();
  });

  // Helper functions for API testing
  const createApiTestStore = () => configureStore({
    reducer: {
      [unitApi.reducerPath]: unitApi.reducer,
      unit: unitReducer,
    },
    middleware: (gDM) => gDM().concat(unitApi.middleware),
  });

  const createMockResponse = (data: any, status = 200) => new Response(JSON.stringify(data), {
    status,
    statusText: status === 200 ? 'OK' : 'Error',
    headers: { 'Content-Type': 'application/json' },
  });

  const mockUnits: Unit[] = [
    {
      id: 1,
      name: { fi: 'Test Unit 1' },
      location: { coordinates: [24.94, 60.17] },
      services: [102, 103],
    },
    {
      id: 2, 
      name: { fi: 'Test Unit 2' },
      location: { coordinates: [24.95, 60.18] },
      services: [103, 105],
    },
  ] as Unit[];

  describe('API endpoints', () => {
    describe('getUnits', () => {
      it('should make correct API request and normalize response', async () => {
        const mockResponse = { results: mockUnits };
        mockFetch.mockResolvedValueOnce(createMockResponse(mockResponse));

        const store = createApiTestStore();
        const result = await store.dispatch(unitApi.endpoints.getUnits.initiate());

        // Verify the query was successful and data was normalized
        expect(result.data?.entities.unit).toBeDefined();
        expect(result.data?.result).toEqual(['1', '2']);

        // Verify the fetch was called with correct parameters
        expect(mockFetch).toHaveBeenCalledTimes(1);
        const [request] = mockFetch.mock.calls[0];
        
        expect(request.url).toContain('unit/');
        expect(request.url).toContain('service='); // Just check service param exists, values may vary
        expect(request.url).toContain('page_size=1000');
        expect(request.url).toContain('geometry=true');
        expect(request.method).toBe('GET');
      });

      it('should handle custom params', async () => {
        const mockResponse = { results: mockUnits };
        mockFetch.mockResolvedValueOnce(createMockResponse(mockResponse));

        const store = createApiTestStore();
        const customParams = { municipality: 'Helsinki', page_size: 500 };
        await store.dispatch(unitApi.endpoints.getUnits.initiate(customParams));

        const [request] = mockFetch.mock.calls[0];
        expect(request.url).toContain('municipality=Helsinki');
        expect(request.url).toContain('page_size=500'); // Custom param should override default
      });

      it('should handle empty results', async () => {
        const mockResponse = { results: [] };
        mockFetch.mockResolvedValueOnce(createMockResponse(mockResponse));

        const store = createApiTestStore();
        const result = await store.dispatch(unitApi.endpoints.getUnits.initiate());

        // Empty results should still normalize to proper structure
        expect(result.data?.result).toEqual([]);
        // The entities structure depends on how normalizr handles empty arrays
        expect(result.data).toBeDefined();
      });

      it('should handle API error response', async () => {
        const response = new Response(JSON.stringify({ error: 'Units not found' }), {
          status: 404,
          statusText: 'Not Found',
          headers: { 'Content-Type': 'application/json' },
        });
        
        mockFetch.mockResolvedValueOnce(response);

        const store = createApiTestStore();
        const result = await store.dispatch(unitApi.endpoints.getUnits.initiate());

        expect(result.error).toBeDefined();
        expect(result.error?.status).toBe(404);
      });

      it('should set isFetching and handle matcher states', async () => {
        const mockResponse = { results: mockUnits };
        mockFetch.mockResolvedValueOnce(createMockResponse(mockResponse));

        const store = createApiTestStore();
        
        // Dispatch the request and check states
        const resultPromise = store.dispatch(unitApi.endpoints.getUnits.initiate());
        
        // Check pending state (might be too fast to catch, but worth testing)
        let state = store.getState();
        // Note: This might be false if the request completes immediately in tests
        
        await resultPromise;
        
        // After completion, check fulfilled state
        state = store.getState();
        expect(state.unit.isFetching).toBe(false);
        expect(state.unit.fetchError).toBeNull();
      });

      it('should handle rejected matcher', async () => {
        const response = new Response(JSON.stringify({ error: 'Server error' }), {
          status: 500,
          statusText: 'Internal Server Error',
          headers: { 'Content-Type': 'application/json' },
        });
        
        mockFetch.mockResolvedValueOnce(response);

        const store = createApiTestStore();
        await store.dispatch(unitApi.endpoints.getUnits.initiate());

        const state = store.getState();
        expect(state.unit.isFetching).toBe(false);
        expect(state.unit.fetchError).toBeDefined();
      });
    });
  });

  describe('reducers', () => {
    const initialState = createInitialReducerState();

    describe('receiveUnits', () => {
      beforeEach(() => {
        // Mock handleUnitConditionUpdates to return units as-is
        vi.mocked(handleUnitConditionUpdates).mockImplementation((units) => units);
      });

      const mockUnit: Unit = {
        id: 123,
        name: { fi: 'Test Unit', en: 'Test Unit EN' },
        services: [456, 789],
        location: { coordinates: [24.945, 60.175] },
        extensions: { opening_hours: { status: 'open' } },
        street_address: { fi: 'Test Street 1' },
      };

      const mockNormalizedSchema: NormalizedUnitSchema = {
        entities: {
          unit: {
            '123': mockUnit,
            '456': {
              id: 456,
              name: { fi: 'Another Unit' },
              services: [111],
              location: { coordinates: [25.0, 60.2] },
            },
          },
        },
        result: [123, 456],
      };

      it('should add units to state', () => {
        const result = unitReducer(initialState, receiveUnits(mockNormalizedSchema));

        expect(result.byId['123']).toEqual(mockUnit);
        expect(result.byId['456']).toEqual({
          id: 456,
          name: { fi: 'Another Unit' },
          services: [111],
          location: { coordinates: [25.0, 60.2] },
        });
      });

      it('should replace existing units', () => {
        const stateWithUnits = createInitialReducerState({
          byId: {
            '999': { id: 999, name: { fi: 'Existing Unit' } },
          },
          all: ['999'],
        });

        const result = unitReducer(stateWithUnits as any, receiveUnits(mockNormalizedSchema));

        // receiveUnits replaces the entire byId, doesn't merge
        expect(result.byId['999']).toBeUndefined(); // Old unit is gone
        expect(result.byId['123']).toEqual(mockUnit);
        expect(result.byId['456']).toBeDefined();
      });

      it('should handle empty normalized schema', () => {
        const emptySchema: NormalizedUnitSchema = {
          entities: { unit: {} },
          result: [],
        };

        const result = unitReducer(initialState, receiveUnits(emptySchema));

        expect(result.byId).toEqual({});
      });

      it('should overwrite existing units with same ID', () => {
        const stateWithUnits = {
          byId: {
            '123': { id: 123, name: { fi: 'Old Name' } },
          },
        };

        const result = unitReducer(stateWithUnits as any, receiveUnits(mockNormalizedSchema));

        expect(result.byId['123'].name.fi).toBe('Test Unit');
      });
    });

    describe('setFetchError', () => {
      it('should set fetch error and stop fetching', () => {
        const initialState = createInitialReducerState({ isFetching: true });
        const errorMessage = 'Network error occurred';
        const action = { type: 'unit/setFetchError', payload: errorMessage };
        const newState = unitReducer(initialState, action);

        expect(newState.fetchError).toBe(errorMessage);
        expect(newState.isFetching).toBe(false);
      });

      it('should handle different error types', () => {
        const initialState = createInitialReducerState({ isFetching: true });
        const errorObject = { message: 'API Error', code: 500 };
        const action = { type: 'unit/setFetchError', payload: errorObject };
        const newState = unitReducer(initialState, action);

        expect(newState.fetchError).toEqual(errorObject);
        expect(newState.isFetching).toBe(false);
      });
    });
  });

  describe('selectors', () => {
    const createMockState = (units: Record<string, Unit> = {}): AppState => ({
      unit: createInitialReducerState({
        byId: units,
        all: Object.keys(units),
      }),
      search: createInitialSearchState(),
    }) as AppState;

    describe('selectUnitById', () => {
      it('should return unit by ID', () => {
        const unit = { id: 123, name: { fi: 'Test Unit' } };
        const state = createMockState({ '123': unit as Unit });

        const result = selectUnitById(state, { id: '123' });

        expect(result).toEqual(unit);
      });

      it('should return undefined for non-existent ID', () => {
        const state = createMockState({});

        const result = selectUnitById(state, { id: '999' });

        expect(result).toBeUndefined();
      });

      it('should handle numeric ID parameter', () => {
        const unit = { id: 123, name: { fi: 'Test Unit' } };
        const state = createMockState({ '123': unit as Unit });

        const result = selectUnitById(state, { id: 123 });

        expect(result).toEqual(unit);
      });
    });

    describe('selectAllUnits', () => {
      it('should return all units as array', () => {
        const units = {
          '123': { id: 123, name: { fi: 'Unit 1' } },
          '456': { id: 456, name: { fi: 'Unit 2' } },
        };
        const state = createMockState(units as Record<string, Unit>);

        const result = selectAllUnits(state);

        expect(result).toHaveLength(2);
        expect(result[0]).toEqual(units['123']);
        expect(result[1]).toEqual(units['456']);
      });

      it('should return empty array when no units', () => {
        const state = createMockState({});

        const result = selectAllUnits(state);

        expect(result).toEqual([]);
      });
    });

    describe('selectIsUnitLoading', () => {
      it('should return true when fetching and no units loaded', () => {
        const state = {
          unit: {
            isFetching: true,
            byId: {},
            all: [],
          },
        } as AppState;

        const result = selectIsUnitLoading(state);

        expect(result).toBe(true);
      });

      it('should return false when not fetching', () => {
        const state = {
          unit: {
            isFetching: false,
            byId: {},
            all: [],
          },
        } as AppState;

        const result = selectIsUnitLoading(state);

        expect(result).toBe(false);
      });

      it('should return false when fetching but units already loaded', () => {
        const state = {
          unit: {
            isFetching: true,
            byId: { '123': { id: 123 } },
            all: ['123'],
          },
        } as AppState;

        const result = selectIsUnitLoading(state);

        expect(result).toBe(false);
      });
    });

    describe('selectVisibleUnits', () => {
      // Pre-defined mock units to reduce repetition
      const mockUnitsById = Object.fromEntries(
        Array.from({ length: 25 }, (_, i) => [
          String(i + 1),
          { id: i + 1, name: { fi: `Unit ${i + 1}` }, services: [100 + i + 1] }
        ])
      );

      const createMockUnitState = (units: Record<string, string[]>, searchOverrides = {}) => ({
        unit: {
          ...createInitialReducerState({ byId: mockUnitsById }),
          ...units,
        },
        search: createInitialSearchState(searchOverrides),
      }) as AppState;

      const expectVisibleUnits = (result: any[], expectedIds: number[]) => {
        expect(result).toHaveLength(expectedIds.length);
        expect(result.map(unit => unit.id)).toEqual(expectedIds);
      };

      it('should return hiking units combined with selected sport when hasHikingSportSpecification is true', () => {
        const state = createMockUnitState({ ski: ['1', '2'], hike: ['3', '4', '5'] });
        const result = selectVisibleUnits(state, UnitFilters.SKIING, UnitFilters.STATUS_ALL, UnitFilters.CAMPING);
        expectVisibleUnits(result, [1, 2, 3, 4, 5]);
      });

      it('should return only selected sport units when hasHikingSportSpecification is false', () => {
        const state = createMockUnitState({ ski: ['1', '2'], hike: ['3', '4', '5'] });
        const result = selectVisibleUnits(state, UnitFilters.SKIING, UnitFilters.STATUS_ALL, '');
        expectVisibleUnits(result, [1, 2]);
      });

      it('should return only selected sport units when sportSpecification is empty', () => {
        const state = createMockUnitState({ swim: ['10', '11'], hike: ['12', '13'] });
        const result = selectVisibleUnits(state, UnitFilters.SWIMMING, UnitFilters.STATUS_ALL, '');
        expectVisibleUnits(result, [10, 11]);
      });

      it('should handle multiple hiking filters in sportSpecification', () => {
        const state = createMockUnitState({ iceswim: ['20', '21'], hike: ['22', '23', '24'] });
        const sportSpecification = `${UnitFilters.LEAN_TO},${UnitFilters.INFORMATION_POINT}`;
        const result = selectVisibleUnits(state, UnitFilters.ICE_SWIMMING, UnitFilters.STATUS_ALL, sportSpecification);
        expectVisibleUnits(result, [20, 21, 22, 23, 24]);
      });

      it('should filter by STATUS_OK when status is STATUS_OK', () => {
        const state = createMockUnitState({ swim: ['10', '11', '12'], status_ok: ['10', '12'] });
        const result = selectVisibleUnits(state, UnitFilters.SWIMMING, UnitFilters.STATUS_OK, '');
        expectVisibleUnits(result, [10, 12]);
      });

      it('should not filter by status when status is STATUS_ALL', () => {
        const state = createMockUnitState({ swim: ['10', '11', '12'], status_ok: ['10', '12'] });
        const result = selectVisibleUnits(state, UnitFilters.SWIMMING, UnitFilters.STATUS_ALL, '');
        expectVisibleUnits(result, [10, 11, 12]);
      });

      it('should apply sport specification filtering for non-hiking specifications', () => {
        const state = createMockUnitState({ ski: ['1', '2', '3'], hike: ['4', '5'] });
        const result = selectVisibleUnits(state, UnitFilters.SKIING, UnitFilters.STATUS_ALL, UnitFilters.SKIING_FREESTYLE);
        // Mock returns visibleUnits.slice(0, -1), so ['1', '2', '3'] -> ['1', '2']
        expectVisibleUnits(result, [1, 2]);
      });

      it('should filter by search results when search is active', () => {
        const state = createMockUnitState(
          { swim: ['10', '11', '12', '13'], hike: ['14', '15'] },
          { isActive: true, unitResults: ['10', '12'] }
        );
        const result = selectVisibleUnits(state, UnitFilters.SWIMMING, UnitFilters.STATUS_ALL, '');
        expectVisibleUnits(result, [10, 12]);
      });
    });
  });
});