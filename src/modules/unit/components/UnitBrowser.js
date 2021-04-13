// @flow

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import values from 'lodash/values';
import { useTranslation, withTranslation } from 'react-i18next';
import addressBarMarker from '@assets/markers/location.svg';

import SMIcon from '../../home/components/SMIcon';
import SearchContainer from '../../search/components/SearchContainer';
import {
  getAddressToDisplay,
  getOnSeasonSportFilters,
  getOffSeasonSportFilters,
  getDefaultStatusFilter,
  getDefaultSportFilter,
} from '../helpers';
import { StatusFilters } from '../constants';
import ListView from './ListView';
import UnitFilters from './UnitFilters';

const ActionButton = ({ action, icon, isActive, name }) => (
  <button
    className="action-button"
    aria-pressed={isActive}
    onClick={action}
    type="button"
  >
    <SMIcon className="unit-browser__action" icon={icon} aria-label={name} />
  </button>
);

ActionButton.propTypes = {
  action: PropTypes.func.isRequired,
  icon: PropTypes.string.isRequired,
  isActive: PropTypes.bool.isRequired,
  name: PropTypes.string.isRequired,
};

const Header = ({ expand, collapse, onViewChange, isExpanded }) => {
  const { t } = useTranslation();

  return (
    <div className="header">
      <SearchContainer onSearch={expand} onViewChange={onViewChange} />
      <div className="action-buttons">
        <ActionButton
          action={collapse}
          icon="map-options"
          isActive={!isExpanded}
          name={t('UNIT.MAP_BUTTON')}
        />
        <ActionButton
          action={expand}
          icon="browse"
          isActive={isExpanded}
          name={t('UNIT.LIST_BUTTON')}
        />
      </div>
    </div>
  );
};

Header.propTypes = {
  collapse: PropTypes.func.isRequired,
  expand: PropTypes.func.isRequired,
  isExpanded: PropTypes.bool.isRequired,
  onViewChange: PropTypes.func.isRequired,
};

const AddressBar = ({ address, handleClick }) => {
  const {
    i18n: {
      languages: [language],
    },
  } = useTranslation();

  return (
    <button
      type="button"
      className="address-bar__container"
      onClick={() =>
        handleClick(address.location.coordinates.slice().reverse())
      }
    >
      <img
        className="address-bar__marker"
        src={addressBarMarker}
        height="20px"
        width="16px"
        alt=""
      />
      {address && getAddressToDisplay(address, language)}
    </button>
  );
};

AddressBar.propTypes = {
  address: PropTypes.objectOf(PropTypes.any).isRequired,
  handleClick: PropTypes.func.isRequired,
};

type State = {
  isExpanded: boolean,
  contentMaxHeight: ?number,
};

class UnitBrowser extends Component<void, void, State> {
  constructor(props) {
    super(props);
    this.state = {
      isExpanded: false,
      contentMaxHeight: null,
    };
  }

  componentDidMount() {
    window.addEventListener('resize', this.updateContentMaxHeight);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateContentMaxHeight);
  }

  updateContentMaxHeight = () => {
    // $FlowFixMe
    this.setState({ contentMaxHeight: this.calculateMaxHeight() });
  };

  calculateMaxHeight = () => {
    // $FlowFixMe
    const fixedPartHeight = document.getElementById('always-visible')
      .offsetHeight;
    return window.innerHeight - fixedPartHeight;
  };

  updateQueryParameter = (key: string, value: string): void => {
    const {
      history,
      location: { query },
    } = this.props;

    history.push({
      query: { ...query, [key]: value },
    });
  };

  toggleStatusFilter = (filter: string): void => {
    this.updateQueryParameter('status', filter);
  };

  toggleSportFilter = (sport: string): void => {
    this.updateQueryParameter('sport', sport);
  };

  collapse = () => {
    this.setState({ isExpanded: false });
  };

  expand = () => {
    this.setState({ isExpanded: true });
  };

  render() {
    const { t } = this.props;
    const {
      units,
      services,
      isLoading,
      isSearching,
      position,
      onViewChange,
      address,
      params,
      leafletMap,
      singleUnitSelected,
      location: { query },
    } = this.props;
    const { isExpanded } = this.state;
    const { contentMaxHeight } = this.state;

    const currentSportFilter =
      (query && query.sport) || getDefaultSportFilter();
    const currentStatusFilter =
      (query && query.status) || getDefaultStatusFilter();
    return (
      <div
        className={`unit-browser ${isExpanded ? 'expanded' : ''}`}
        style={params.unitId ? { display: 'none' } : null}
      >
        <div id="always-visible" className="unit-browser__fixed">
          <Header
            expand={this.expand}
            collapse={this.collapse}
            onViewChange={onViewChange}
            isExpanded={isExpanded}
          />
          {!isLoading && (
            <UnitFilters
              filters={[
                {
                  name: 'sport',
                  active: currentSportFilter,
                  options: getOnSeasonSportFilters(),
                  secondaryOptions: getOffSeasonSportFilters(),
                },
                {
                  name: 'status',
                  active: currentStatusFilter,
                  options: values(StatusFilters),
                },
              ]}
              updateFilter={this.updateQueryParameter}
            />
          )}
          {!isLoading && Object.keys(address).length !== 0 && (
            <AddressBar handleClick={onViewChange} address={address} />
          )}
        </div>
        <div
          className="unit-browser__content"
          style={{
            maxHeight: isExpanded
              ? contentMaxHeight || this.calculateMaxHeight()
              : contentMaxHeight,
          }}
        >
          <ListView
            filter={`${currentSportFilter};${currentStatusFilter}`}
            isVisible={isExpanded && !singleUnitSelected}
            isLoading={isLoading || isSearching}
            units={units}
            services={services}
            position={position}
            leafletMap={leafletMap}
          />
        </div>
        {t('UNIT.TMP_MESSAGE').length > 0 && (
          <div
            className="unit-browser__tmp_msg"
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: t('UNIT.TMP_MESSAGE') }}
          />
        )}
      </div>
    );
  }
}

UnitBrowser.propTypes = {
  address: PropTypes.objectOf(PropTypes.any).isRequired,
  isLoading: PropTypes.bool.isRequired,
  isSearching: PropTypes.bool.isRequired,
  leafletMap: PropTypes.objectOf(PropTypes.any).isRequired,
  location: PropTypes.objectOf(PropTypes.any).isRequired,
  params: PropTypes.objectOf(PropTypes.any).isRequired,
  position: PropTypes.arrayOf(PropTypes.number).isRequired,
  history: PropTypes.objectOf(PropTypes.any).isRequired,
  services: PropTypes.objectOf(PropTypes.object).isRequired,
  singleUnitSelected: PropTypes.bool.isRequired,
  t: PropTypes.func.isRequired,
  units: PropTypes.arrayOf(PropTypes.object).isRequired,
  onViewChange: PropTypes.func.isRequired,
};

export default withRouter(withTranslation()(UnitBrowser));
