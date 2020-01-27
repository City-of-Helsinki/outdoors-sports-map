import React, { Component, PropTypes } from 'react';
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
  static propTypes = {
    unitSuggestions: PropTypes.array,
    searchUnits: PropTypes.func,
    fetchUnitSuggestions: PropTypes.func,
    searchDisabled: PropTypes.bool,
    onSearch: PropTypes.func,
  };

  state = initialState();

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
  }

  search = () => {
    this.props.searchUnits(this.state.searchPhrase);
    this.props.onSearch(this.state.searchPhrase);
    this.setState({
      showSuggestions: false,
    });
  }

  /**
   * @param  {string} searchPhrase [description]
   * @return {void}              [description]
   */
  getSuggestions = (searchPhrase) => {
    this.props.fetchUnitSuggestions(searchPhrase);
  }

  clear = () => {
    this.setState(initialState());
    this.props.clearSearch();
  }

  handleAddressClick = (coordinates) => {
    const { setView, setLocation } = this.props;
    this.clear();
    setLocation(coordinates);
    setView(coordinates);
  }

  render() {
    const {
      unitSuggestions, addresses, isActive, searchDisabled, openUnit,
    } = this.props;
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
        {showSuggestions
          && (
          <SearchSuggestions
            openAllResults={this.search}
            units={unitSuggestions}
            openUnit={openUnit}
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

const mapDispatchToProps = (dispatch) => bindActionCreators({
  searchUnits, fetchUnitSuggestions, clearSearch, setLocation,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(SearchContainer);
