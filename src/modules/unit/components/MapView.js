// @flow

/*
   eslint-disable
   jsx-a11y/anchor-is-valid,
   jsx-a11y/click-events-have-key-events,
   jsx-a11y/no-static-element-interactions,
   react/destructuring-assignment,
   react/forbid-prop-types,
   react/no-string-refs,
   react/prop-types,
   react/require-default-props,
   react/state-in-constructor,
   react/static-property-placement,
*/

import React, { Component, PropTypes } from 'react';
import { Map, TileLayer, ZoomControl } from 'react-leaflet';
import { translate } from 'react-i18next';
import SMIcon from '../../home/components/SMIcon';
import OSMIcon from '../../home/components/OSMIcon';
import FeedbackModal from './FeedbackModal';
import { View } from './View';
import Logo from '../../home/components/Logo';
import Control from '../../map/components/Control';
import DropdownControl from '../../map/components/DropdownControl';
import { mobileBreakpoint } from '../../common/constants';
import { SUPPORTED_LANGUAGES } from '../../language/constants';
import {
  MAP_URL,
  MAP_RETINA_URL,
  DEFAULT_ZOOM,
  MIN_ZOOM,
  MAX_ZOOM,
  BOUNDARIES,
} from '../../map/constants';
import latLngToArray from '../../map/helpers';
import { getUnitPosition } from '../helpers';
import UnitsOnMap from './UnitsOnMap';
import UserLocationMarker from '../../map/components/UserLocationMarker';
import { isRetina } from '../../common/helpers';
import OutboundLink from '../../common/components/OutboundLink';
import LanguageChanger from './LanguageChanger';
import TranslationProvider from '../../common/components/translation/TranslationProvider';

class MapView extends Component {
  static propTypes = {
    position: PropTypes.array.isRequired,
    units: PropTypes.array,
  };

  state = {
    isMobile: window.innerWidth < mobileBreakpoint,
    menuOpen: false,
    aboutModalOpen: false,
    feedbackModalOpen: false,
    zoomLevel: DEFAULT_ZOOM,
  };

  componentDidMount() {
    window.addEventListener('resize', this.updateIsMobile);
  }

  componentWillReceiveProps(nextProps) {
    const { selectedUnit } = this.props;
    if (
      nextProps.selectedUnit &&
      (!selectedUnit || selectedUnit.id !== nextProps.selectedUnit.id)
    ) {
      this.centerMapToUnit(nextProps.selectedUnit);
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateIsMobile);
  }

  centerMapToUnit = (unit: Object) => {
    if (this.state.isMobile) {
      const location = getUnitPosition(unit);
      location[0] += 0.035;
      location[1] -= 0.005;
      // For some reason could not use reverse here so had to do this weird way.
      this.refs.map.leafletElement.setView(location, DEFAULT_ZOOM);
    } else {
      const location = getUnitPosition(unit);
      location[1] -= 0.07;

      this.refs.map.leafletElement.setView(location, DEFAULT_ZOOM);
    }
  };

  handleZoom = () => {
    this.setState({ zoomLevel: this.refs.map.leafletElement.getZoom() });
  };

  updateIsMobile = () => {
    this.setState({ isMobile: window.innerWidth < mobileBreakpoint });
  };

  locateUser = () => {
    this.refs.map.leafletElement.locate({ setView: true });
  };

  handleClick = (event: Object) => {
    // Click events from info menu and language changer hit this. Don't
    // do anything for those events.
    if (event.originalEvent.target.className.includes('leaflet')) {
      this.setLocation(event);
    }
  };

  setLocation = (event: Object) => {
    this.props.setLocation(latLngToArray(event.latlng));
  };

  toggleMenu = () => {
    if (this.state.menuOpen) {
      this.setState({ menuOpen: false });
    } else {
      this.setState({ menuOpen: true });
    }
  };

  setView = (coordinates) => {
    this.refs.map.leafletElement.setView(coordinates);
  };

  openAboutModal = () => {
    this.setState({ aboutModalOpen: true });
  };

  closeAboutModal = () => {
    this.setState({ aboutModalOpen: false });
  };

  openFeedbackModal = () => {
    this.setState({ feedbackModalOpen: true });
  };

  closeFeedbackModal = () => {
    this.setState({ feedbackModalOpen: false });
  };

