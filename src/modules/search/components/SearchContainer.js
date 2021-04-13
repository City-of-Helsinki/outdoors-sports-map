// @flow

import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { getIsLoading as getIsUnitLoading } from '../../unit/selectors';
import * as mapActions from '../../map/actions';
import * as selectors from '../selectors';
import * as unitActions from '../actions';
import SearchBar from './SearchBar';
import SearchSuggestions from './SearchSuggestions';

type Props = {
  unitSuggestions: object[],
  searchUnits: (value: string) => void,
  fetchUnitSuggestions: (value: string) => void,
  searchDisabled: boolean,
  onSearch: (value: string) => void,
  clearSearch: () => void,
  onViewChange: (coordinates: [Number, number]) => void,
  setLocation: (coordinates: [Number, number]) => void,
  addresses: object[],
  isActive: boolean,
};

const initialState = () => ({
  searchPhrase: '',
  showSuggestions: false,
});

class SearchContainer extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = initialState();
  }

  /**
   *
   * @param  {string} value [description]
   * @return {void}       [description]
   */
  onInputChange = (value) => {
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
  getSuggestions = (searchPhrase) => {
    const { fetchUnitSuggestions } = this.props;

    fetchUnitSuggestions(searchPhrase);
  };

  clear = () => {
    const { clearSearch } = this.props;

    this.setState(initialState());
    clearSearch();
  };

  handleAddressClick = (coordinates) => {
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

const mapStateToProps = (state) => ({
  unitSuggestions: selectors.getUnitSuggestions(state),
  isActive: selectors.getIsActive(state),
  searchDisabled: getIsUnitLoading(state),
  addresses: selectors.getAddresses(state),
});

const mapDispatchToProps = (dispatch) =>
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
