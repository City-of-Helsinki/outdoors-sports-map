// @flow

/*
   eslint-disable
   jsx-a11y/alt-text,
   jsx-a11y/click-events-have-key-events,
   jsx-a11y/no-static-element-interactions,
   react/button-has-type,
   react/forbid-prop-types,
   react/destructuring-assignment,
   react/prop-types,
   react/require-default-props,
   react/state-in-constructor,
*/

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { withRouter } from 'react-router';
import values from 'lodash/values';
import { translate } from 'react-i18next';
import addressBarMarker from '@assets/markers/location.svg';
import ListView from './ListView';
import SMIcon from '../../home/components/SMIcon';
import { StatusFilters } from '../constants';
import UnitFilters from './UnitFilters';
import SearchContainer from '../../search/components/SearchContainer';

import {
  getAddressToDisplay,
  getOnSeasonSportFilters,
  getOffSeasonSportFilters,
  getDefaultStatusFilter,
  getDefaultSportFilter,
} from '../helpers';

const ActionButton = ({ action, icon, isActive, name }) => (
  <button className="action-button" aria-pressed={isActive} onClick={action}>
    <SMIcon className="unit-browser__action" icon={icon} aria-label={name} />
  </button>
);

const Header = translate()(
  ({ t, expand, collapse, openUnit, setView, isExpanded }) => (
    <div className="header">
      <SearchContainer
        onSearch={expand}
        openUnit={openUnit}
        setView={setView}
      />
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
  )
);

const AddressBar = ({ address, handleClick }, context) => (
  <button
    type="button"
    className="address-bar__container"
    onClick={() => handleClick(address.location.coordinates.slice().reverse())}
  >
    <img
      className="address-bar__marker"
      src={addressBarMarker}
      height="20px"
      width="16px"
      alt=""
    />
    {address && getAddressToDisplay(address, context.getActiveLanguage())}
  </button>
);

AddressBar.contextTypes = {
  getActiveLanguage: PropTypes.func,
};

class UnitBrowser extends Component {
  state: {
    isExpanded: boolean,
    contentMaxHeight: ?number,
  };

  state = {
    isExpanded: false,
    contentMaxHeight: null,
  };

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
      router,
      location: { query },
    } = this.props;

    router.push({
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
      openUnit,
      setView,
      address,
      params,
      leafletMap,
      singleUnitSelected,
      location: { query },
    } = this.props;
    const { isExpanded } = this.state;
    let { contentMaxHeight } = this.state;
    if (isExpanded) {
      contentMaxHeight = contentMaxHeight || this.calculateMaxHeight();
    }

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
            setView={setView}
            openUnit={openUnit}
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
            <AddressBar handleClick={setView} address={address} />
          )}
        </div>
        <div
          className="unit-browser__content"
          style={{ maxHeight: contentMaxHeight }}
        >
          <ListView
            filter={`${currentSportFilter};${currentStatusFilter}`}
            isVisible={isExpanded && !singleUnitSelected}
            isLoading={isLoading || isSearching}
            units={units}
            services={services}
            position={position}
            openUnit={openUnit}
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
  units: PropTypes.array,
};

export default withRouter(translate()(UnitBrowser));
