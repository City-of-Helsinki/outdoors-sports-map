/*
   eslint-disable
   jsx-a11y/click-events-have-key-events,
   jsx-a11y/label-has-associated-control,
   jsx-a11y/no-static-element-interactions,
*/

import React from 'react';
import { withTranslation } from 'react-i18next';
import SMIcon from '../../home/components/SMIcon';

const SearchBar = withTranslation()(
  ({ input, onInput, onSubmit, onClear, searchActive, disabled, t }) => (
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
          <span className="search-bar__input-loading" onClick={onClear}>
            <SMIcon icon="loading" aria-label={t('SEARCH.LOADING')} />
          </span>
        )}
        <input
          name="search"
          id="search"
          aria-label={t('SEARCH.SEARCH')}
          type="text"
          onChange={(e) => onInput(e.target.value)}
          placeholder={
            disabled
              ? `      ${t('GENERAL.LOADING')}`
              : `${t('SEARCH.SEARCH')}...`
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
            <SMIcon icon="close" aria-label={t('SEARCH.CLEAR')} />
          </button>
        )}
        <button type="submit" className="search-bar__input-submit">
          <SMIcon icon="search" aria-label={t('SEARCH.SUBMIT')} />
        </button>
      </form>
    </div>
  )
);

export default SearchBar;
