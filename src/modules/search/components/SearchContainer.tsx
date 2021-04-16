import { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";

import { AppState } from "../../common/constants";
import * as mapActions from "../../map/actions";
import { Unit } from "../../unit/constants";
import { getIsLoading as getIsUnitLoading } from "../../unit/selectors";
import * as unitActions from "../actions";
import * as selectors from "../selectors";
import SearchBar from "./SearchBar";
import SearchSuggestions from "./SearchSuggestions";

type Props = {
  unitSuggestions: Unit[];
  searchUnits: (input: string, params?: Record<string, any>) => void;
  fetchUnitSuggestions: (value: string) => void;
  searchDisabled: boolean;
  onSearch: (value: string) => void;
  clearSearch: () => void;
  onViewChange: (coordinates: [number, number]) => void;
  setLocation: (coordinates: [number, number]) => void;
  addresses: Record<string, any>[];
  isActive: boolean;
};

type State = {
  searchPhrase: string;
  showSuggestions: boolean;
};

const initialState = () => ({
  searchPhrase: "",
  showSuggestions: false,
});

class SearchContainer extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = initialState();
  }

  /**
   *
   * @param  {string} value [description]
   * @return {void}       [description]
   */
  onInputChange = (value: string): void => {
    this.setState({
      searchPhrase: value,
      showSuggestions: true,
    });
    this.getSuggestions(value);
  };

  search = () => {
    const { searchUnits, onSearch } = this.props;
    const { searchPhrase } = this.state;

    searchUnits(searchPhrase);
    onSearch(searchPhrase);
    this.setState({
      showSuggestions: false,
    });
  };

  /**
   * @param  {string} searchPhrase [description]
   * @return {void}              [description]
   */
  getSuggestions = (searchPhrase: string): void => {
    const { fetchUnitSuggestions } = this.props;

    fetchUnitSuggestions(searchPhrase);
  };

  clear = () => {
    const { clearSearch } = this.props;

    this.setState(initialState());
    clearSearch();
  };

  handleAddressClick = (coordinates: [number, number]) => {
    const { onViewChange, setLocation } = this.props;

    this.clear();
    setLocation(coordinates);
    onViewChange(coordinates);
  };

  render() {
    const { unitSuggestions, addresses, isActive, searchDisabled } = this.props;
    const { searchPhrase, showSuggestions } = this.state;

    return (
      <div className="search-container">
        <SearchBar
          input={searchPhrase}
          onInput={this.onInputChange}
          onSubmit={this.search}
          onClear={this.clear}
          searchActive={isActive}
          disabled={searchDisabled}
        />
        {showSuggestions && (
          <SearchSuggestions
            openAllResults={this.search}
            units={unitSuggestions}
            handleAddressClick={this.handleAddressClick}
            addresses={addresses}
          />
        )}
      </div>
    );
  }
}

const mapStateToProps = (state: AppState) => ({
  unitSuggestions: selectors.getUnitSuggestions(state),
  isActive: selectors.getIsActive(state),
  searchDisabled: getIsUnitLoading(state),
  addresses: selectors.getAddresses(state),
});

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      searchUnits: unitActions.searchUnits,
      fetchUnitSuggestions: unitActions.fetchUnitSuggestions,
      clearSearch: unitActions.clearSearch,
      setLocation: mapActions.setLocation,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(SearchContainer);
