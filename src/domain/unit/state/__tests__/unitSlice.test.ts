import { vi, describe, expect, it, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import unitReducer, {
  receiveUnits,
  receiveSeasonalUnits,
  selectUnitById,
  selectAllUnits,
  selectVisibleUnits,
  selectIsUnitLoading,
  selectIsSearchLoading,
  unitApi,
} from '../unitSlice';
import { UnitFilters } from '../../unitConstants';
import { handleUnitConditionUpdates } from '../../unitHelpers';
import { AppState } from '../../../app/types';
import { NormalizedUnitSchema } from '../../types';
import {
  TEST_COORDINATES,
  TEST_SERVICES,
  createInitialReducerState,
  createInitialSearchState,
  createApiTestStore,
  createMockResponse,
  createTranslatableString,
  createMockUnit,
  createMockSchema,
  createBasicMockUnits,
  createMockAppState,
  createTestStoreState,
} from '../../../../tests/testUtils';

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

describe('unitSlice', () => {
  const mockUnits = createBasicMockUnits();

  beforeEach(() => {
    mockFetch.mockClear();
  });

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
        const customParams = { municipality: 'Helsinki', page_size: 500 } as any;
        await store.dispatch(unitApi.endpoints.getUnits.initiate(customParams));

        const [request] = mockFetch.mock.calls[0];
        expect(request.url).toContain('municipality=Helsinki');
        expect(request.url).toContain('page_size=500'); // Custom param should override default
      });

      it('should use provided services when services array has length > 0', async () => {
        const mockResponse = { results: mockUnits };
        mockFetch.mockResolvedValueOnce(createMockResponse(mockResponse));

        const store = createApiTestStore();
        const customServices = [191, 730]; // SKI_TRACK and SWIMMING_PLACE
        await store.dispatch(unitApi.endpoints.getUnits.initiate({ services: customServices }));

        const [request] = mockFetch.mock.calls[0];
        expect(request.url).toContain('service=191%2C730'); // URL encoded comma
      });

      it('should use getOnSeasonServices when services is empty array', async () => {
        const mockResponse = { results: mockUnits };
        mockFetch.mockResolvedValueOnce(createMockResponse(mockResponse));

        const store = createApiTestStore();
        await store.dispatch(unitApi.endpoints.getUnits.initiate({ services: [] }));

        const [request] = mockFetch.mock.calls[0];
        // Should use on-season services since empty array was provided
        expect(request.url).toContain('service=');
        expect(request.url).not.toContain('service=%2C'); // Should not be just commas
      });

      it('should use getOnSeasonServices when services is undefined', async () => {
        const mockResponse = { results: mockUnits };
        mockFetch.mockResolvedValueOnce(createMockResponse(mockResponse));

        const store = createApiTestStore();
        await store.dispatch(unitApi.endpoints.getUnits.initiate({ services: undefined }));

        const [request] = mockFetch.mock.calls[0];
        // Should use on-season services since undefined was provided
        expect(request.url).toContain('service=');
        expect(request.url).not.toContain('service=%2C'); // Should not be just commas
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
        const result = await store.dispatch(unitApi.endpoints.getUnits.initiate()) as any;

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

    describe('getAllSeasonalUnits', () => {
      it('should store seasonal units when getAllSeasonalUnits.matchFulfilled', async () => {
        const mockSeasonalUnits = [
          createMockUnit(501, { services: [TEST_SERVICES.SKIING] }),
          createMockUnit(502, { 
            location: { coordinates: TEST_COORDINATES.ESPOO },
            services: [TEST_SERVICES.SWIMMING]
          }),
        ];

        const mockResponse = { results: mockSeasonalUnits };
        mockFetch.mockResolvedValueOnce(createMockResponse(mockResponse));

        const store = createApiTestStore();
        const result = await store.dispatch(unitApi.endpoints.getAllSeasonalUnits.initiate());

        // Verify the query was successful and seasonal data was stored
        expect(result.data?.entities.unit).toBeDefined();
        expect(result.data?.result).toEqual(['501', '502']);

        const state = store.getState();
        // Verify seasonal units are stored via the matchFulfilled matcher
        expect(state.unit.seasonalById['501']).toBeDefined();
        expect(state.unit.seasonalById['502']).toBeDefined();
        expect(state.unit.seasonalAll).toEqual(['501', '502']);
        expect(state.unit.seasonalSki).toContain('501');
        expect(state.unit.seasonalSwim).toContain('502');

        // Verify the fetch was called with correct parameters
        expect(mockFetch).toHaveBeenCalledTimes(1);
        const [request] = mockFetch.mock.calls[0];
        expect(request.url).toContain('unit/');
        expect(request.url).toContain('service='); // Should include on-season services
        expect(request.method).toBe('GET');
      });
    });
  });

  describe('reducers', () => {
    const initialState = createInitialReducerState();

    describe('receiveUnits', () => {
      beforeEach(() => {
        vi.mocked(handleUnitConditionUpdates).mockImplementation((units) => units);
      });

      const testUnits = [
        createMockUnit(123, {
          name: createTranslatableString('Test Unit'),
          services: [456, 789],
          extensions: {},
          street_address: createTranslatableString('Test Street 1'),
        }),
        createMockUnit(456, {
          name: createTranslatableString('Another Unit'),
          services: [111],
          location: { coordinates: TEST_COORDINATES.VANTAA },
        }),
      ];
      const mockNormalizedSchema = createMockSchema(testUnits);

      it('should add units to state', () => {
        const result = unitReducer(initialState, receiveUnits(mockNormalizedSchema));

        expect(result.byId['123']).toEqual(testUnits[0]);
        expect(result.byId['456']).toEqual(testUnits[1]);
      });

      it('should replace existing units', () => {
        const stateWithUnits = createInitialReducerState({
          byId: {
            '999': createMockUnit(999, { name: createTranslatableString('Existing Unit') }),
          },
          all: ['999'],
        });

        const result = unitReducer(stateWithUnits as any, receiveUnits(mockNormalizedSchema));

        // receiveUnits replaces the entire byId, doesn't merge
        expect(result.byId['999']).toBeUndefined(); // Old unit is gone
        expect(result.byId['123']).toEqual(testUnits[0]);
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
            '123': createMockUnit(123, { name: createTranslatableString('Old Name') }),
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

    describe('receiveSeasonalUnits', () => {
      beforeEach(() => {
        vi.mocked(handleUnitConditionUpdates).mockImplementation((units) => units);
      });

      const seasonalUnits = [
        createMockUnit(789, {
          name: createTranslatableString('Seasonal Unit'),
          services: [102, 103],
          extensions: {},
          street_address: createTranslatableString('Seasonal Street 1'),
        }),
        createMockUnit(890, {
          name: createTranslatableString('Another Seasonal Unit'),
          services: [201],
          location: { coordinates: TEST_COORDINATES.VANTAA },
        }),
      ];
      const mockSeasonalSchema = createMockSchema(seasonalUnits);

      it('should add seasonal units to state', () => {
        const result = unitReducer(initialState, receiveSeasonalUnits(mockSeasonalSchema));

        expect(result.seasonalById['789']).toEqual(seasonalUnits[0]);
        expect(result.seasonalById['890']).toEqual(seasonalUnits[1]);
        expect(result.seasonalAll).toEqual(['789', '890']);
      });

      it('should replace existing seasonal units', () => {
        const stateWithSeasonalUnits = createInitialReducerState({
          seasonalById: {
            '999': createMockUnit(999, { name: createTranslatableString('Existing Seasonal Unit') }),
          },
          seasonalAll: ['999'],
        });

        const result = unitReducer(stateWithSeasonalUnits as any, receiveSeasonalUnits(mockSeasonalSchema));

        // receiveSeasonalUnits replaces the entire seasonalById, doesn't merge
        expect(result.seasonalById['999']).toBeUndefined(); // Old unit is gone
        expect(result.seasonalById['789']).toEqual(seasonalUnits[0]);
        expect(result.seasonalById['890']).toBeDefined();
        expect(result.seasonalAll).toEqual(['789', '890']);
      });

      it('should handle empty normalized schema for seasonal units', () => {
        const emptySchema: NormalizedUnitSchema = {
          entities: { unit: {} },
          result: [],
        };

        const result = unitReducer(initialState, receiveSeasonalUnits(emptySchema));

        expect(result.seasonalById).toEqual({});
        expect(result.seasonalAll).toEqual([]);
      });

      it('should return early if no entities.unit in payload', () => {
        const schemaWithoutUnits = {
          entities: {},
          result: [123],
        } as NormalizedUnitSchema;

        const result = unitReducer(initialState, receiveSeasonalUnits(schemaWithoutUnits));

        // State should remain unchanged
        expect(result).toEqual(initialState);
      });

      it('should call handleUnitConditionUpdates for seasonal units', () => {
        const mockHandleUnitConditionUpdates = vi.mocked(handleUnitConditionUpdates);
        mockHandleUnitConditionUpdates.mockReturnValue({ '789': seasonalUnits[0] });

        unitReducer(initialState, receiveSeasonalUnits(mockSeasonalSchema));

        expect(mockHandleUnitConditionUpdates).toHaveBeenCalledWith({
          789: seasonalUnits[0],
          890: seasonalUnits[1],
        });
      });

      it('should convert result IDs to strings', () => {
        const schemaWithNumberIds = {
          entities: {
            unit: {
              123: createMockUnit(123, { 
                name: createTranslatableString('Unit 123'), 
                services: [102] 
              }),
            },
          },
          result: [123], // number ID
        } as unknown as NormalizedUnitSchema;

        const result = unitReducer(initialState, receiveSeasonalUnits(schemaWithNumberIds));

        expect(result.seasonalAll).toEqual(['123']); // Should be converted to string
      });

      it('should update seasonal filtered arrays based on services', () => {
        const mixedServiceUnits = [
          createMockUnit(100, { services: [TEST_SERVICES.SKIING] }),
          createMockUnit(200, { services: [TEST_SERVICES.SWIMMING] }),
        ];
        const schemaWithMixedServices = createMockSchema(mixedServiceUnits);

        const result = unitReducer(initialState, receiveSeasonalUnits(schemaWithMixedServices));

        // Should have populated seasonal arrays based on services
        expect(result.seasonalSki).toContain('100');
        expect(result.seasonalSwim).toContain('200');
      });
    });
  });

  describe('selectors', () => {
    describe('selectUnitById', () => {
      it('should return unit by ID', () => {
        const testUnit = createMockUnit(123, { name: createTranslatableString('Test Unit') });
        const state = createMockAppState({ byId: { '123': testUnit }, all: ['123'] });

        const result = selectUnitById(state, { id: '123' });

        expect(result).toEqual(testUnit);
      });

      it('should return undefined for non-existent ID', () => {
        const state = createMockAppState();

        const result = selectUnitById(state, { id: '999' });

        expect(result).toBeUndefined();
      });

      it('should handle numeric ID parameter', () => {
        const testUnit = createMockUnit(123, { name: createTranslatableString('Test Unit') });
        const state = createMockAppState({ byId: { '123': testUnit }, all: ['123'] });

        const result = selectUnitById(state, { id: 123 });

        expect(result).toEqual(testUnit);
      });
    });

    describe('selectAllUnits', () => {
      it('should return all units as array', () => {
        const testUnits = {
          '123': createMockUnit(123, { name: createTranslatableString('Unit 1') }),
          '456': createMockUnit(456, { name: createTranslatableString('Unit 2') }),
        };
        const state = createMockAppState({ 
          byId: testUnits, 
          all: Object.keys(testUnits) 
        });

        const result = selectAllUnits(state);

        expect(result).toHaveLength(2);
        expect(result[0]).toEqual(testUnits['123']);
        expect(result[1]).toEqual(testUnits['456']);
      });

      it('should return empty array when no units', () => {
        const state = createMockAppState();

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
        } as unknown as AppState;

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
        } as unknown as AppState;

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
        } as unknown as AppState;

        const result = selectIsUnitLoading(state);

        expect(result).toBe(false);
      });
    });

    describe('selectVisibleUnits', () => {
      // Pre-defined mock units to reduce repetition
      const mockUnitsById = Object.fromEntries(
        Array.from({ length: 25 }, (_, i) => [
          String(i + 1),
          createMockUnit(i + 1, { 
            name: createTranslatableString(`Unit ${i + 1}`), 
            services: [100 + i + 1] 
          })
        ])
      );

      const createMockUnitState = (units: Record<string, string[]>, searchOverrides = {}) => ({
        unit: {
          ...createInitialReducerState({ byId: mockUnitsById }),
          ...units,
        },
        search: createInitialSearchState(searchOverrides),
      }) as unknown as AppState;

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

    describe('selectIsSearchLoading', () => {
      // Helper to create a proper store with initial state
      const createTestStore = (apiState = {}) => {
        const store = configureStore({
          reducer: {
            api: unitApi.reducer,
            unit: unitReducer,
            map: () => ({}),
            search: () => ({ isActive: false, unitResults: [], query: '' }),
          },
          preloadedState: createTestStoreState(apiState),
        });
        return store.getState() as unknown as AppState;
      };

      it('should return true when getAllSeasonalUnits query is loading', () => {
        const state = createTestStore({
          queries: {
            'getAllSeasonalUnits(undefined)': {
              status: 'pending',
              endpointName: 'getAllSeasonalUnits',
              requestId: 'test-id',
            },
          },
        });

        const result = selectIsSearchLoading(state);

        expect(result).toBe(true);
      });

      it('should return false when getAllSeasonalUnits query is not loading', () => {
        const state = createTestStore({
          queries: {
            'getAllSeasonalUnits(undefined)': {
              status: 'fulfilled',
              endpointName: 'getAllSeasonalUnits',
              requestId: 'test-id',
              data: { entities: {}, result: [] },
            },
          },
        });

        const result = selectIsSearchLoading(state);

        expect(result).toBe(false);
      });

      it('should return false when getAllSeasonalUnits query does not exist', () => {
        const state = createTestStore(); // Uses default empty queries

        const result = selectIsSearchLoading(state);

        expect(result).toBe(false);
      });
    });
  });
});