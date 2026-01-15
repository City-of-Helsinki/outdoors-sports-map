import { configureStore } from '@reduxjs/toolkit';
import { LatLngTuple } from 'leaflet';
import { describe, expect, it, vi, beforeEach } from 'vitest';

import { AppState } from '../../../app/appConstants';
import mapSlice, { 
  setLocation, 
  selectLocation, 
  selectAddress,
  selectAddressByCoordinates,
  mapApi 
} from '../mapSlice';

// Mock fetch for testing API calls
const mockFetch = vi.fn();
globalThis.fetch = mockFetch;

// Mock store setup
const createTestStore = (initialState?: Partial<AppState>) => {
  return configureStore({
    reducer: {
      map: mapSlice,
      api: mapApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(mapApi.middleware),
    preloadedState: initialState as AppState,
  });
};

describe('mapSlice', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  // Helper function to create store for API tests
  const createApiTestStore = () => configureStore({
    reducer: {
      [mapApi.reducerPath]: mapApi.reducer,
    },
    middleware: (gDM) => gDM().concat(mapApi.middleware),
  });

  // Helper function to create mock response
  const createMockResponse = (data: any, status = 200) => new Response(JSON.stringify(data), {
    status,
    statusText: status === 200 ? 'OK' : 'Error',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  describe('API endpoints', () => {
    it('should make correct API request for getAddress', async () => {
      const mockAddress = {
        name: 'Helsinki',
        municipality: 'Helsinki',
        street: { name: 'Mannerheimintie' },
      };
      
      const mockResponse = { results: [mockAddress] };
      mockFetch.mockResolvedValueOnce(createMockResponse(mockResponse));

      const store = createApiTestStore();
      const result = await store.dispatch(mapApi.endpoints.getAddress.initiate({ lat: 60.1699, lon: 24.9384 }));

      // Verify the query was successful and data was transformed correctly
      expect(result.data).toEqual(mockAddress);

      // Verify the fetch was called with correct parameters
      expect(mockFetch).toHaveBeenCalledTimes(1);
      const [request] = mockFetch.mock.calls[0];
      
      expect(request.url).toContain('address/');
      expect(request.url).toContain('lat=60.1699');
      expect(request.url).toContain('lon=24.9384');
      expect(request.url).toContain('page_size=1');
      expect(request.method).toBe('GET');
    });

    it('should handle null results in transformResponse', async () => {
      const mockResponse = { results: null };
      mockFetch.mockResolvedValueOnce(createMockResponse(mockResponse));

      const store = createApiTestStore();
      const result = await store.dispatch(mapApi.endpoints.getAddress.initiate({ lat: 0, lon: 0 }));

      // Should return empty object when results is null - this tests the ({} as Address) line
      expect(result.data).toEqual({});
    });
  });

  describe('reducers', () => {
    it('should set location with setLocation action', () => {
      const initialState = { location: [60.1699, 24.9384] as LatLngTuple };
      const newLocation: LatLngTuple = [61.4991, 23.7871]; // Tampere coordinates
      
      const result = mapSlice(initialState, setLocation(newLocation));
      
      expect(result.location).toEqual(newLocation);
    });
  });

  describe('selectors', () => {
    const testCoords: LatLngTuple = [60.1699, 24.9384];
    const mockAddress = {
      name: 'Helsinki',
      municipality: 'Helsinki',
      street: { name: 'Test Street' },
    };

    // Helper to create base mock state
    const createMockState = (location: LatLngTuple | null = testCoords, queries = {}): AppState => ({
      map: { location },
      api: { queries },
    } as AppState);

    // Helper to create state with cached address data
    const createStateWithCachedAddress = (lat: number, lon: number, address = mockAddress) => {
      const queryKey = `getAddress({"lat":${lat},"lon":${lon}})`;
      return createMockState(testCoords, {
        [queryKey]: { status: 'fulfilled', data: address },
      });
    };

    it('should select location from state', () => {
      const location = selectLocation(createMockState());
      expect(location).toEqual(testCoords);
    });

    it('should return null for selectAddress when location is null', () => {
      const address = selectAddress(createMockState(null));
      expect(address).toBeNull();
    });

    it('should return null for selectAddressByCoordinates when no cached data', () => {
      const address = selectAddressByCoordinates(createMockState(), ...testCoords);
      expect(address).toBeNull();
    });

    it('should return cached address data when available', () => {
      const stateWithCachedData = createStateWithCachedAddress(...testCoords);
      const address = selectAddressByCoordinates(stateWithCachedData, ...testCoords);
      expect(address).toEqual(mockAddress);
    });
  });
});