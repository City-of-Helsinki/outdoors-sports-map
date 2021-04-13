/*
   eslint-disable
   no-shadow,
   react/destructuring-assignment,
   react/prop-types,
   react/require-default-props,
*/

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as selectors from '../selectors';
import { getIsLoading as getIsUnitLoading } from '../../unit/selectors';
import { searchUnits, fetchUnitSuggestions, clearSearch } from '../actions';
import { setLocation } from '../../map/actions';
import SearchBar from './SearchBar';
import SearchSuggestions from './SearchSuggestions';

const initialState = () => ({
  searchPhrase: '',
  showSuggestions: false,
});

class SearchContainer extends Component {
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
    this.props.searchUnits(this.state.searchPhrase);
    this.props.onSearch(this.state.searchPhrase);
    this.setState({
      showSuggestions: false,
    });
  };

  /**
   * @param  {string} searchPhrase [description]
   * @return {void}              [description]
   */
  getSuggestions = (searchPhrase) => {
    this.props.fetchUnitSuggestions(searchPhrase);
  };

  clear = () => {
    this.setState(initialState());
    this.props.clearSearch();
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

SearchContainer.propTypes = {
  unitSuggestions: PropTypes.arrayOf(PropTypes.object),
  searchUnits: PropTypes.func,
  fetchUnitSuggestions: PropTypes.func,
  searchDisabled: PropTypes.bool,
  onSearch: PropTypes.func,
};

const mapStateToProps = (state) => ({
  unitSuggestions: selectors.getUnitSuggestions(state),
  isActive: selectors.getIsActive(state),
  searchDisabled: getIsUnitLoading(state),
  addresses: selectors.getAddresses(state),
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      searchUnits,
      fetchUnitSuggestions,
      clearSearch,
      setLocation,
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(SearchContainer);
