import { renderHook, act } from '@testing-library/react';
import { vi, describe, expect, it, beforeEach, afterEach } from 'vitest';

import { useSearchSuggestions } from '../useSearchSuggestions';

// Mock dependencies
const mockDispatch = vi.fn();
const mockQueryResult = { 
  data: null, 
  isLoading: false 
};

vi.mock('react-redux', () => ({
  useDispatch: () => mockDispatch,
}));

vi.mock('../../state/searchSlice', () => ({
  useSearchSuggestionsQuery: vi.fn(() => mockQueryResult),
  setUnitSuggestions: vi.fn((data) => ({ type: 'setUnitSuggestions', payload: data })),
  setAddressSuggestions: vi.fn((data) => ({ type: 'setAddressSuggestions', payload: data })),
}));

import { useSearchSuggestionsQuery } from '../../state/searchSlice';
const mockUseSearchSuggestionsQuery = useSearchSuggestionsQuery as any;

describe('useSearchSuggestions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    mockUseSearchSuggestionsQuery.mockReturnValue({
      data: null,
      isLoading: false
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should return searchSuggestions function and isLoading state', () => {
    const { result } = renderHook(() => useSearchSuggestions());
    
    expect(result.current.searchSuggestions).toBeTypeOf('function');
    expect(result.current.isLoading).toBe(false);
  });

  it('should debounce input and call query with debounced value', () => {
    const { result } = renderHook(() => useSearchSuggestions());
    
    // Make multiple rapid calls
    act(() => {
      result.current.searchSuggestions('test1');
      result.current.searchSuggestions('test2');
      result.current.searchSuggestions('test3');
    });

    // Should not have called with any value yet
    expect(mockUseSearchSuggestionsQuery).toHaveBeenLastCalledWith('', { skip: true });

    // Fast forward 300ms
    act(() => {
      vi.advanceTimersByTime(300);
    });

    // Should call with the last search term
    expect(mockUseSearchSuggestionsQuery).toHaveBeenLastCalledWith('test3', { skip: false });
  });

  it('should skip query for empty input', () => {
    const { result } = renderHook(() => useSearchSuggestions());
    
    act(() => {
      result.current.searchSuggestions('');
    });

    act(() => {
      vi.advanceTimersByTime(300);
    });

    // Should skip query for empty input
    expect(mockUseSearchSuggestionsQuery).toHaveBeenLastCalledWith('', { skip: true });
  });

  it('should dispatch Redux actions when search completes with data', () => {
    const mockUnits = { result: ['unit1', 'unit2'] };
    const mockAddresses = [{ properties: { label: 'Address 1' } }];
    
    mockUseSearchSuggestionsQuery.mockReturnValue({
      data: { units: mockUnits, addresses: mockAddresses },
      isLoading: false
    });

    const { result } = renderHook(() => useSearchSuggestions());
    
    act(() => {
      result.current.searchSuggestions('helsinki');
    });

    act(() => {
      vi.advanceTimersByTime(300);
    });

    // Should dispatch actions with the received data
    expect(mockDispatch).toHaveBeenCalledWith({ 
      type: 'setUnitSuggestions', 
      payload: mockUnits 
    });
    expect(mockDispatch).toHaveBeenCalledWith({ 
      type: 'setAddressSuggestions', 
      payload: mockAddresses 
    });
  });

  it('should not dispatch when query returns no data', () => {
    mockUseSearchSuggestionsQuery.mockReturnValue({
      data: null,
      isLoading: false
    });

    const { result } = renderHook(() => useSearchSuggestions());
    
    act(() => {
      result.current.searchSuggestions('test');
    });

    act(() => {
      vi.advanceTimersByTime(300);
    });

    // Should not dispatch when no data
    expect(mockDispatch).not.toHaveBeenCalled();
  });

  it('should return isLoading state from query', () => {
    mockUseSearchSuggestionsQuery.mockReturnValue({
      data: null,
      isLoading: true
    });

    const { result } = renderHook(() => useSearchSuggestions());
    
    expect(result.current.isLoading).toBe(true);
  });

  it('should cleanup timeout on unmount', () => {
    const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout');
    
    const { result, unmount } = renderHook(() => useSearchSuggestions());
    
    // Start a search to create a timeout
    act(() => {
      result.current.searchSuggestions('test');
    });

    // Unmount the hook
    unmount();

    // Should have cleared the timeout
    expect(clearTimeoutSpy).toHaveBeenCalled();
    
    clearTimeoutSpy.mockRestore();
  });
});