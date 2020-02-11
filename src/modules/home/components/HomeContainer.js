// @flow

/*
   eslint-disable
   react/default-props-match-prop-types,
   react/destructuring-assignment,
   react/no-string-refs,
   react/require-default-props,
   react/static-property-placement,
*/

import PropTypes from 'prop-types';
import { hot } from 'react-hot-loader/root';
import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { translate } from 'react-i18next';
import { fetchUnits } from '../../unit/actions';
import { fetchServices } from '../../service/actions';
import { setLocation } from '../../map/actions';
import changeLanguage from '../../language/actions';
import getStoredLang from '../../language/helpers';
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
  t: (string) => string,
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

  leafletMap = null;

  initialPosition = undefined;

  getChildContext() {
    return {
      getActiveLanguage: this.getActiveLanguage,
    };
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillMount() {
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

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps(nextProps: Props) {
    if (nextProps.activeLanguage !== this.props.activeLanguage) {
      this.forceUpdate();
    }
  }

  componentDidUpdate() {
    this.leafletMap = this.refs.map.getWrappedInstance().refs.map.leafletElement;
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
    this.refs.map.getWrappedInstance().setView(coordinates);
  };

  openUnit = (unitId: string) => {
    const {
      router,
      location: { query },
    }: Props = this.props;
    router.push({
      pathname: `/unit/${unitId}`,
      query,
    });
  };

  closeUnit = () => {
    const {
      router,
      location: { query },
    } = this.props;
    router.push({
      pathname: '/',
      query,
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
      params,
      location: {
        query: { filter },
      },
    } = this.props;
    const activeFilter = filter
      ? arrayifyQueryValue(filter)
      : getDefaultFilters();

    return (
      <React.StrictMode>
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
        </Page>
      </React.StrictMode>
    );
  }
}

HomeContainer.childContextTypes = {
  getActiveLanguage: PropTypes.func,
};

const mapStateToProps = (state, props: Props) => ({
  unitData: fromUnit.getVisibleUnits(state, props.location.query),
  serviceData: fromService.getServicesObject(state),
  selectedUnit: fromUnit.getUnitById(state, { id: props.params.unitId }),
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
  withRouter(connect(mapStateToProps, mapDispatchToProps)(HomeContainer))
);
