// @flow

/*
   eslint-disable
   jsx-a11y/alt-text,
   jsx-a11y/click-events-have-key-events,
   jsx-a11y/no-static-element-interactions,
   react/button-has-type,
   react/destructuring-assignment,
   react/require-default-props,
*/

import PropTypes from 'prop-types';
import React, { Component, useContext } from 'react';
import { withRouter } from 'react-router';
import values from 'lodash/values';
import { translate } from 'react-i18next';
import addressBarMarker from '@assets/markers/location.svg';
import ListView from './ListView';
import SMIcon from '../../home/components/SMIcon';
import { StatusFilters } from '../constants';
import UnitFilters from './UnitFilters';
import SearchContainer from '../../search/components/SearchContainer';
import LanguageContext from '../../common/LanguageContext';

import {
  getAddressToDisplay,
  getOnSeasonSportFilters,
  getOffSeasonSportFilters,
  getDefaultStatusFilter,
  getDefaultSportFilter,
} from '../helpers';

const ActionButton = ({ action, icon, isActive }) => (
  <button className={`action-button ${isActive ? 'is-active' : ''}`} onClick={action}>
    <SMIcon className="unit-browser__action" icon={icon} />
  </button>
);

ActionButton.propTypes = {
  action: PropTypes.func.isRequired,
  icon: PropTypes.string.isRequired,
  isActive: PropTypes.bool.isRequired,
};

const Header = ({
  expand, collapse, openUnit, setView, isExpanded,
}) => (
  <div className="header">
    <SearchContainer onSearch={expand} openUnit={openUnit} setView={setView} />
    <div className="action-buttons">
      <ActionButton action={collapse} icon="map-options" isActive={!isExpanded} />
      <ActionButton action={expand} icon="browse" isActive={isExpanded} />
    </div>
  </div>
);

Header.propTypes = {
  collapse: PropTypes.func.isRequired,
  expand: PropTypes.func.isRequired,
  isExpanded: PropTypes.bool.isRequired,
  openUnit: PropTypes.func.isRequired,
  setView: PropTypes.func.isRequired,
};

const AddressBar = ({ address, handleClick }) => {
  const { activeLanguage } = useContext(LanguageContext);

  return (
    <div className="address-bar__container" onClick={() => handleClick(address.location.coordinates.slice().reverse())}>
      <img className="address-bar__marker" src={addressBarMarker} height="20px" width="16px" />
      {address && getAddressToDisplay(address, activeLanguage)}
    </div>
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
  }

  calculateMaxHeight = () => {
    // $FlowFixMe
    const fixedPartHeight = document.getElementById('always-visible').offsetHeight;
    return window.innerHeight - fixedPartHeight;
  }

  updateQueryParameter = (key: string, value: string): void => {
    const { router, location: { query } } = this.props;

    router.push({
      query: { ...query, [key]: value },
    });
  }

  toggleStatusFilter = (filter: string): void => {
    this.updateQueryParameter('status', filter);
  }

  toggleSportFilter = (sport: string): void => {
    this.updateQueryParameter('sport', sport);
  }

  collapse = () => {
    this.setState({ isExpanded: false });
  }

  expand = () => {
    this.setState({ isExpanded: true });
  }

  render() {
    const { t } = this.props;
    const {
      units, services, isLoading, isSearching, position, openUnit, setView, address, params, leafletMap, singleUnitSelected, location: { query },
    } = this.props;
    const { isExpanded } = this.state;
    let { contentMaxHeight } = this.state;
    if (isExpanded) {
      contentMaxHeight = contentMaxHeight || this.calculateMaxHeight();
    }

    const currentSportFilter = query && query.sport || getDefaultSportFilter();
    const currentStatusFilter = query && query.status || getDefaultStatusFilter();
    return (
      <div className={`unit-browser ${isExpanded ? 'expanded' : ''}`} style={params.unitId ? { display: 'none' } : null}>
        <div id="always-visible" className="unit-browser__fixed">
          <Header
            expand={this.expand}
            collapse={this.collapse}
            setView={setView}
            openUnit={openUnit}
            isExpanded={isExpanded}
          />
          {!isLoading
          && (
          <UnitFilters
            filters={[{
              name: 'sport',
              active: currentSportFilter,
              options: getOnSeasonSportFilters(),
              secondaryOptions: getOffSeasonSportFilters(),
            }, {
              name: 'status',
              active: currentStatusFilter,
              options: values(StatusFilters),
            }]}
            updateFilter={this.updateQueryParameter}
          />
          )}
          {!isLoading && Object.keys(address).length !== 0 && <AddressBar handleClick={setView} address={address} />}
        </div>
        <div className="unit-browser__content" style={{ maxHeight: contentMaxHeight }}>
          <ListView filter={`${currentSportFilter};${currentStatusFilter}`} isVisible={isExpanded && !singleUnitSelected} isLoading={isLoading || isSearching} units={units} services={services} position={position} openUnit={openUnit} leafletMap={leafletMap} />
        </div>
        {t('UNIT.TMP_MESSAGE').length > 0
        && (
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
  leafletMap: PropTypes.objectOf(PropTypes.any),
  location: PropTypes.objectOf(PropTypes.any).isRequired,
  openUnit: PropTypes.func.isRequired,
  params: PropTypes.objectOf(PropTypes.any).isRequired,
  position: PropTypes.arrayOf(PropTypes.number).isRequired,
  router: PropTypes.objectOf(PropTypes.any).isRequired,
  services: PropTypes.objectOf(PropTypes.object).isRequired,
  setView: PropTypes.func.isRequired,
  singleUnitSelected: PropTypes.bool.isRequired,
  t: PropTypes.func.isRequired,
  units: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default withRouter(translate()(UnitBrowser));
