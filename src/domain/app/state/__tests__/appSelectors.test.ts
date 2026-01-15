import { vi } from 'vitest';
import { selectIsLoading } from '../appSelectors';
import type { AppState } from '../../appConstants';

// Mock the service slice selectors
vi.mock('../../../service/state/serviceSlice', () => ({
  selectIsFetchingService: vi.fn(),
  selectServicesState: vi.fn(),
}));

import { selectIsFetchingService, selectServicesState } from '../../../service/state/serviceSlice';

const mockSelectIsFetchingService = selectIsFetchingService as any;
const mockSelectServicesState = selectServicesState as any;

describe('appSelectors', () => {
  describe('selectIsLoading', () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    const createMockState = (overrides: Partial<AppState> = {}): AppState => ({
      unit: {
        isFetching: false,
        all: {},
        ...overrides.unit,
      },
      api: {},
      ...overrides,
    } as AppState);

    it('should return true when units are fetching and unit.all is empty', () => {
      const state = createMockState({
        unit: { isFetching: true, all: {} },
      });

      mockSelectIsFetchingService.mockReturnValue(false);
      mockSelectServicesState.mockReturnValue({ byId: { service1: {} }, all: ['service1'] });

      const result = selectIsLoading(state);
      expect(result).toBe(true);
    });

    it('should return true when services are fetching and service.all is empty', () => {
      const state = createMockState({
        unit: { isFetching: false, all: { unit1: {} } },
      });

      mockSelectIsFetchingService.mockReturnValue(true);
      mockSelectServicesState.mockReturnValue({ byId: {}, all: [] });

      const result = selectIsLoading(state);
      expect(result).toBe(true);
    });

    it('should return false when units are fetching but unit.all has data', () => {
      const state = createMockState({
        unit: { isFetching: true, all: { unit1: { id: 1 } } },
      });

      mockSelectIsFetchingService.mockReturnValue(false);
      mockSelectServicesState.mockReturnValue({ byId: {}, all: [] });

      const result = selectIsLoading(state);
      expect(result).toBe(false);
    });

    it('should return false when services are fetching but service.all has data', () => {
      const state = createMockState({
        unit: { isFetching: false, all: {} },
      });

      mockSelectIsFetchingService.mockReturnValue(true);
      mockSelectServicesState.mockReturnValue({ byId: { service1: {} }, all: ['service1'] });

      const result = selectIsLoading(state);
      expect(result).toBe(false);
    });

    it('should return false when nothing is fetching', () => {
      const state = createMockState({
        unit: { isFetching: false, all: {} },
      });

      mockSelectIsFetchingService.mockReturnValue(false);
      mockSelectServicesState.mockReturnValue({ byId: {}, all: [] });

      const result = selectIsLoading(state);
      expect(result).toBe(false);
    });
  });
});