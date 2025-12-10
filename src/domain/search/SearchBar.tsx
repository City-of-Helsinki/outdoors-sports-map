import { IconCrossCircle, IconSearch, LoadingSpinner } from "hds-react";
import { RefObject } from "react";
import { useTranslation } from "react-i18next";

type Props = {
  input: string;
  onInput: (value: string) => void;
  onSubmit: () => void;
  onClear: () => void;
  onFocus?: () => void;
  onKeyDown?: (event: React.KeyboardEvent) => void;
  inputRef?: RefObject<HTMLInputElement>;
  searchActive: boolean;
  disabled: boolean;
};

function SearchBar({
  input,
  onInput,
  onSubmit,
  onClear,
  onFocus,
  onKeyDown,
  inputRef,
  searchActive,
  disabled,
}: Props) {
  const { t } = useTranslation();
  const loaddingText = t("GENERAL.LOADING");
  const loadingFinishedText = t("GENERAL.LOADING_FINISHED");

  return (
    <div className="search-bar">
      <form
        role="search"
        className="search-bar__input"
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
      >
        {disabled && (
          <span className="search-bar__input-loading">
            <LoadingSpinner
              small
              loadingText={loaddingText}
              loadingFinishedText={loadingFinishedText}
            />
          </span>
        )}
        <input
          ref={inputRef}
          name="search"
          id="search"
          aria-label={t("SEARCH.SEARCH")}
          type="text"
          onChange={(e) => onInput(e.target.value)}
          onFocus={onFocus}
          onKeyDown={onKeyDown}
          placeholder={disabled ? loaddingText : `${t("SEARCH.SEARCH")}...`}
          disabled={disabled}
          value={input}
        />
        {(input || searchActive) && (
          <button
            type="button"
            className="search-bar__input-clear"
            onClick={onClear}
            aria-label={t("SEARCH.CLEAR")}
          >
            <IconCrossCircle aria-hidden="true" />
          </button>
        )}
        <button
          type="submit"
          aria-label={t("SEARCH.SUBMIT")}
          className="search-bar__input-submit"
        >
          <IconSearch aria-hidden="true" />
        </button>
      </form>
    </div>
  );
}

export default SearchBar;
