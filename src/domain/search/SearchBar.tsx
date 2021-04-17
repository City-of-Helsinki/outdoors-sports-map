import { useTranslation } from "react-i18next";

import SMIcon from "../../common/components/SMIcon";

type Props = {
  input: string;
  onInput: (value: string) => void;
  onSubmit: () => void;
  onClear: () => void;
  searchActive: boolean;
  disabled: boolean;
};

function SearchBar({
  input,
  onInput,
  onSubmit,
  onClear,
  searchActive,
  disabled,
}: Props) {
  const { t } = useTranslation();

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
        {disabled && ( // TODO: Use buttons instead of a span
          // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
          <span className="search-bar__input-loading" onClick={onClear}>
            <SMIcon icon="loading" aria-label={t("SEARCH.LOADING")} />
          </span>
        )}
        <input
          name="search"
          id="search"
          aria-label={t("SEARCH.SEARCH")}
          type="text"
          onChange={(e) => onInput(e.target.value)}
          placeholder={
            disabled
              ? `      ${t("GENERAL.LOADING")}`
              : `${t("SEARCH.SEARCH")}...`
          }
          disabled={disabled}
          value={input}
        />
        {(input || searchActive) && (
          <button
            type="button"
            className="search-bar__input-clear"
            onClick={onClear}
          >
            <SMIcon icon="close" aria-label={t("SEARCH.CLEAR")} />
          </button>
        )}
        <button type="submit" className="search-bar__input-submit">
          <SMIcon icon="search" aria-label={t("SEARCH.SUBMIT")} />
        </button>
      </form>
    </div>
  );
}

export default SearchBar;
