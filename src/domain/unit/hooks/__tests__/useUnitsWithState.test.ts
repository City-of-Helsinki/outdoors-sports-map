import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useDispatch } from 'react-redux';

import { useUnitsWithState } from '../useUnitsWithState';
import { useGetUnitsQuery, receiveUnits, setIsFetching } from '../../state/unitSlice';

// Mock dependencies
vi.mock('react-redux', () => ({
  useDispatch: vi.fn(),
}));

vi.mock('../../state/unitSlice', () => ({
  useGetUnitsQuery: vi.fn(),
  receiveUnits: vi.fn(),
  setIsFetching: vi.fn(),
}));

const mockDispatch = vi.fn();
const mockUseGetUnitsQuery = vi.mocked(useGetUnitsQuery);
const mockReceiveUnits = vi.mocked(receiveUnits);
const mockSetIsFetching = vi.mocked(setIsFetching);

// Helper to create mock query result
const createMockQueryResult = (overrides = {}) => ({
  data: undefined,
  isSuccess: false,
  isFetching: false,
  ...overrides,
});

// Helper data
const mockUnitData = {
  entities: { unit: { '1': { id: '1', name: 'Test Unit' } } },
  result: ['1'],
};

describe('useUnitsWithState', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useDispatch).mockReturnValue(mockDispatch);
    mockReceiveUnits.mockReturnValue({ type: 'unit/receiveUnits', payload: {} });
    mockSetIsFetching.mockReturnValue({ type: 'unit/setIsFetching', payload: false });
  });

  describe('RTK Query integration', () => {
    it('should call useGetUnitsQuery with services when provided', () => {
      const services = [123, 456];
      mockUseGetUnitsQuery.mockReturnValue(createMockQueryResult({
        data: mockUnitData,
        isSuccess: true,
      }));

      renderHook(() => useUnitsWithState({ services }));

      expect(mockUseGetUnitsQuery).toHaveBeenCalledWith(
        { services: [123, 456] },
        { skip: false }
      );
    });

    it('should call useGetUnitsQuery with undefined when no services provided', () => {
      mockUseGetUnitsQuery.mockReturnValue(createMockQueryResult());

      renderHook(() => useUnitsWithState());

      expect(mockUseGetUnitsQuery).toHaveBeenCalledWith(undefined, { skip: false });
    });

    it('should pass skip option correctly', () => {
      mockUseGetUnitsQuery.mockReturnValue(createMockQueryResult());

      renderHook(() => useUnitsWithState({ skip: true }));

      expect(mockUseGetUnitsQuery).toHaveBeenCalledWith(undefined, { skip: true });
    });
  });

  describe('Redux state management', () => {
    it('should dispatch setIsFetching when isFetching changes', () => {
      mockUseGetUnitsQuery.mockReturnValue(createMockQueryResult({ isFetching: true }));

      renderHook(() => useUnitsWithState());

      expect(mockSetIsFetching).toHaveBeenCalledWith(true);
      expect(mockDispatch).toHaveBeenCalledWith({ type: 'unit/setIsFetching', payload: false });
    });

    it('should dispatch receiveUnits when query succeeds with data', () => {
      mockUseGetUnitsQuery.mockReturnValue(createMockQueryResult({
        data: mockUnitData,
        isSuccess: true,
      }));

      renderHook(() => useUnitsWithState());

      expect(mockReceiveUnits).toHaveBeenCalledWith(mockUnitData);
      expect(mockDispatch).toHaveBeenCalledWith({ type: 'unit/receiveUnits', payload: {} });
    });

    it('should not dispatch receiveUnits when query is not successful', () => {
      mockUseGetUnitsQuery.mockReturnValue(createMockQueryResult());

      renderHook(() => useUnitsWithState());

      expect(mockReceiveUnits).not.toHaveBeenCalled();
    });
  });

  describe('effect dependencies', () => {
    it('should update when isFetching changes', () => {
      mockUseGetUnitsQuery.mockReturnValue(createMockQueryResult({ isFetching: false }));

      const { rerender } = renderHook(() => useUnitsWithState());

      // Change isFetching
      mockUseGetUnitsQuery.mockReturnValue(createMockQueryResult({ isFetching: true }));
      mockSetIsFetching.mockClear();
      mockDispatch.mockClear();

      rerender();

      expect(mockSetIsFetching).toHaveBeenCalledWith(true);
    });

    it('should update when data and isSuccess change', () => {
      mockUseGetUnitsQuery.mockReturnValue(createMockQueryResult());

      const { rerender } = renderHook(() => useUnitsWithState());

      // Change data and isSuccess
      mockUseGetUnitsQuery.mockReturnValue(createMockQueryResult({
        data: mockUnitData,
        isSuccess: true,
      }));
      mockReceiveUnits.mockClear();
      mockDispatch.mockClear();

      rerender();

      expect(mockReceiveUnits).toHaveBeenCalledWith(mockUnitData);
    });
  });
});