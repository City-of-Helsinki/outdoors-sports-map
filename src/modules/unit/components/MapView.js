// @flow

/*
   eslint-disable
   jsx-a11y/anchor-is-valid,
   jsx-a11y/click-events-have-key-events,
   jsx-a11y/no-static-element-interactions,
   react/destructuring-assignment,
   react/no-string-refs,
   react/prop-types,
   react/require-default-props,
*/

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Map, TileLayer, ZoomControl } from 'react-leaflet';
import { withNamespaces } from 'react-i18next';
import SMIcon from '../../home/components/SMIcon';
import OSMIcon from '../../home/components/OSMIcon';
import FeedbackModal from './FeedbackModal';
import { View } from './View';
import Logo from '../../home/components/Logo';
import Control from '../../map/components/Control';
import { mobileBreakpoint } from '../../common/constants';
import { SUPPORTED_LANGUAGES } from '../../language/constants';
import {
  MAP_URL, MAP_RETINA_URL, DEFAULT_ZOOM, MIN_ZOOM, MAX_ZOOM, BOUNDARIES,
} from '../../map/constants';
import latLngToArray from '../../map/helpers';
import { getUnitPosition } from '../helpers';
import UnitsOnMap from './UnitsOnMap';
import UserLocationMarker from '../../map/components/UserLocationMarker';
import { isRetina } from '../../common/helpers';

class MapView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isMobile: window.innerWidth < mobileBreakpoint,
      menuOpen: false,
      aboutModalOpen: false,
      feedbackModalOpen: false,
      zoomLevel: DEFAULT_ZOOM,
    };
  }

  componentDidMount() {
    window.addEventListener('resize', this.updateIsMobile);
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps(nextProps) {
    const { selectedUnit } = this.props;
    if (nextProps.selectedUnit
      && (!selectedUnit || selectedUnit.id !== nextProps.selectedUnit.id)) {
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
  }

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
  }

  closeAboutModal = () => {
    this.setState({ aboutModalOpen: false });
  }

  openFeedbackModal = () => {
    this.setState({ feedbackModalOpen: true });
  }

  closeFeedbackModal = () => {
    this.setState({ feedbackModalOpen: false });
  }

  render() {
    const {
      position, selectedUnit, units, selected, activeLanguage, openUnit, changeLanguage, t,
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
          <UnitsOnMap units={units} zoomLevel={zoomLevel} selectedUnit={selectedUnit} openUnit={openUnit} />
          <ZoomControl position="bottomright" />
          <Control handleClick={this.locateUser} className="leaflet-control-locate" position="bottomright">
            <OSMIcon icon="locate" />
          </Control>
          {Object.keys(SUPPORTED_LANGUAGES).length > 1 && !isMobile && <LanguageChanger activeLanguage={activeLanguage} changeLanguage={changeLanguage} />}
          {menuOpen ? <InfoMenu t={t} isMobile={isMobile} openAboutModal={this.openAboutModal} openFeedbackModal={this.openFeedbackModal} activeLanguage={activeLanguage} changeLanguage={changeLanguage} /> : null}
          <Control handleClick={this.toggleMenu} className="leaflet-control-info" position={isMobile ? 'bottomleft' : 'topright'}>
            <SMIcon icon="info" />
          </Control>
        </Map>
        <Logo />
        {this.state.aboutModalOpen ? <AboutModal closeModal={this.closeAboutModal} t={t} /> : null}
        {this.state.feedbackModalOpen ? <FeedbackModal closeModal={this.closeFeedbackModal} /> : null}
      </View>
    );
  }
}

MapView.propTypes = {
  position: PropTypes.arrayOf(PropTypes.number).isRequired,
  units: PropTypes.arrayOf(PropTypes.object),
};

export default withNamespaces(null, {
  innerRef: (ref) => {
    if (ref && ref.props.mapRef) ref.props.mapRef(ref);
  },
})(MapView);

const LanguageChanger = ({ changeLanguage, activeLanguage, isMobile }) => (
  <div className={isMobile ? 'language-changer__mobile' : 'language-changer'}>
    {Object.keys(SUPPORTED_LANGUAGES).filter((language) => SUPPORTED_LANGUAGES[language] !== activeLanguage).map((languageKey, index) => (
      <div key={languageKey} style={{ display: 'flex' }}>
        <a onClick={() => changeLanguage(SUPPORTED_LANGUAGES[languageKey])}>
          {languageKey}
        </a>
        {index < Object.keys(SUPPORTED_LANGUAGES).length - 2 && !isMobile
          ? <div style={{ marginLeft: 2, marginRight: 2 }}>|</div>
          : null}
      </div>
    ))}
  </div>
);

const InfoMenu = ({
  openAboutModal, openFeedbackModal, t, isMobile, activeLanguage, changeLanguage,
}) => (
  <div className="info-menu">
    <InfoMenuItem icon="info" handleClick={openFeedbackModal} t={t}>
      {t('MAP.INFO_MENU.GIVE_FEEDBACK')}
    </InfoMenuItem>
    <InfoMenuItem icon="info" handleClick={openAboutModal}>
      {t('MAP.INFO_MENU.ABOUT_SERVICE')}
    </InfoMenuItem>
    <InfoMenuItem handleClick={() => null}>
      <a target="_blank" href="http://osm.org/copyright" rel="noopener noreferrer" style={{ padding: 1 }}>
&copy;
        {t('MAP.ATTRIBUTION')}
        {' '}

      </a>
    </InfoMenuItem>
    { isMobile && Object.keys(SUPPORTED_LANGUAGES).length > 1
      && (
      <InfoMenuItem handleClick={() => null}>
        <strong>{t('MAP.INFO_MENU.CHOOSE_LANGUAGE')}</strong>
        <LanguageChanger style={{ position: 'static' }} activeLanguage={activeLanguage} changeLanguage={changeLanguage} isMobile={isMobile} />
      </InfoMenuItem>
      )}
  </div>
);

const InfoMenuItem = ({ children, handleClick, icon }) => (
  <div className="info-menu-item" onClick={handleClick}>
    {icon ? <SMIcon icon={icon} style={{ paddingRight: 2 }} /> : null}
    {children}
  </div>
);

const AboutModal = ({ closeModal, t }) => (
  <div className="about-modal-backdrop">
    <div className="about-modal-box">
      <div className="about-modal-controls">
        <SMIcon icon="close" onClick={() => closeModal()} />
      </div>
      {/* eslint-disable-next-line react/no-danger */}
      <div className="about-modal-content" dangerouslySetInnerHTML={{ __html: t('MAP.ABOUT') }} />
    </div>
  </div>
);
