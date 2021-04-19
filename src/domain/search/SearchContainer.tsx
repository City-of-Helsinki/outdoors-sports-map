import { Component } from "react";

import SearchBar from "./SearchBar";
import SearchSuggestions, { Suggestion } from "./SearchSuggestions";

type Props = {
  search?: string;
  disabled: boolean;
  suggestions: Suggestion[];
  isActive: boolean;
  onFindSuggestions: (value: string) => void;
  onSearch: (value: string) => void;
  onClear: () => void;
  onAddressClick: (coordinates: [number, number]) => void;
};

type State = {
  searchPhrase: string;
  showSuggestions: boolean;
};

const initialState = (searchPhrase = "") => ({
  searchPhrase,
  showSuggestions: false,
});

class SearchContainer extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    const { search } = this.props;

    this.state = initialState(search);
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
    const { onSearch } = this.props;
    const { searchPhrase } = this.state;

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
    const { onFindSuggestions } = this.props;

    onFindSuggestions(searchPhrase);
  };

  clear = () => {
    const { onClear } = this.props;

    this.setState(initialState());
    onClear();
  };

  handleAddressClick = (coordinates: [number, number]) => {
    const { onAddressClick } = this.props;

    this.clear();
    onAddressClick(coordinates);
  };

  render() {
    const { suggestions, isActive, disabled } = this.props;
    const { searchPhrase, showSuggestions } = this.state;

    return (
      <div className="search-container">
        <SearchBar
          input={searchPhrase}
          onInput={this.onInputChange}
          onSubmit={this.search}
          onClear={this.clear}
          searchActive={isActive}
          disabled={disabled}
        />
        {showSuggestions && (
          <SearchSuggestions
            openAllResults={this.search}
            suggestions={suggestions}
            handleAddressClick={this.handleAddressClick}
          />
        )}
      </div>
    );
  }
}

export default SearchContainer;
