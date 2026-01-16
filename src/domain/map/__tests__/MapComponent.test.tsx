import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Use vi.hoisted to properly declare mock functions before vi.mock calls
const { 
  mockUseRouteMatch, 
  mockUseSelector, 
  mockUseGetUnitByIdQuery,
  mockHistoryPush,
  mockUseLocation,
  mockUseLanguage,
  mockUseAppSearch,
  mockDispatch,
  mockTriggerGetAddress,
  mockSetLocation
} = vi.hoisted(() => ({
  mockUseRouteMatch: vi.fn(),
  mockUseSelector: vi.fn(), 
  mockUseGetUnitByIdQuery: vi.fn(),
  mockHistoryPush: vi.fn(),
  mockUseLocation: vi.fn(),
  mockUseLanguage: vi.fn(),
  mockUseAppSearch: vi.fn(),
  mockDispatch: vi.fn(),
  mockTriggerGetAddress: vi.fn(),
  mockSetLocation: vi.fn(),
}));

// Mock the MapComponent by testing its integration contract
vi.mock('../MapView', () => ({
  default: vi.fn(({ units, selectedUnit, openUnit, setLocation, onCenterMapToUnit }) => (
    <div data-testid="map-view">
      <div data-testid="units-count">{units?.length || 0}</div>
      <div data-testid="selected-unit">{selectedUnit?.id || 'none'}</div>
      <div data-testid="props-received">
        {typeof openUnit === 'function' ? 'openUnit-ok' : 'openUnit-missing'}
        {typeof setLocation === 'function' ? '-setLocation-ok' : '-setLocation-missing'}
        {typeof onCenterMapToUnit === 'function' ? '-onCenterMapToUnit-ok' : '-onCenterMapToUnit-missing'}
      </div>
      <button data-testid="test-open-unit" onClick={() => openUnit('test-unit-123', 'Test Unit')}>
        Test OpenUnit
      </button>
      <button data-testid="test-open-unit-no-name" onClick={() => openUnit('test-unit-456')}>
        Test OpenUnit No Name
      </button>
    </div>
  ))
}));

// Mock all external dependencies
vi.mock('../../../common/hooks/useLanguage', () => ({ default: mockUseLanguage }));
vi.mock('../../app/useAppSearch', () => ({ default: mockUseAppSearch }));
vi.mock('react-router-dom', () => ({
  useHistory: () => ({ push: mockHistoryPush }),
  useLocation: mockUseLocation,
  useRouteMatch: mockUseRouteMatch,
}));
vi.mock('react-redux', () => ({
  useDispatch: () => mockDispatch,
  useSelector: mockUseSelector,
}));
vi.mock('../state/mapSlice', () => ({
  selectLocation: () => [60.1699, 24.9384],
  setLocation: mockSetLocation,
  useLazyGetAddressQuery: () => [mockTriggerGetAddress, {}],
}));
vi.mock('../../unit/state/unitSlice', () => ({
  selectVisibleUnits: () => [],
  selectUnitById: () => undefined,
  useGetUnitByIdQuery: mockUseGetUnitByIdQuery,
}));

import MapComponent from '../MapComponent';

