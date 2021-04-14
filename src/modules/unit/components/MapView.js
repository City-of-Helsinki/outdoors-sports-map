// @flow

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import type { Node } from 'react';
import { Map, TileLayer, ZoomControl } from 'react-leaflet';
import { withTranslation } from 'react-i18next';
import { ReactReduxContext } from 'react-redux';

import SMIcon from '../../home/components/SMIcon';
import OSMIcon from '../../home/components/OSMIcon';
import FeedbackModal from './FeedbackModal';
import { View } from './View';
import Control from '../../map/components/Control';
import DropdownControl from '../../map/components/DropdownControl';
import { mobileBreakpoint } from '../../common/constants';
import {
  MAP_URL,
  MAP_RETINA_URL,
  DEFAULT_ZOOM,
  MIN_ZOOM,
  MAX_ZOOM,
  BOUNDARIES,
} from '../../map/constants';
import latLngToArray from '../../map/helpers';
import UnitsOnMap from './UnitsOnMap';
import UserLocationMarker from '../../map/components/UserLocationMarker';
import { isRetina } from '../../common/helpers';
import OutboundLink from '../../common/components/OutboundLink';
import TranslationProvider from '../../common/components/translation/TranslationProvider';

type Props = {
  selectedUnit: Object,
  onCenterMapToUnit: (unit: Object) => void,
  selected: Object,
  activeLanguage: string,
  openUnit: (unitId: string) => void,
  t: (string) => string,
  setLocation: (coordinates: [number, number]) => void,
  position: [number, number],
  units: Object[],
};

type State = {
  isMobile: boolean,
  menuOpen: boolean,
  aboutModalOpen: boolean,
  feedbackModalOpen: boolean,
  zoomLevel: number,
};

class MapView extends Component<Props, State> {
  mapRef = null;

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

  componentDidUpdate(prevProps) {
    const { selectedUnit, onCenterMapToUnit } = this.props;
    if (
      selectedUnit &&
      (!prevProps.selectedUnit || selectedUnit.id !== prevProps.selectedUnit.id)
    ) {
      onCenterMapToUnit(selectedUnit);
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateIsMobile);
  }

  setMapRef = (ref) => {
    this.mapRef = ref;
  };

  handleZoom = () => {
    // $FlowIgnore
    this.setState({ zoomLevel: this.mapRef.leafletElement.getZoom() });
  };

  updateIsMobile = () => {
    this.setState({ isMobile: window.innerWidth < mobileBreakpoint });
  };

  locateUser = () => {
    // $FlowIgnore
    this.mapRef.leafletElement.locate({ setView: true });
  };

  handleClick = (event: Object) => {
    // Click events from info menu and language changer hit this. Don't
    // do anything for those events.
    if (event.originalEvent.target.className.includes('leaflet')) {
      this.setLocation(event);
    }
  };

  setLocation = (event: Object) => {
    const { setLocation } = this.props;

    setLocation(((latLngToArray(event.latlng): any): [number, number]));
  };

  toggleMenu = () => {
    const { menuOpen } = this.state;

    if (menuOpen) {
      this.setState({ menuOpen: false });
    } else {
      this.setState({ menuOpen: true });
    }
  };

  setView = (coordinates) => {
    // $FlowIgnore
    this.mapRef.leafletElement.setView(coordinates);
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
      t,
    } = this.props;
    const {
      isMobile,
      zoomLevel,
      menuOpen,
      aboutModalOpen,
      feedbackModalOpen,
    } = this.state;

    return (
      <ReactReduxContext.Consumer>
        {({ store }) => (
          <View id="map-view" className="map-view" isSelected={selected}>
            <Map
              ref={this.setMapRef}
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
                    store={store}
                    t={t}
                    openAboutModal={this.openAboutModal}
                    openFeedbackModal={this.openFeedbackModal}
                  />
                }
              >
                <SMIcon icon="info" aria-label={t('APP.ABOUT')} />
              </DropdownControl>
            </Map>
            {aboutModalOpen ? (
              <AboutModal closeModal={this.closeAboutModal} t={t} />
            ) : null}
            {feedbackModalOpen ? (
              <FeedbackModal closeModal={this.closeFeedbackModal} />
            ) : null}
          </View>
        )}
      </ReactReduxContext.Consumer>
    );
  }
}

MapView.propTypes = {
  position: PropTypes.arrayOf(PropTypes.number).isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  units: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default withTranslation(null, { withRef: true })(MapView);

type InfoMenuProps = {
  openAboutModal: () => void,
  openFeedbackModal: () => void,
  t: (string) => string,
  store: Object,
};

const InfoMenu = ({
  openAboutModal,
  openFeedbackModal,
  t,
  store,
}: InfoMenuProps) => (
  <TranslationProvider store={store}>
    <div className="info-menu">
      <InfoMenuItem icon="info" handleClick={openFeedbackModal} t={t}>
        {t('MAP.INFO_MENU.GIVE_FEEDBACK')}
      </InfoMenuItem>
      <InfoMenuItem icon="info" handleClick={openAboutModal}>
        {t('MAP.INFO_MENU.ABOUT_SERVICE')}
      </InfoMenuItem>
      <OutboundLink className="info-menu-item" href="http://osm.org/copyright">
        {`\u00a9 ${t('MAP.ATTRIBUTION')} `}
      </OutboundLink>
    </div>
  </TranslationProvider>
);

type InfoMenuItemProps = {
  children: Node,
  handleClick: () => void,
  icon?: string,
};

const InfoMenuItem = ({ children, handleClick, icon }: InfoMenuItemProps) => (
  <button type="button" className="info-menu-item" onClick={handleClick}>
    {icon ? (
      <SMIcon icon={icon} style={{ paddingRight: 2 }} aria-hidden="true" />
    ) : null}
    {children}
  </button>
);

type AboutModalProps = {
  closeModal: () => void,
  t: (string) => string,
};

const AboutModal = ({ closeModal, t }: AboutModalProps) => (
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
