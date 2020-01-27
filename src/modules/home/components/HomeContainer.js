// @flow
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { fetchUnits } from '../../unit/actions';
import { fetchServices } from '../../service/actions';
import { setLocation } from '../../map/actions';
import { changeLanguage } from '../../language/actions';
import { getStoredLang } from '../../language/helpers';
import * as fromMap from '../../map/selectors';
import * as fromSearch from '../../search/selectors';
import * as fromUnit from '../../unit/selectors';
import * as fromService from '../../service/selectors';
import * as fromLanguage from '../../language/selectors';
import { getIsLoading } from '../selectors';
import { getDefaultFilters } from '../../unit/helpers';
import MapView from '../../unit/components/MapView.js';
import UnitBrowser from '../../unit/components/UnitBrowser.js';
import SingleUnitModalContainer from '../../unit/components/SingleUnitModalContainer';
import { locations } from '../constants.js';
import { arrayifyQueryValue } from '../../common/helpers';
import { SUPPORTED_LANGUAGES } from '../../language/constants';

type Props = {
  fetchUnits: () => void,
  fetchServices: () => void,
  changeLanguage: (string) => void,
  setLocation: (number[]) => void,
  position: number[],
  unitData: Object[],
  activeLanguage: string,
  router: Object,
  location: Object,
  isLoading: boolean,
  serviceData: Object[],
  selectedUnit: Object,
  isSearching: boolean,
  mapCenter: number[],
  address: string,
  params: Object,
};

type DefaultProps = {
  position: number[],
  unitData: Object[],
};

export class HomeContainer extends Component<DefaultProps, Props, void> {
  static defaultProps = {
    unitData: [],
    position: locations.HELSINKI,
  };

  props: Props;

  leafletMap = null;

  initialPosition = undefined;

  getChildContext() {
    return {
      getActiveLanguage: this.getActiveLanguage,
    };
  }

  componentWillMount() {
    this.props.fetchUnits({});
    this.props.fetchServices();

    // TODO: Poll /observation, not /unit. => Normalize observations to store.
    // this.pollUnitsInterval = setInterval(this.fetchUnits, POLL_INTERVAL);
    this.initialPosition = this.props.position;

    if (!getStoredLang()) {
      // $FlowFixMe
      const userLang = navigator.language || navigator.userLanguage;

      if (userLang.includes(SUPPORTED_LANGUAGES.Svenska)) {
        this.handleChangeLanguage(SUPPORTED_LANGUAGES.Svenska);
      } else if (userLang.includes(SUPPORTED_LANGUAGES.English)) {
        this.handleChangeLanguage(SUPPORTED_LANGUAGES.English);
      } else if (userLang.includes(SUPPORTED_LANGUAGES.Suomi)) {
        this.handleChangeLanguage(SUPPORTED_LANGUAGES.Suomi);
      }
    }
  }

  fetchUnits = () => {
    this.props.fetchUnits({
      lat: this.props.position[0],
      lon: this.props.position[1],
    });
  }

  componentWillUnmount() {
    // TODO: Poll /observation, not /unit. => Normalize observations to store.
    // clearInterval(this.pollUnitsInterval);
  }

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.activeLanguage !== this.props.activeLanguage) {
      this.forceUpdate();
    }
  }

  componentDidUpdate() {
    this.leafletMap = this.refs.map.getWrappedInstance().refs.map.leafletElement;
  }

  handleChangeLanguage = (language: string) => {
    this.props.changeLanguage(language);
  }

  setLocation = (location: number[]) => {
    this.props.setLocation(location);
  }

  setView = (coordinates: number[]) => {
    this.refs.map.getWrappedInstance().setView(coordinates);
  }

  openUnit = (unitId: string) => {
    const { router, location: { query } }: Props = this.props;
    router.push({
      pathname: `/unit/${unitId}`,
      query,
    });
  }

  closeUnit = () => {
    const { router, location: { query } } = this.props;
    router.push({
      pathname: '/',
      query,
    });
  }

  getActiveLanguage = () => this.props.activeLanguage

  render() {
    const {
      unitData,
      serviceData,
      isLoading,
      selectedUnit,
      isSearching,
      mapCenter,
      address,
      activeLanguage,
      params,
      location: {
        query: { filter },
      },
    } = this.props;
    const activeFilter = filter ? arrayifyQueryValue(filter) : getDefaultFilters();

    return (
      <div className="home">
        <UnitBrowser
          isLoading={isLoading}
          isSearching={isSearching}
          units={unitData}
          services={serviceData}
          activeFilter={activeFilter}
          openUnit={this.openUnit}
          position={mapCenter}
          address={address}
          params={params}
          setLocation={this.setLocation}
          setView={this.setView}
          leafletMap={this.leafletMap}
          singleUnitSelected={!!params.unitId}
        />
        <MapView
          ref="map"
          selectedUnit={selectedUnit}
          activeLanguage={activeLanguage}
          params={params}
          setLocation={this.props.setLocation}
          position={this.initialPosition}
          units={unitData}
          services={serviceData}
          changeLanguage={this.handleChangeLanguage}
          openUnit={this.openUnit}
          mapCenter={mapCenter}
        />
        <SingleUnitModalContainer
          isLoading={isLoading}
          isOpen={!!params.unitId}
          unit={selectedUnit}
          services={serviceData}
          params={params}
          handleClick={this.closeUnit}
        />
      </div>
    );
  }
}

HomeContainer.childContextTypes = {
  getActiveLanguage: React.PropTypes.func,
};

const mapStateToProps = (state, props: Props) => ({
  unitData: fromUnit.getVisibleUnits(state, props.location.query),
  serviceData: fromService.getServicesObject(state),
  selectedUnit: fromUnit.getUnitById(state, { id: props.params.unitId }),
  activeLanguage: fromLanguage.getLanguage(state),
  isLoading: getIsLoading(state),
  mapCenter: fromMap.getLocation(state),
  position: fromMap.getLocation(state),
  address: fromMap.getAddress(state),
  isSearching: fromSearch.getIsFetching(state),
});

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({
  fetchUnits, fetchServices, setLocation, changeLanguage,
}, dispatch);

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(
  HomeContainer,
));
