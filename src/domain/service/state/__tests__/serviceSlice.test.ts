import { vi, describe, expect, it, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';
import { normalize, schema } from 'normalizr';

import {
  serviceApi,
  serviceSchema,
  selectServicesState,
  selectServicesObject,
  selectIsFetchingService,
  type Service,
  type NormalizedServicesState,
} from '../serviceSlice';

// Mock fetch for testing API calls
const mockFetch = vi.fn();
globalThis.fetch = mockFetch;

// Mock the serviceHelpers
vi.mock('../serviceHelpers', () => ({
  getOnSeasonServices: vi.fn(() => '123,456,789'),
}));

describe('serviceSlice', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  // Helper functions for API testing
  const createApiTestStore = () => configureStore({
    reducer: {
      [serviceApi.reducerPath]: serviceApi.reducer,
    },
    middleware: (gDM) => gDM().concat(serviceApi.middleware),
  });

  const createMockResponse = (data: any, status = 200) => new Response(JSON.stringify(data), {
    status,
    statusText: status === 200 ? 'OK' : 'Error',
    headers: { 'Content-Type': 'application/json' },
  });

  const mockServices: Service[] = [
    {
      id: 1,
      name: { fi: 'Hiihto', en: 'Skiing' },
    },
    {
      id: 2,
      name: { fi: 'Uinti', en: 'Swimming' },
    },
  ] as Service[];

  // Helper function to create mock service data
  const createMockServiceData = (services: Array<{id: number, name: {fi: string, en?: string}}> = [{id: 1, name: {fi: 'Test'}}]): NormalizedServicesState => {
    const servicesWithDefaults = services.map(s => ({ id: s.id, name: s.name } as Service));
    const normalized = normalize(servicesWithDefaults, new schema.Array(serviceSchema));
    return {
      byId: normalized.entities.service || {},
      all: normalized.result || [],
    };
  };

  describe('API endpoints', () => {
    describe('getServices', () => {
      it('should make correct API request and normalize response', async () => {
        const mockResponse = { results: mockServices };
        mockFetch.mockResolvedValueOnce(createMockResponse(mockResponse));

        const store = createApiTestStore();
        const result = await store.dispatch(serviceApi.endpoints.getServices.initiate());

        // Verify the query was successful and data was normalized
        expect(result.data?.byId).toBeDefined();
        expect(result.data?.all).toEqual(['1', '2']);

        // Verify the fetch was called with correct parameters
        expect(mockFetch).toHaveBeenCalledTimes(1);
        const [request] = mockFetch.mock.calls[0];
        
        expect(request.url).toContain('service/');
        expect(request.url).toContain('id='); // Service API uses id parameter
        expect(request.url).toContain('page_size=1000');
        expect(request.method).toBe('GET');
      });

      it('should handle API error response', async () => {
        const response = new Response(JSON.stringify({ error: 'Services not found' }), {
          status: 404,
          statusText: 'Not Found',
          headers: { 'Content-Type': 'application/json' },
        });
        
        mockFetch.mockResolvedValueOnce(response);

        const store = createApiTestStore();
        const result = await store.dispatch(serviceApi.endpoints.getServices.initiate());

        expect(result.error).toBeDefined();
        expect(result.error?.status).toBe(404);
      });

      it('should handle empty results', async () => {
        const mockResponse = { results: [] };
        mockFetch.mockResolvedValueOnce(createMockResponse(mockResponse));

        const store = createApiTestStore();
        const result = await store.dispatch(serviceApi.endpoints.getServices.initiate());

        // Empty results should still normalize to proper structure
        expect(result.data?.all).toEqual([]);
        expect(result.data?.byId).toEqual({});
      });
    });
  });

  describe('schema configuration', () => {
    it('should use id as string for entity normalization', () => {
      const mockService: Service = {
        id: 123,
        name: { fi: 'Test Service', en: 'Test Service EN' },
      };

      const normalized = normalize(mockService, serviceSchema);
      
      expect(normalized.entities.service).toHaveProperty('123');
      expect(normalized.result).toBe('123');
    });

    it('should handle array normalization correctly', () => {
      const mockServices: Service[] = [
        { id: 1, name: { fi: 'Service 1' } },
        { id: 2, name: { fi: 'Service 2' } },
      ];

      const normalized = normalize(mockServices, new schema.Array(serviceSchema));

      expect(normalized.entities.service).toHaveProperty('1');
      expect(normalized.entities.service).toHaveProperty('2');
      expect(normalized.result).toEqual(['1', '2']);
    });
  });

  describe('selectors', () => {
    const createMockState = (queryData?: NormalizedServicesState, isLoading = false, isFetching = false) => ({
      api: {
        queries: {
          'getServices(undefined)': {
            status: isLoading ? 'pending' : 'fulfilled',
            data: queryData,
            isLoading,
            isFetching,
            // Add additional RTK Query properties that might be checked
            originalArgs: undefined,
            requestId: 'test-request-id',
            startedTimeStamp: Date.now(),
          },
        },
      },
    }) as any;

    describe('selectServicesState', () => {
      it('should return services data when available', () => {
        const mockData = createMockServiceData();
        const state = createMockState(mockData);

        const result = selectServicesState(state);

        expect(result).toEqual(mockData);
      });

      it('should return empty state when no data available', () => {
        const state = createMockState();

        const result = selectServicesState(state);

        expect(result).toEqual({ byId: {}, all: [] });
      });
    });

    describe('selectServicesObject', () => {
      it('should return byId object from services state', () => {
        const mockData = createMockServiceData();
        const state = createMockState(mockData);

        const result = selectServicesObject(state);

        expect(result).toEqual(mockData.byId);
      });

      it('should return empty object when no services', () => {
        const state = createMockState();

        const result = selectServicesObject(state);

        expect(result).toEqual({});
      });
    });

    describe('selectIsFetchingService', () => {
      it('should return true when isLoading is true', () => {
        const state = createMockState(undefined, true, false);

        const result = selectIsFetchingService(state);

        expect(result).toBe(true);
      });

      it('should return true when isFetching is true', () => {
        const state = createMockState(undefined, false, true);

        const result = selectIsFetchingService(state);

        expect(result).toBe(true);
      });

      it('should return true when both isLoading and isFetching are true', () => {
        const state = createMockState(undefined, true, true);

        const result = selectIsFetchingService(state);

        expect(result).toBe(true);
      });

      it('should return false when neither isLoading nor isFetching', () => {
        const state = createMockState(undefined, false, false);

        const result = selectIsFetchingService(state);

        expect(result).toBe(false);
      });

      it('should default to false when query result is not available', () => {
        const state = { api: { queries: {} } };

        const result = selectIsFetchingService(state as any);

        expect(result).toBe(false);
      });
    });
  });
});