import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { ReactNode } from 'react';

import useFetchInitialData from '../useFetchInitialData';
import { unitApi } from '../../unit/state/unitSlice';
import { UnitFilters } from '../../unit/unitConstants';
import { createTestStoreState } from '../../../tests/testUtils';

// Mock all the hooks this hook depends on
const mockUseSearch = vi.fn();
const mockUseAppSearch = vi.fn();
const mockUseIsUnitBrowserSearchView = vi.fn();
const mockTriggerSearchUnits = vi.fn();

// Mock the service helpers
const mockGetServicesForSport = vi.fn();
const mockGetOnSeasonServices = vi.fn();

// Mock all the custom hooks
vi.mock('../../../common/hooks/useSearch', () => ({
  default: () => mockUseSearch(),
}));

vi.mock('../../app/useAppSearch', () => ({
  default: () => mockUseAppSearch(),
}));

vi.mock('../../app/useIsUnitBrowserSearchView', () => ({
  default: () => mockUseIsUnitBrowserSearchView(),
}));

vi.mock('../../service/serviceHelpers', () => ({
  getServicesForSport: (...args: any[]) => mockGetServicesForSport(...args),
  getOnSeasonServices: () => mockGetOnSeasonServices(),
}));

// Mock the RTK Query hooks
const mockUseGetServicesQuery = vi.fn();
const mockUseGetAllSeasonalUnitsQuery = vi.fn();
const mockUseGetUnitsQuery = vi.fn();
const mockUseLazySearchUnitsQuery = vi.fn();

vi.mock('../../service/state/serviceSlice', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../service/state/serviceSlice')>();
  return {
    ...actual,
    useGetServicesQuery: (...args: any[]) => mockUseGetServicesQuery(...args),
  };
});

vi.mock('../../unit/state/unitSlice', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../unit/state/unitSlice')>();
  return {
    ...actual,
    useGetUnitsQuery: (...args: any[]) => mockUseGetUnitsQuery(...args),
    useGetAllSeasonalUnitsQuery: (...args: any[]) => mockUseGetAllSeasonalUnitsQuery(...args),
  };
});

vi.mock('../../unit/state/searchSlice', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../../unit/state/searchSlice')>();
  return {
    ...actual,
    useLazySearchUnitsQuery: () => mockUseLazySearchUnitsQuery(),
  };
});