describe('MapComponent', () => {
  const mockLeafletRef = { current: null };
  const mockOnCenterMapToUnit = vi.fn();

  // Common setup helper
  const setupDefaults = () => {
    mockUseRouteMatch.mockReturnValue(null);
    mockUseLocation.mockReturnValue({ pathname: '/en', search: '', state: null });
    mockUseLanguage.mockReturnValue('en');
    mockUseAppSearch.mockReturnValue({ sport: null, status: null, sportSpecification: null });
    mockUseSelector.mockReturnValueOnce([]) // unitData
                  .mockReturnValueOnce(undefined) // basicSelectedUnit
                  .mockReturnValue([60.1699, 24.9384]); // position
    mockUseGetUnitByIdQuery.mockReturnValue({ data: undefined, isLoading: false, error: null });
  };

  // Helper for data handling tests
  const setupDataTest = (unitData = [], selectedUnit = undefined, searchParams = {}) => {
    mockUseRouteMatch.mockReturnValue(selectedUnit ? { params: { unitId: selectedUnit.id } } : null);
    mockUseLocation.mockReturnValue({ 
      pathname: selectedUnit ? `/en/unit/${selectedUnit.id}` : '/en', 
      search: '', 
      state: null 
    });
    mockUseLanguage.mockReturnValue('en');
    mockUseAppSearch.mockReturnValue({ sport: null, status: null, sportSpecification: null, ...searchParams });
    mockUseSelector.mockReturnValueOnce(unitData).mockReturnValueOnce(selectedUnit).mockReturnValue([60.1699, 24.9384]);
    mockUseGetUnitByIdQuery.mockReturnValue({ data: undefined, isLoading: false, error: null });
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockDispatch.mockImplementation(() => {});
    mockTriggerGetAddress.mockImplementation(() => {});
    mockSetLocation.mockImplementation((coords) => ({ type: 'setLocation', payload: coords }));
    mockHistoryPush.mockImplementation(() => {});
  });

  const renderComponent = () => {
    return render(
      <MapComponent
        onCenterMapToUnit={mockOnCenterMapToUnit}
        leafletElementRef={mockLeafletRef}
      />
    );
  };

  describe('openUnit navigation', () => {

    it('should navigate to units correctly', async () => {
      setupDefaults();
      mockUseLocation.mockReturnValue({ pathname: '/en/search', search: '?sport=cycling', state: null });
      mockUseAppSearch.mockReturnValue({ sport: 'cycling', status: 'open', sportSpecification: null });
      
      renderComponent();
      
      await userEvent.click(screen.getByTestId('test-open-unit'));
      expect(mockHistoryPush).toHaveBeenCalledWith(
        '/en/unit/test-unit-123-Test%2520Unit',
        expect.objectContaining({
          previous: '/search?sport=cycling',
          search: { sport: 'cycling', status: 'open', sportSpecification: null }
        })
      );
    });

    it('should handle different languages', async () => {
      setupDefaults();
      mockUseLanguage.mockReturnValue('fi');
      mockUseLocation.mockReturnValue({ pathname: '/fi/haku', search: '?laji=pyöräily', state: null });
      mockUseAppSearch.mockReturnValue({ sport: 'cycling', status: null, sportSpecification: null });
      
      renderComponent();
      
      await userEvent.click(screen.getByTestId('test-open-unit'));
      expect(mockHistoryPush).toHaveBeenCalledWith(
        '/fi/unit/test-unit-123-Test%2520Unit',
        expect.objectContaining({ previous: '/haku?laji=pyöräily' })
      );
    });

    it('should preserve state when already on unit details page', async () => {
      const existingState = {
        previous: '/search?sport=hiking',
        search: { sport: 'hiking', status: 'open' }
      };

      setupDefaults();
      mockUseRouteMatch.mockReturnValue({ params: { unitId: 'current-123' } });
      mockUseLocation.mockReturnValue({ pathname: '/en/unit/current-123', search: '', state: existingState });
      
      renderComponent();
      await userEvent.click(screen.getByTestId('test-open-unit'));
      
      expect(mockHistoryPush).toHaveBeenCalledWith(
        '/en/unit/test-unit-123-Test%2520Unit',
        existingState
      );
    });
  });

  describe('data handling - units and selection', () => {
    it('should handle unit data correctly', () => {
      const mockUnits = [
        { id: 'unit-1', name: { en: 'Test Unit' } },
        { id: 'unit-2', name: { en: 'Another Unit' } }
      ];
      
      setupDataTest(mockUnits, undefined, { sport: 'cycling' });
      
      renderComponent();
      expect(screen.getByTestId('units-count')).toHaveTextContent('2');
      expect(screen.getByTestId('selected-unit')).toHaveTextContent('none');
    });

    it('should handle unit selection when on unit page', () => {
      const selectedUnit = { id: 'selected-123', name: { en: 'Selected Unit' } };
      
      setupDataTest([], selectedUnit);
      
      renderComponent();
      expect(screen.getByTestId('selected-unit')).toHaveTextContent('selected-123');
    });
  });

  describe('RTK Query integration', () => {
    it('should handle query logic based on route context', () => {
      const mockUnitId = 'test-unit-789';
      setupDefaults();
      mockUseRouteMatch.mockReturnValue({ params: { unitId: mockUnitId } });
      mockUseLocation.mockReturnValue({ pathname: `/en/unit/${mockUnitId}`, search: '', state: null });
      
      renderComponent();
      expect(mockUseGetUnitByIdQuery).toHaveBeenCalledWith(mockUnitId, { skip: false });
      
      // Test query skip when not on unit page
      vi.clearAllMocks();
      setupDefaults();
      
      renderComponent();
      expect(mockUseGetUnitByIdQuery).toHaveBeenCalledWith('', { skip: true });
    });
  });

  describe('component integration', () => {
    it('should render and pass all props correctly', () => {
      setupDefaults();
      renderComponent();
      
      expect(screen.getByTestId('map-view')).toBeInTheDocument();
      expect(screen.getByTestId('props-received')).toHaveTextContent(
        'openUnit-ok-setLocation-ok-onCenterMapToUnit-ok'
      );
      expect(screen.getByTestId('units-count')).toHaveTextContent('0');
      expect(screen.getByTestId('selected-unit')).toHaveTextContent('none');
    });
  });
});