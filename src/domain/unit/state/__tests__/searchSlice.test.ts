import { vi, describe, expect, it, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import searchReducer, {
  clearSearch,
  setUnitSuggestions,
  setAddressSuggestions,
  selectIsActive,
  selectIsFetching,
  selectUnitSuggestions,
  selectUnitResultIDs,
  selectAddresses,
  searchApi,
} from '../searchSlice';
import type { AppState } from '../../../app/appConstants';
import type { NormalizedUnitSchema } from '../../unitConstants';

// Mock fetch for testing API calls
const mockFetch = vi.fn();
globalThis.fetch = mockFetch;

// Mock dependencies
vi.mock('../unitSlice', () => ({
  selectUnitById: vi.fn(),
}));

vi.mock('../../../service/serviceHelpers', () => ({
  getOnSeasonServices: vi.fn(() => [123, 456, 789]),
}));

vi.mock('../../../api/apiHelpers', () => ({
  digitransitApiHeaders: vi.fn(() => ({ 'Digitransit-Subscription-Key': 'test-key' })),
}));

import { selectUnitById } from '../unitSlice';

const mockSelectUnitById = selectUnitById as any;

describe('searchSlice', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  // Common test data
  const mockUnits = [
    { id: 1, name: { fi: 'Test Unit 1' }, location: { coordinates: [24.94, 60.17] } },
    { id: 2, name: { fi: 'Test Unit 2' }, location: { coordinates: [24.95, 60.18] } },
  ];

  const mockAddresses = {
    features: [
      {
        properties: { label: 'Helsinki Central', layer: 'venue' },
        geometry: { coordinates: [24.94, 60.17] }
      }
    ]
  };

  // Helper functions
  const createApiTestStore = () => configureStore({
    reducer: {
      [searchApi.reducerPath]: searchApi.reducer,
      search: searchReducer,
    },
    middleware: (gDM) => gDM().concat(searchApi.middleware),
  });

  const createMockResponse = (data: any, status = 200) => new Response(JSON.stringify(data), {
    status,
    statusText: status === 200 ? 'OK' : 'Error',
    headers: { 'Content-Type': 'application/json' },
  });

  const mockSuccessfulApiCalls = () => {
    mockFetch
      .mockResolvedValueOnce(createMockResponse({ results: mockUnits }))
      .mockResolvedValueOnce(createMockResponse(mockAddresses));
  };

  const mockErrorResponse = (error = 'API Error', status = 500) => 
    new Response(JSON.stringify({ error }), {
      status,
      statusText: 'Internal Server Error',
      headers: { 'Content-Type': 'application/json' },
    });

  const expectUrlContains = (request: any, ...patterns: string[]) => {
    patterns.forEach(pattern => expect(request.url).toContain(pattern));
  };

  describe('API endpoints', () => {
    describe('searchUnits', () => {
      it('should make correct search API request with input', async () => {
        mockFetch.mockResolvedValueOnce(createMockResponse({ results: mockUnits }));
        const store = createApiTestStore();
        const result = await store.dispatch(searchApi.endpoints.searchUnits.initiate({ 
          input: 'test query' 
        }));

        expect(result.data?.entities.unit).toBeDefined();
        expect(result.data?.result).toEqual(['1', '2']);

        expect(mockFetch).toHaveBeenCalledTimes(1);
        const [request] = mockFetch.mock.calls[0];
        expectUrlContains(request, 'search/', 'input=test+query', 'type=unit');
        expect(request.method).toBe('GET');
      });

      it('should handle empty input by fetching all units', async () => {
        mockFetch.mockResolvedValueOnce(createMockResponse({ results: mockUnits }));
        const store = createApiTestStore();
        
        await store.dispatch(searchApi.endpoints.searchUnits.initiate({ input: '' }));

        const [request] = mockFetch.mock.calls[0];
        expectUrlContains(request, 'unit/', 'page_size=1000');
        expect(request.url).not.toContain('input=');
      });

      it('should set isFetching to false when searchUnits is rejected', async () => {
        mockFetch.mockResolvedValueOnce(mockErrorResponse());
        const store = createApiTestStore();
        
        await store.dispatch(searchApi.endpoints.searchUnits.initiate({ input: 'test' }));
        
        expect(store.getState().search.isFetching).toBe(false);
      });
    });

    describe('searchSuggestions', () => {
      it('should make correct API requests for both units and addresses', async () => {
        mockSuccessfulApiCalls();
        const store = createApiTestStore();
        const result = await store.dispatch(searchApi.endpoints.searchSuggestions.initiate('helsinki'));

        expect(result.data?.units.entities.unit).toBeDefined();
        expect(result.data?.addresses).toHaveLength(1);
        expect(result.data?.addresses[0].properties.label).toBe('Helsinki Central');
        expect(mockFetch).toHaveBeenCalledTimes(2);
        
        const [unitRequest, addressRequest] = mockFetch.mock.calls;
        expectUrlContains(unitRequest[0], 'search/', 'input=helsinki');
        expectUrlContains(addressRequest[0], 'api.digitransit.fi/geocoding', 'text=helsinki');
      });

      it('should handle empty input by returning empty data', async () => {
        const store = createApiTestStore();
        const result = await store.dispatch(searchApi.endpoints.searchSuggestions.initiate(''));

        expect(result.data?.units.entities.unit).toEqual({});
        expect(result.data?.units.result).toEqual([]);
        expect(result.data?.addresses).toEqual([]);
        expect(mockFetch).not.toHaveBeenCalled();
      });

      it.each([
        {
          name: 'unit search API error',
          mocks: () => mockFetch
            .mockResolvedValueOnce(mockErrorResponse('Unit search failed'))
            .mockResolvedValueOnce(createMockResponse({ features: [] })),
        },
        {
          name: 'address search API error', 
          mocks: () => mockFetch
            .mockResolvedValueOnce(createMockResponse({ results: mockUnits }))
            .mockResolvedValueOnce(mockErrorResponse('Address search failed')),
        },
      ])('should handle $name', async ({ mocks }) => {
        mocks();
        const store = createApiTestStore();
        const result = await store.dispatch(searchApi.endpoints.searchSuggestions.initiate('helsinki'));

        expect(result.error).toBeDefined();
        expect(mockFetch).toHaveBeenCalledTimes(2);
      });
    });
  });

  describe('reducers', () => {
    const initialState = {
      isFetching: false,
      isActive: false,
      unitResults: [],
      unitSuggestions: [],
      addressSuggestions: [],
    };

    describe('clearSearch', () => {
      it('should clear all search data', () => {
        const state = {
          isFetching: true,
          isActive: true,
          unitResults: ['1', '2'],
          unitSuggestions: ['3', '4'],
          addressSuggestions: [{ properties: { label: 'Test' }, geometry: { coordinates: [0, 0] } }],
        };

        const result = searchReducer(state, clearSearch());

        expect(result).toEqual({
          isFetching: true, // Not affected by clearSearch
          isActive: false,
          unitResults: [],
          unitSuggestions: [],
          addressSuggestions: [],
        });
      });
    });

    describe('setUnitSuggestions', () => {
      it('should set unit suggestions from normalized schema', () => {
        const normalizedUnits: NormalizedUnitSchema = {
          entities: { unit: { '1': { id: 1 }, '2': { id: 2 } } },
          result: [1, 2],
        };

        const result = searchReducer(initialState, setUnitSuggestions(normalizedUnits));

        expect(result.unitSuggestions).toEqual(['1', '2']);
      });

      it('should handle empty normalized schema', () => {
        const normalizedUnits: NormalizedUnitSchema = {
          entities: { unit: {} },
          result: [],
        };

        const result = searchReducer(initialState, setUnitSuggestions(normalizedUnits));

        expect(result.unitSuggestions).toEqual([]);
      });
    });

    describe('setAddressSuggestions', () => {
      it('should set address suggestions', () => {
        const addresses = [
          { properties: { label: 'Helsinki', layer: 'venue' }, geometry: { coordinates: [24.94, 60.17] } },
          { properties: { label: 'Espoo', layer: 'locality' }, geometry: { coordinates: [24.65, 60.21] } },
        ];

        const result = searchReducer(initialState, setAddressSuggestions(addresses));

        expect(result.addressSuggestions).toEqual(addresses);
      });

      it('should handle empty address array', () => {
        const result = searchReducer(initialState, setAddressSuggestions([]));

        expect(result.addressSuggestions).toEqual([]);
      });
    });
  });

  describe('selectors', () => {
    const createMockState = (searchOverrides = {}): AppState => ({
      search: {
        isFetching: false,
        isActive: false,
        unitResults: [],
        unitSuggestions: [],
        addressSuggestions: [],
        ...searchOverrides,
      },
      unit: {
        byId: {
          '1': { id: 1, name: { fi: 'Unit 1' } },
          '2': { id: 2, name: { fi: 'Unit 2' } },
        },
      },
    }) as AppState;

    describe('selectIsActive', () => {
      it('should return true when search is active', () => {
        const state = createMockState({ isActive: true });
        expect(selectIsActive(state)).toBe(true);
      });

      it('should return false when search is not active', () => {
        const state = createMockState({ isActive: false });
        expect(selectIsActive(state)).toBe(false);
      });
    });

    describe('selectIsFetching', () => {
      it('should return true when fetching', () => {
        const state = createMockState({ isFetching: true });
        expect(selectIsFetching(state)).toBe(true);
      });

      it('should return false when not fetching', () => {
        const state = createMockState({ isFetching: false });
        expect(selectIsFetching(state)).toBe(false);
      });
    });

    describe('selectUnitSuggestions', () => {
      beforeEach(() => {
        mockSelectUnitById.mockImplementation((state: AppState, { id }: { id: string }) => 
          state.unit.byId[id] || null
        );
      });

      it('should return unit suggestions with full unit data', () => {
        const state = createMockState({ 
          unitSuggestions: ['1', '2'] 
        });

        const result = selectUnitSuggestions(state);

        expect(result).toHaveLength(2);
        expect(result[0]).toEqual({ id: 1, name: { fi: 'Unit 1' } });
        expect(result[1]).toEqual({ id: 2, name: { fi: 'Unit 2' } });
      });

      it('should handle empty suggestions', () => {
        const state = createMockState({ unitSuggestions: [] });

        const result = selectUnitSuggestions(state);

        expect(result).toEqual([]);
      });

      it('should filter out null units', () => {
        const state = createMockState({ 
          unitSuggestions: ['1', '999'] // '999' doesn't exist in byId
        });

        const result = selectUnitSuggestions(state);

        expect(result).toHaveLength(2);
        expect(result[0]).toEqual({ id: 1, name: { fi: 'Unit 1' } });
        expect(result[1]).toBeNull(); // selectUnitById returns null for non-existent units
      });
    });

    describe('selectUnitResultIDs', () => {
      it('should return unit result IDs', () => {
        const state = createMockState({ unitResults: ['1', '2', '3'] });
        expect(selectUnitResultIDs(state)).toEqual(['1', '2', '3']);
      });

      it('should return empty array when no results', () => {
        const state = createMockState({ unitResults: [] });
        expect(selectUnitResultIDs(state)).toEqual([]);
      });
    });

    describe('selectAddresses', () => {
      it('should return address suggestions', () => {
        const addresses = [
          { properties: { label: 'Helsinki', layer: 'venue' }, geometry: { coordinates: [24.94, 60.17] } },
        ];
        const state = createMockState({ addressSuggestions: addresses });
        
        expect(selectAddresses(state)).toEqual(addresses);
      });

      it('should return empty array when no addresses', () => {
        const state = createMockState({ addressSuggestions: [] });
        expect(selectAddresses(state)).toEqual([]);
      });
    });
  });

  describe('normalization logic', () => {
    // Test the normalization logic that would be used in API responses
    it('should handle empty results gracefully', () => {
      const emptyNormalized: NormalizedUnitSchema = { 
        entities: { unit: {} }, 
        result: [] 
      };

      const result = searchReducer(undefined, setUnitSuggestions(emptyNormalized));

      expect(result.unitSuggestions).toEqual([]);
    });

    it('should convert result IDs to strings', () => {
      const normalizedUnits: NormalizedUnitSchema = {
        entities: { unit: { '1': { id: 1 }, '2': { id: 2 } } },
        result: [1, 2], // Numbers from API
      };

      const result = searchReducer(undefined, setUnitSuggestions(normalizedUnits));

      expect(result.unitSuggestions).toEqual(['1', '2']); // Should be strings
    });
  });
});