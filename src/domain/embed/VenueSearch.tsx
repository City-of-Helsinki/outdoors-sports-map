import { IconCrossCircle } from "hds-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

import useLanguage from "../../common/hooks/useLanguage";
import UnitIcon from "../unit/UnitIcon";
import { StatusBar } from "../unit/UnitObservationStatus";
import { useSearchSuggestions } from "../unit/hooks/useSearchSuggestions";
import { selectUnitSuggestions } from "../unit/state/searchSlice";
import { Unit } from "../unit/types";
import { getAttr, getCondition, getUnitQuality } from "../unit/unitHelpers";

type VenueSearchProps = {
  onSelect: (unitId: string, displayName: string) => void;
};

function VenueSearch({ onSelect }: Readonly<VenueSearchProps>) {
  const { t } = useTranslation();
  const language = useLanguage();
  const [inputValue, setInputValue] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const preventBlurRef = useRef(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRowRef = useRef<HTMLDivElement>(null);
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0, width: 0 });
  const { searchSuggestions } = useSearchSuggestions();
  const unitSuggestions = useSelector(selectUnitSuggestions);

  const validSuggestions = unitSuggestions.filter((u): u is Unit => !!u);

  const updateDropdownPos = useCallback(() => {
    if (inputRowRef.current) {
      const rect = inputRowRef.current.getBoundingClientRect();
      setDropdownPos({ top: rect.bottom, left: rect.left, width: rect.width });
    }
  }, []);

  useEffect(() => {
    if (!showSuggestions) return;
    updateDropdownPos();
    window.addEventListener("resize", updateDropdownPos);
    window.addEventListener("scroll", updateDropdownPos, true);
    return () => {
      window.removeEventListener("resize", updateDropdownPos);
      window.removeEventListener("scroll", updateDropdownPos, true);
    };
  }, [showSuggestions, updateDropdownPos]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);
    setActiveIndex(-1);
    if (val.trim()) {
      searchSuggestions(val);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
      onSelect("", "");
    }
  };

  const handleSelect = (unit: Unit) => {
    const name = getAttr(unit.name, language) || "";
    setInputValue(name);
    setShowSuggestions(false);
    setActiveIndex(-1);
    onSelect(String(unit.id), name);
  };

  const handleClear = () => {
    setInputValue("");
    setShowSuggestions(false);
    setActiveIndex(-1);
    onSelect("", "");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || validSuggestions.length === 0) return;
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, validSuggestions.length - 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, -1));
        break;
      case "Enter":
        if (activeIndex >= 0) {
          e.preventDefault();
          handleSelect(validSuggestions[activeIndex]);
        }
        break;
      case "Escape":
        setShowSuggestions(false);
        setActiveIndex(-1);
        break;
    }
  };

  return (
    <div className="embed-venue-search">
      <div className="embed-venue-search__input-row" ref={inputRowRef}>
        <input
          type="text"
          className="embed-venue-search__input"
          value={inputValue}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          onBlur={() => {
            if (!preventBlurRef.current) setShowSuggestions(false);
            preventBlurRef.current = false;
          }}
          placeholder={`${t("SEARCH.SEARCH")}...`}
          aria-label={t("EMBED_TOOL.VENUE_SEARCH_LABEL")}
          role="combobox"
          aria-controls="embed-venue-search-listbox"
          aria-expanded={showSuggestions && validSuggestions.length > 0}
          aria-autocomplete="list"
          aria-haspopup="listbox"
          aria-activedescendant={activeIndex >= 0 ? `embed-venue-option-${activeIndex}` : undefined}
        />
        {inputValue && (
          <button
            type="button"
            className="embed-venue-search__clear"
            onClick={handleClear}
            aria-label={t("SEARCH.CLEAR")}
          >
            <IconCrossCircle aria-hidden />
          </button>
        )}
      </div>
      {showSuggestions && validSuggestions.length > 0 && (
        <ul
          id="embed-venue-search-listbox"
          className="embed-venue-search__suggestions"
          role="listbox"
          style={{ position: "fixed", top: dropdownPos.top, left: dropdownPos.left, width: dropdownPos.width }}
          onMouseDown={() => { preventBlurRef.current = true; }}
        >
          {validSuggestions.map((unit, index) => {
            const cond = getCondition(unit);
            const quality = getUnitQuality(unit);
            const condLabel = cond
              ? (getAttr(cond.name, language) || t("UNIT_DETAILS.UNKNOWN"))
              : t("UNIT_DETAILS.UNKNOWN");
            return (
              // eslint-disable-next-line jsx-a11y/click-events-have-key-events
              <li
                key={unit.id}
                id={`embed-venue-option-${index}`}
                role="option"
                aria-selected={index === activeIndex}
                className="embed-venue-search__suggestion"
                onClick={() => handleSelect(unit)}
              >
                <div className="embed-venue-search__suggestion-icon">
                  <UnitIcon unit={unit} alt="" />
                </div>
                <div className="embed-venue-search__suggestion-info">
                  <span className="embed-venue-search__suggestion-name">
                    {getAttr(unit.name, language)}
                  </span>
                  <StatusBar quality={quality} label={condLabel} />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default VenueSearch;
