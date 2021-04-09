// @flow

/*
   eslint-disable
   react/default-props-match-prop-types,
   react/destructuring-assignment,
   react/no-string-refs,
   react/require-default-props,
   react/static-property-placement,
   react/prop-types,
*/

import { hot } from 'react-hot-loader/root';
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import { fetchUnits } from '../../unit/actions';
import { fetchServices } from '../../service/actions';
import { setLocation } from '../../map/actions';
import changeLanguage from '../../language/actions';
import * as fromMap from '../../map/selectors';
import * as fromSearch from '../../search/selectors';
import * as fromUnit from '../../unit/selectors';
import * as fromService from '../../service/selectors';
import getLanguage from '../../language/selectors';
import getIsLoading from '../selectors';
import { getDefaultFilters, getAttr } from '../../unit/helpers';
import MapView from '../../unit/components/MapView';
import UnitBrowser from '../../unit/components/UnitBrowser';
import SingleUnitModalContainer from '../../unit/components/SingleUnitModalContainer';
import { locations } from '../constants';
import { arrayifyQueryValue } from '../../common/helpers';
import Page from '../../common/components/Page';
import { LanguageProvider } from '../../common/LanguageContext';

type Props = {
  fetchUnits: () => void,
  fetchServices: () => void,
  changeLanguage: (string) => void,
  setLocation: (number[]) => void,
  position: number[],
  unitData: Object[],
  activeLanguage: string,
  history: Object,
  location: Object,
  isLoading: boolean,
  serviceData: Object[],
  selectedUnit: Object,
  isSearching: boolean,
  mapCenter: number[],
  address: string,
  params: Object,
  t: (string) => string,
  i8n: {
    language: string,
  },
};

type DefaultProps = {
  position: number[],
  unitData: Object[],
};

class HomeContainer extends Component<DefaultProps, Props, void> {
  static defaultProps = {
    unitData: [],
    position: locations.HELSINKI,
  };

  props: Props;

  mapRef = null;

  leafletMap = null;

  initialPosition = null;

  constructor(props) {
    super(props);

    this.initialPosition = props.position;
  }

  componentDidMount() {
    this.props.fetchUnits({});
    this.props.fetchServices();
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.activeLanguage !== this.props.activeLanguage) {
      this.forceUpdate();
    }
  }

  componentWillUnmount() {
    // TODO: Poll /observation, not /unit. => Normalize observations to store.
    // clearInterval(this.pollUnitsInterval);
  }

  getTitle() {
    const { t, selectedUnit, activeLanguage } = this.props;
    const title = [];

    title.push(t('APP.NAME'));

    if (selectedUnit) {
      title.push(` - ${getAttr(selectedUnit.name, activeLanguage)}`);
    }

    return title.join('');
  }

  setMapRef = (ref) => {
    if (ref) {
      this.mapRef = ref;
      this.leafletMap = ref.mapRef.leafletElement;
    }
  };

  fetchUnits = () => {
    this.props.fetchUnits({
      lat: this.props.position[0],
      lon: this.props.position[1],
    });
  };

  handleChangeLanguage = (language: string) => {
    this.props.changeLanguage(language);
  };

  setLocation = (location: number[]) => {
    this.props.setLocation(location);
  };

  setView = (coordinates: number[]) => {
    this.mapRef.getWrappedInstance().setView(coordinates);
  };

  openUnit = (unitId: string) => {
    const {
      history,
      location: { search },
    }: Props = this.props;

    history.push({
      pathname: `/unit/${unitId}`,
      search,
    });
  };

  closeUnit = () => {
    const {
      history,
      location: { search },
    } = this.props;

    history.push({
      pathname: '/',
      search,
    });
  };

  getActiveLanguage = () => this.props.activeLanguage;

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
      match: { params },
      location: { search },
      i18n: { language },
    } = this.props;

    const filter = new URLSearchParams(search).get('filter');
    const activeFilter = filter
      ? arrayifyQueryValue(filter)
      : getDefaultFilters();

    return (
      <React.StrictMode>
        <LanguageProvider value={{ activeLanguage }}>
          <Page title={this.getTitle()}>
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
                ref={this.setMapRef}
                selectedUnit={selectedUnit}
                activeLanguage={language}
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
          </Page>
        </LanguageProvider>
      </React.StrictMode>
    );
  }
}

const mapStateToProps = (state, props: Props) => ({
  unitData: fromUnit.getVisibleUnits(state, props.location.search),
  serviceData: fromService.getServicesObject(state),
  selectedUnit: fromUnit.getUnitById(state, { id: props.match.params.unitId }),
  activeLanguage: getLanguage(state),
  isLoading: getIsLoading(state),
  mapCenter: fromMap.getLocation(state),
  position: fromMap.getLocation(state),
  address: fromMap.getAddress(state),
  isSearching: fromSearch.getIsFetching(state),
});

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      fetchUnits,
      fetchServices,
      setLocation,
      changeLanguage,
    },
    dispatch
  );

export default hot(
  withRouter(
    connect(
      mapStateToProps,
      mapDispatchToProps
    )(withTranslation()(HomeContainer))
  )
);
