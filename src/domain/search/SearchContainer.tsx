import { useState, useCallback, useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";

import SearchBar from "./SearchBar";
import SearchSuggestions, { Suggestion } from "./SearchSuggestions";
import useLanguage from "../../common/hooks/useLanguage";
import * as PathUtils from "../../common/utils/pathUtils";

const LISTBOX_ID = "search-suggestions-listbox";

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
}: Readonly<Props>) {
  const [searchPhrase, setSearchPhrase] = useState(search);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0 });
  const [activeIndex, setActiveIndex] = useState(-1);
  const preventFocusOpen = useRef(false);
  const preventBlurClose = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const history = useHistory();
  const language = useLanguage();

  useEffect(() => {
    setSearchPhrase(search);
  }, [search]);

  const updateMenuPosition = useCallback(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setMenuPosition({ top: rect.bottom + window.scrollY });
    }
  }, []);

  useEffect(() => {
    if (showSuggestions) {
      updateMenuPosition();
    }
  }, [showSuggestions, updateMenuPosition]);

  useEffect(() => {
    const handlePositionUpdate = () => {
      if (showSuggestions) {
        updateMenuPosition();
      }
    };

    window.addEventListener("resize", handlePositionUpdate);
    window.addEventListener("scroll", handlePositionUpdate, true);

    return () => {
      window.removeEventListener("resize", handlePositionUpdate);
      window.removeEventListener("scroll", handlePositionUpdate, true);
    };
  }, [showSuggestions, updateMenuPosition]);

  const onInputChange = useCallback(
    (value: string): void => {
      setSearchPhrase(value);
      setActiveIndex(-1);

      // Only show suggestions if there's actual search text
      if (value && value.trim().length > 0) {
        setShowSuggestions(true);
        onFindSuggestions(value);
        // Update position when opening suggestions
        setTimeout(updateMenuPosition, 0);
      } else {
        setShowSuggestions(false);
      }
    },
    [onFindSuggestions, updateMenuPosition],
  );

  const handleSearch = useCallback(() => {
    onSearch(searchPhrase);
    setShowSuggestions(false);
    setActiveIndex(-1);
  }, [onSearch, searchPhrase]);

  const clear = useCallback(() => {
    setSearchPhrase("");
    setShowSuggestions(false);
    setActiveIndex(-1);
    onClear();
  }, [onClear]);

  const handleAddressClick = useCallback(
    (coordinates: [number, number]) => {
      setSearchPhrase("");
      setShowSuggestions(false);
      setActiveIndex(-1);
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
      // Update position when opening suggestions
      setTimeout(updateMenuPosition, 0);
    }
  }, [searchPhrase, onFindSuggestions, preventFocusOpen, updateMenuPosition]);

  const handleBlur = useCallback(() => {
    // Don't close if we're preventing blur (e.g., clicking on suggestions)
    if (preventBlurClose.current) {
      preventBlurClose.current = false;
      return;
    }

    // Use setTimeout to allow click events to fire first on mobile
    setTimeout(() => {
      // Check if the new focus target is within the container
      if (
        containerRef.current &&
        !containerRef.current.contains(document.activeElement as Node)
      ) {
        setShowSuggestions(false);
      }
    }, 10);
  }, []);

  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.key === "Escape") {
      preventFocusOpen.current = true;
      setShowSuggestions(false);
      setActiveIndex(-1);

      // Focus the search input after closing suggestions
      if (searchInputRef.current) {
        searchInputRef.current.focus();
      }
    }
  }, []);

  const handleInputKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault();
        if (!showSuggestions && searchPhrase && searchPhrase.length > 0) {
          setShowSuggestions(true);
          setActiveIndex(-1);
          onFindSuggestions(searchPhrase);
          setTimeout(updateMenuPosition, 0);
          return;
        }
        if (showSuggestions && suggestions.length > 0) {
          setActiveIndex((prev) => {
            if (event.key === "ArrowDown") {
              return Math.min(prev + 1, suggestions.length - 1);
            }
            return Math.max(prev - 1, -1);
          });
        }
      } else if (event.key === "Tab") {
        setShowSuggestions(false);
        setActiveIndex(-1);
      } else if (event.key === "Enter") {
        if (activeIndex >= 0 && activeIndex < suggestions.length) {
          event.preventDefault();
          const suggestion = suggestions[activeIndex];
          if (suggestion.coordinates) {
            handleAddressClick(suggestion.coordinates);
          } else if (suggestion.to) {
            const to =
              typeof suggestion.to === "string"
                ? PathUtils.getPathnameWithLanguage(suggestion.to, language)
                : suggestion.to;
            history.push(to as string);
            setShowSuggestions(false);
            setActiveIndex(-1);
          }
        }
      }
    },
    [
      showSuggestions,
      searchPhrase,
      suggestions,
      activeIndex,
      onFindSuggestions,
      updateMenuPosition,
      handleAddressClick,
      history,
      language,
    ],
  );

  return (
    /* eslint-disable-next-line jsx-a11y/no-static-element-interactions */
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
        ariaExpanded={showSuggestions}
        ariaControls={LISTBOX_ID}
        ariaActiveDescendant={
          activeIndex >= 0 ? `search-suggestion-${activeIndex}` : undefined
        }
      />
      {showSuggestions && searchPhrase && searchPhrase.trim().length > 0 && (
        <SearchSuggestions
          openAllResults={handleSearch}
          suggestions={suggestions}
          handleAddressClick={handleAddressClick}
          menuPosition={menuPosition}
          preventBlurCloseRef={preventBlurClose}
          activeIndex={activeIndex}
        />
      )}
    </div>
  );
}

export default SearchContainer;