  render() {
    const {
      position,
      selectedUnit,
      units,
      selected,
      activeLanguage,
      openUnit,
      changeLanguage,
      t,
    } = this.props;
    const { isMobile, zoomLevel, menuOpen } = this.state;

    return (
      <View id="map-view" className="map-view" isSelected={selected}>
        <Map
          ref="map"
          zoomControl={false}
          attributionControl={false}
          center={position}
          maxBounds={BOUNDARIES}
          zoom={DEFAULT_ZOOM}
          minZoom={MIN_ZOOM}
          maxZoom={MAX_ZOOM}
          onClick={this.handleClick}
          onLocationfound={this.setLocation}
          onZoomend={this.handleZoom}
        >
          <TileLayer
            url={isRetina() ? MAP_RETINA_URL : MAP_URL}
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          />
          <UserLocationMarker />
          <UnitsOnMap
            units={units}
            zoomLevel={zoomLevel}
            selectedUnit={selectedUnit}
            openUnit={openUnit}
          />
          <ZoomControl position="bottomright" />
          <Control
            handleClick={this.locateUser}
            className="leaflet-control-locate"
            position="bottomright"
          >
            <OSMIcon icon="locate" />
          </Control>
          {Object.keys(SUPPORTED_LANGUAGES).length > 1 && !isMobile && (
            <LanguageChanger
              activeLanguage={activeLanguage}
              changeLanguage={changeLanguage}
            />
          )}
          <DropdownControl
            id="info-dropdown"
            handleClick={this.toggleMenu}
            className="leaflet-control-info"
            position={isMobile ? 'bottomleft' : 'topright'}
            aria-haspopup="true"
            aria-expanded={menuOpen}
            activeLanguage={activeLanguage}
            isOpen={menuOpen}
            options={
              <InfoMenu
                store={this.context.store}
                t={t}
                isMobile={isMobile}
                openAboutModal={this.openAboutModal}
                openFeedbackModal={this.openFeedbackModal}
                activeLanguage={activeLanguage}
                changeLanguage={changeLanguage}
              />
            }
          >
            <SMIcon icon="info" aria-label={t('APP.ABOUT')} />
          </DropdownControl>
        </Map>
        <Logo />
        {this.state.aboutModalOpen ? (
          <AboutModal closeModal={this.closeAboutModal} t={t} />
        ) : null}
        {this.state.feedbackModalOpen ? (
          <FeedbackModal closeModal={this.closeFeedbackModal} />
        ) : null}
      </View>
    );
  }
}

MapView.contextTypes = {
  store: PropTypes.object.isRequired,
};

export default translate(null, { withRef: true })(MapView);

const InfoMenu = ({
  openAboutModal,
  openFeedbackModal,
  t,
  isMobile,
  activeLanguage,
  changeLanguage,
  store,
}) => (
  <TranslationProvider store={store}>
    <div className="info-menu">
      <InfoMenuItem icon="info" handleClick={openFeedbackModal} t={t}>
        {t('MAP.INFO_MENU.GIVE_FEEDBACK')}
      </InfoMenuItem>
      <InfoMenuItem icon="info" handleClick={openAboutModal}>
        {t('MAP.INFO_MENU.ABOUT_SERVICE')}
      </InfoMenuItem>
      <OutboundLink className="info-menu-item" href="http://osm.org/copyright">
        &copy; {t('MAP.ATTRIBUTION')}{' '}
      </OutboundLink>
      {isMobile && Object.keys(SUPPORTED_LANGUAGES).length > 1 && (
        <InfoMenuItem handleClick={() => null}>
          <strong>{t('MAP.INFO_MENU.CHOOSE_LANGUAGE')}</strong>
          <LanguageChanger
            style={{ position: 'static' }}
            activeLanguage={activeLanguage}
            changeLanguage={changeLanguage}
            isMobile={isMobile}
          />
        </InfoMenuItem>
      )}
    </div>
  </TranslationProvider>
);

const InfoMenuItem = ({ children, handleClick, icon }) => (
  <button type="button" className="info-menu-item" onClick={handleClick}>
    {icon ? (
      <SMIcon icon={icon} style={{ paddingRight: 2 }} aria-hidden="true" />
    ) : null}
    {children}
  </button>
);

const AboutModal = ({ closeModal, t }) => (
  <div className="about-modal-backdrop">
    <div className="about-modal-box">
      <div className="about-modal-controls">
        <SMIcon icon="close" onClick={() => closeModal()} />
      </div>
      <div
        className="about-modal-content"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: t('MAP.ABOUT') }}
      />
    </div>
  </div>
);
