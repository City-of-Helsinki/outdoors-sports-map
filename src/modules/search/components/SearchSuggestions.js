/*
   eslint-disable
   jsx-a11y/anchor-is-valid,
   jsx-a11y/click-events-have-key-events,
   jsx-a11y/no-static-element-interactions,
*/

import React from 'react';
import { withTranslation } from 'react-i18next';
import UnitSuggestion from './UnitSuggestion';
import AddressSuggestion from './AddressSuggestion';

const SearchSuggestions = withTranslation()(({
  units, addresses, openAllResults, openUnit, handleAddressClick, t,
}) => (
  <div className="search-suggestions">
    {units.length > 0 || addresses.length > 0
      ? (
        <div className="search-suggestions__list">
          {units.length > 0 && <a className="search-suggestions__open-all" onClick={openAllResults}>{t('SEARCH.SHOW_ALL_RESULTS')}</a>}
          {units.map((result) => <UnitSuggestion key={result.id} unit={result} handleClick={() => openUnit(result.id)} />)}
          {addresses.map((address) => <AddressSuggestion key={address.properties.id} address={address} handleClick={handleAddressClick} />)}
        </div>
      )
      : null}
  </div>
));

export default SearchSuggestions;
