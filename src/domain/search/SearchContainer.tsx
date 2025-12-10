import { useState, useCallback, useEffect, useRef } from "react";

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

function SearchContainer({
  search = "",
  disabled,
  suggestions,
  isActive,
  onFindSuggestions,
  onSearch,
  onClear,
  onAddressClick,
}: Props) {
  const [searchPhrase, setSearchPhrase] = useState(search);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const preventFocusOpen = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setSearchPhrase(search);
  }, [search]);

  const onInputChange = useCallback(
    (value: string): void => {
      setSearchPhrase(value);
      setShowSuggestions(true);
      onFindSuggestions(value);
    },
    [onFindSuggestions],
  );

  const handleSearch = useCallback(() => {
    onSearch(searchPhrase);
    setShowSuggestions(false);
  }, [onSearch, searchPhrase]);

  const clear = useCallback(() => {
    setSearchPhrase("");
    setShowSuggestions(false);
    onClear();
  }, [onClear]);

  const handleAddressClick = useCallback(
    (coordinates: [number, number]) => {
      setSearchPhrase("");
      setShowSuggestions(false);
      onClear();
      onAddressClick(coordinates);
    },
    [onAddressClick, onClear],
  );

  const handleFocus = useCallback(() => {
    // Don't open suggestions immediately after ESC was pressed
    if (preventFocusOpen.current) {
      preventFocusOpen.current = false;
      return;
    }

    if (searchPhrase && searchPhrase.length > 0) {
      setShowSuggestions(true);
      onFindSuggestions(searchPhrase);
    }
  }, [searchPhrase, onFindSuggestions, preventFocusOpen]);

  const handleBlur = useCallback((event: React.FocusEvent) => {
    // Check if the new focus target is within the container
    if (
      containerRef.current &&
      !containerRef.current.contains(event.relatedTarget as Node)
    ) {
      setShowSuggestions(false);
    }
  }, []);

  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.key === "Escape") {
      preventFocusOpen.current = true;
      setShowSuggestions(false);

      // Focus the search input after closing suggestions
      if (searchInputRef.current) {
        searchInputRef.current.focus();
      }
    }
  }, []);

  const handleInputKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === "ArrowUp" || event.key === "ArrowDown") {
        event.preventDefault();
        if (!showSuggestions && searchPhrase && searchPhrase.length > 0) {
          setShowSuggestions(true);
          onFindSuggestions(searchPhrase);
        }
      }
    },
    [showSuggestions, searchPhrase, onFindSuggestions],
  );

  return (
    <div
      className="search-container"
      ref={containerRef}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
    >
      <SearchBar
        input={searchPhrase}
        onInput={onInputChange}
        onSubmit={handleSearch}
        onClear={clear}
        onFocus={handleFocus}
        onKeyDown={handleInputKeyDown}
        inputRef={searchInputRef}
        searchActive={isActive}
        disabled={disabled}
      />
      {showSuggestions && (
        <SearchSuggestions
          openAllResults={handleSearch}
          suggestions={suggestions}
          handleAddressClick={handleAddressClick}
        />
      )}
    </div>
  );
}

export default SearchContainer;