describe('useFetchInitialData', () => {
  // Create a test store
  const createTestStore = () => configureStore({
    reducer: {
      api: unitApi.reducer,
    },
    preloadedState: createTestStoreState(),
  });

  // Wrapper component for the hook
  const createWrapper = (store = createTestStore()) => {
    return ({ children }: { children: ReactNode }) => (
      <Provider store={store}>{children}</Provider>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Setup default mock return values
    mockUseSearch.mockReturnValue({ q: '', sport: UnitFilters.SKIING });
    mockUseAppSearch.mockReturnValue({ sport: UnitFilters.SKIING });
    mockUseIsUnitBrowserSearchView.mockReturnValue(false);
    mockUseLazySearchUnitsQuery.mockReturnValue([mockTriggerSearchUnits]);
    
    // Mock service helpers with realistic values
    mockGetServicesForSport.mockImplementation((sport: string) => {
      switch (sport) {
        case UnitFilters.SKIING: return [191, 318]; // SKI_TRACK, DOG_SKI_TRACK
        case UnitFilters.SWIMMING: return [730, 731, 426]; // SWIMMING services
        case UnitFilters.HIKING: return [365, 586, 698, 734]; // SUPPORTING services
        default: return [];
      }
    });
    mockGetOnSeasonServices.mockReturnValue([191, 318, 365, 586]);
    
    // Mock query hooks to return successful states
    mockUseGetServicesQuery.mockReturnValue({ data: {}, isLoading: false });
    mockUseGetAllSeasonalUnitsQuery.mockReturnValue({ data: {}, isLoading: false });
    mockUseGetUnitsQuery.mockReturnValue({ data: {}, isLoading: false });
  });

  describe('Query execution', () => {
    it('should call useGetServicesQuery to fetch services', () => {
      renderHook(() => useFetchInitialData(), { wrapper: createWrapper() });

      expect(mockUseGetServicesQuery).toHaveBeenCalledTimes(1);
    });

    it('should call useGetAllSeasonalUnitsQuery to fetch seasonal units', () => {
      renderHook(() => useFetchInitialData(), { wrapper: createWrapper() });

      expect(mockUseGetAllSeasonalUnitsQuery).toHaveBeenCalledTimes(1);
    });

    it('should call useGetUnitsQuery with correct services for skiing', () => {
      mockUseAppSearch.mockReturnValue({ sport: UnitFilters.SKIING });

      renderHook(() => useFetchInitialData(), { wrapper: createWrapper() });

      expect(mockUseGetUnitsQuery).toHaveBeenCalledWith(
        { services: [191, 318, 365, 586] }, // skiing + hiking services, filtered by on-season
        { skip: false }
      );
    });

    it('should call useGetUnitsQuery with correct services for swimming', () => {
      mockUseAppSearch.mockReturnValue({ sport: UnitFilters.SWIMMING });
      mockGetOnSeasonServices.mockReturnValue([730, 731, 365, 586]);

      renderHook(() => useFetchInitialData(), { wrapper: createWrapper() });

      expect(mockUseGetUnitsQuery).toHaveBeenCalledWith(
        { services: [365, 586, 730, 731] }, // swimming + hiking services, sorted
        { skip: false }
      );
    });

    it('should skip useGetUnitsQuery when no services are available', () => {
      mockGetOnSeasonServices.mockReturnValue([]);

      renderHook(() => useFetchInitialData(), { wrapper: createWrapper() });

      expect(mockUseGetUnitsQuery).toHaveBeenCalledWith(
        {},
        { skip: true }
      );
    });
  });

  describe('Service filtering and memoization', () => {
    it('should combine sport services with hiking services', () => {
      mockUseAppSearch.mockReturnValue({ sport: UnitFilters.SKIING });

      renderHook(() => useFetchInitialData(), { wrapper: createWrapper() });

      // Should call getServicesForSport for both skiing and hiking
      expect(mockGetServicesForSport).toHaveBeenCalledWith(UnitFilters.SKIING);
      expect(mockGetServicesForSport).toHaveBeenCalledWith(UnitFilters.HIKING);
    });

    it('should filter services by on-season services', () => {
      mockUseAppSearch.mockReturnValue({ sport: UnitFilters.SKIING });
      mockGetServicesForSport.mockImplementation((sport) => {
        if (sport === UnitFilters.SKIING) return [191, 318];
        if (sport === UnitFilters.HIKING) return [365, 586, 999]; // 999 not in on-season
        return [];
      });
      mockGetOnSeasonServices.mockReturnValue([191, 318, 365, 586]); // 999 excluded

      renderHook(() => useFetchInitialData(), { wrapper: createWrapper() });

      expect(mockUseGetUnitsQuery).toHaveBeenCalledWith(
        { services: [191, 318, 365, 586] }, // 999 filtered out
        { skip: false }
      );
    });

    it('should sort services consistently for caching', () => {
      mockUseAppSearch.mockReturnValue({ sport: UnitFilters.SKIING });
      mockGetServicesForSport.mockImplementation((sport) => {
        if (sport === UnitFilters.SKIING) return [318, 191]; // Unsorted
        if (sport === UnitFilters.HIKING) return [586, 365]; // Unsorted
        return [];
      });

      renderHook(() => useFetchInitialData(), { wrapper: createWrapper() });

      expect(mockUseGetUnitsQuery).toHaveBeenCalledWith(
        { services: [191, 318, 365, 586] }, // Sorted
        { skip: false }
      );
    });
  });

  describe('Search trigger behavior', () => {
    it('should trigger search on first render when search is open with query', async () => {
      mockUseSearch.mockReturnValue({ q: 'swimming pool', city: 'Helsinki' });
      mockUseIsUnitBrowserSearchView.mockReturnValue(true);

      renderHook(() => useFetchInitialData(), { wrapper: createWrapper() });

      await waitFor(() => {
        expect(mockTriggerSearchUnits).toHaveBeenCalledWith({
          input: 'swimming pool',
          params: { city: 'Helsinki' }
        });
      });
    });

    it('should not trigger search when search is not open', async () => {
      mockUseSearch.mockReturnValue({ q: 'swimming pool', city: 'Helsinki' });
      mockUseIsUnitBrowserSearchView.mockReturnValue(false);

      renderHook(() => useFetchInitialData(), { wrapper: createWrapper() });

      await waitFor(() => {
        expect(mockTriggerSearchUnits).not.toHaveBeenCalled();
      });
    });

    it('should not trigger search when query is empty', async () => {
      mockUseSearch.mockReturnValue({ q: '', city: 'Helsinki' });
      mockUseIsUnitBrowserSearchView.mockReturnValue(true);

      renderHook(() => useFetchInitialData(), { wrapper: createWrapper() });

      await waitFor(() => {
        expect(mockTriggerSearchUnits).not.toHaveBeenCalled();
      });
    });

    it('should not trigger search on subsequent renders', async () => {
      mockUseSearch.mockReturnValue({ q: 'swimming pool', city: 'Helsinki' });
      mockUseIsUnitBrowserSearchView.mockReturnValue(true);

      const { rerender } = renderHook(() => useFetchInitialData(), { 
        wrapper: createWrapper() 
      });

      // First render should trigger search
      await waitFor(() => {
        expect(mockTriggerSearchUnits).toHaveBeenCalledTimes(1);
      });

      // Clear the mock and rerender
      mockTriggerSearchUnits.mockClear();
      rerender();

      await waitFor(() => {
        expect(mockTriggerSearchUnits).not.toHaveBeenCalled();
      });
    });
  });

  describe('Memoization behavior', () => {
    it('should not recalculate services when sport remains the same', () => {
      const { rerender } = renderHook(() => useFetchInitialData(), { 
        wrapper: createWrapper() 
      });

      const initialCallCount = mockGetServicesForSport.mock.calls.length;

      rerender();

      // Should not call getServicesForSport again if sport hasn't changed
      expect(mockGetServicesForSport.mock.calls.length).toBe(initialCallCount);
    });

    it('should recalculate services when sport changes', () => {
      mockUseAppSearch.mockReturnValue({ sport: UnitFilters.SKIING });

      const { rerender } = renderHook(() => useFetchInitialData(), { 
        wrapper: createWrapper() 
      });

      // Change the sport
      mockUseAppSearch.mockReturnValue({ sport: UnitFilters.SWIMMING });

      rerender();

      // Should have made new calls to getServicesForSport
      expect(mockGetServicesForSport).toHaveBeenCalledWith(UnitFilters.SWIMMING);
    });
  });

  describe('Error handling', () => {
    it('should handle empty service arrays gracefully', () => {
      mockGetServicesForSport.mockReturnValue([]);
      mockGetOnSeasonServices.mockReturnValue([]);

      expect(() => {
        renderHook(() => useFetchInitialData(), { wrapper: createWrapper() });
      }).not.toThrow();

      expect(mockUseGetUnitsQuery).toHaveBeenCalledWith({}, { skip: true });
    });

    it('should handle when getOnSeasonServices returns empty array', () => {
      mockGetServicesForSport.mockImplementation((sport) => {
        if (sport === UnitFilters.SKIING) return [191, 318];
        if (sport === UnitFilters.HIKING) return [365, 586];
        return [];
      });
      mockGetOnSeasonServices.mockReturnValue([]); // No on-season services

      expect(() => {
        renderHook(() => useFetchInitialData(), { wrapper: createWrapper() });
      }).not.toThrow();

      expect(mockUseGetUnitsQuery).toHaveBeenCalledWith({}, { skip: true });
    });
  });

  describe('Different sport types', () => {
    const testCases = [
      { sport: UnitFilters.SKIING, expectedServices: [191, 318] },
      { sport: UnitFilters.SWIMMING, expectedServices: [730, 731, 426] },
      { sport: UnitFilters.ICE_SKATING, expectedServices: [] },
    ];

    testCases.forEach(({ sport, expectedServices }) => {
      it(`should handle ${sport} sport correctly`, () => {
        mockUseAppSearch.mockReturnValue({ sport });
        mockGetServicesForSport.mockImplementation((sportType) => {
          if (sportType === sport) return expectedServices;
          if (sportType === UnitFilters.HIKING) return [365, 586];
          return [];
        });

        renderHook(() => useFetchInitialData(), { wrapper: createWrapper() });

        expect(mockGetServicesForSport).toHaveBeenCalledWith(sport);
        expect(mockGetServicesForSport).toHaveBeenCalledWith(UnitFilters.HIKING);
      });
    });
  });
});