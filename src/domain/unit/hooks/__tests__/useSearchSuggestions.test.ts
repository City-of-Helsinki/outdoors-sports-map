import { renderHook, act } from '@testing-library/react';
import { vi, describe, expect, it, beforeEach, afterEach } from 'vitest';

import { useSearchSuggestions } from '../useSearchSuggestions';

// Mock dependencies
const mockDispatch = vi.fn();
const mockTriggerSearchSuggestions = vi.fn();

vi.mock('react-redux', () => ({
  useDispatch: () => mockDispatch,
}));

vi.mock('../../state/searchSlice', () => ({
  useLazySearchSuggestionsQuery: () => [mockTriggerSearchSuggestions],
  setUnitSuggestions: vi.fn((data) => ({ type: 'setUnitSuggestions', payload: data })),
  setAddressSuggestions: vi.fn((data) => ({ type: 'setAddressSuggestions', payload: data })),
}));

describe('useSearchSuggestions', () => {
  // Test helpers
  const createMockResponse = (units = { result: [] }, addresses = []) => ({
    data: { units, addresses }
  });

  const renderHookAndGetSearchFn = () => {
    const { result, unmount } = renderHook(() => useSearchSuggestions());
    return { searchSuggestions: result.current.searchSuggestions, result, unmount };
  };

  const triggerSearchWithDelay = (searchFn: (input: string) => void, input: string) => {
    act(() => {
      searchFn(input);
    });
    act(() => {
      vi.advanceTimersByTime(300);
    });
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should return searchSuggestions function', () => {
    const { searchSuggestions } = renderHookAndGetSearchFn();
    
    expect(searchSuggestions).toBeTypeOf('function');
  });

  it('should debounce search calls by 300ms', async () => {
    mockTriggerSearchSuggestions.mockResolvedValue(createMockResponse());

    const { searchSuggestions } = renderHookAndGetSearchFn();
    
    // Make multiple rapid calls
    act(() => {
      searchSuggestions('test1');
      searchSuggestions('test2');
      searchSuggestions('test3');
    });

    // Should not have called the API yet
    expect(mockTriggerSearchSuggestions).not.toHaveBeenCalled();

    // Fast forward 300ms
    act(() => {
      vi.advanceTimersByTime(300);
    });

    // Should only call once with the last search term
    await vi.waitFor(() => {
      expect(mockTriggerSearchSuggestions).toHaveBeenCalledTimes(1);
      expect(mockTriggerSearchSuggestions).toHaveBeenCalledWith('test3');
    });
  });

  it('should dispatch Redux actions when search completes with matching term', async () => {
    const mockUnits = { result: ['unit1', 'unit2'] };
    const mockAddresses = [{ properties: { label: 'Address 1' } }];
    
    mockTriggerSearchSuggestions.mockResolvedValue(createMockResponse(mockUnits, mockAddresses));

    const { searchSuggestions } = renderHookAndGetSearchFn();
    
    triggerSearchWithDelay(searchSuggestions, 'helsinki');

    await vi.waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith({ 
        type: 'setUnitSuggestions', 
        payload: mockUnits 
      });
      expect(mockDispatch).toHaveBeenCalledWith({ 
        type: 'setAddressSuggestions', 
        payload: mockAddresses 
      });
    });
  });

  it('should not dispatch when search term changes during request', async () => {
    mockTriggerSearchSuggestions.mockImplementation(() => 
      new Promise(resolve => 
        setTimeout(() => resolve(createMockResponse()), 100)
      )
    );

    const { searchSuggestions } = renderHookAndGetSearchFn();
    
    // Start search for 'old'
    triggerSearchWithDelay(searchSuggestions, 'old');

    // Change search term before first request completes
    triggerSearchWithDelay(searchSuggestions, 'new');

    // Complete both requests
    act(() => {
      vi.advanceTimersByTime(100);
    });

    await vi.waitFor(() => {
      // Should only dispatch for the 'new' search, not 'old'
      expect(mockDispatch).toHaveBeenCalledTimes(2); // once for units, once for addresses
    });
  });

  it('should not dispatch when API returns no data', async () => {
    mockTriggerSearchSuggestions.mockResolvedValue({ data: null });

    const { searchSuggestions } = renderHookAndGetSearchFn();
    
    triggerSearchWithDelay(searchSuggestions, 'test');

    await vi.waitFor(() => {
      expect(mockTriggerSearchSuggestions).toHaveBeenCalled();
    });

    // Should not dispatch when no data
    expect(mockDispatch).not.toHaveBeenCalled();
  });

  it('should cleanup timeout on unmount', () => {
    const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout');
    
    const { searchSuggestions, unmount } = renderHookAndGetSearchFn();
    
    // Start a search to create a timeout
    act(() => {
      searchSuggestions('test');
    });

    // Unmount the hook
    unmount();

    // Should have cleared the timeout
    expect(clearTimeoutSpy).toHaveBeenCalled();
    
    clearTimeoutSpy.mockRestore();
  });
});