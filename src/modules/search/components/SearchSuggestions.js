// @flow

import React from 'react';
import { useTranslation } from 'react-i18next';
import UnitSuggestion from './UnitSuggestion';
import AddressSuggestion from './AddressSuggestion';

type Props = {
  units: object[],
  addresses: object[],
  openAllResults: () => void,
  handleAddressClick: (address: object) => void,
};

const SearchSuggestions = ({
  units,
  addresses,
  openAllResults,
  handleAddressClick,
}: Props) => {
  const { t } = useTranslation();

  return (
    <div className="search-suggestions">
      {units.length > 0 || addresses.length > 0 ? (
        <div className="search-suggestions__list">
          {units.length > 0 && (
            // eslint-disable-next-line jsx-a11y/anchor-is-valid
            <a
              href=""
              className="search-suggestions__open-all"
              onClick={(e) => {
                e.preventDefault();
                openAllResults(e);
              }}
            >
              {t('SEARCH.SHOW_ALL_RESULTS')}
            </a>
          )}
          {units.map((result) => (
            <UnitSuggestion key={result.id} unit={result} />
          ))}
          {addresses.map((address) => (
            <AddressSuggestion
              key={address.properties.id}
              address={address}
              handleClick={handleAddressClick}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default SearchSuggestions;
