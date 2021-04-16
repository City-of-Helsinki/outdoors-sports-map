import { Component, ReactNode } from "react";
import { withTranslation } from "react-i18next";
import { Map, TileLayer, ZoomControl } from "react-leaflet";

import OutboundLink from "../../common/components/OutboundLink";
import TranslationProvider from "../../common/components/translation/TranslationProvider";
import { mobileBreakpoint } from "../../common/constants";
import { isRetina } from "../../common/helpers";
import OSMIcon from "../../home/components/OSMIcon";
import SMIcon from "../../home/components/SMIcon";
import Control from "../../map/components/Control";
import DropdownControl from "../../map/components/DropdownControl";
import UserLocationMarker from "../../map/components/UserLocationMarker";
import {
  BOUNDARIES,
  DEFAULT_ZOOM,
  MapRef,
  MAP_RETINA_URL,
  MAP_URL,
  MAX_ZOOM,
  MIN_ZOOM,
} from "../../map/constants";
import latLngToArray from "../../map/helpers";
import { Unit } from "../constants";
import FeedbackModal from "./FeedbackModal";
import UnitsOnMap from "./UnitsOnMap";
import { View } from "./View";

type Props = {
  selectedUnit: Unit;
  onCenterMapToUnit: (unit: Unit) => void;
  activeLanguage: string;
  openUnit: (unitId: string) => void;
  t: (arg0: string) => string;
  setLocation: (coordinates: number[]) => void;
  position: [number, number];
  units: Unit[];
  mapRef: MapRef;
};

type State = {
  isMobile: boolean;
  menuOpen: boolean;
  aboutModalOpen: boolean;
  feedbackModalOpen: boolean;
  zoomLevel: number;
};

class MapView extends Component<Props, State> {
  constructor(props: Props) {
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
    window.addEventListener("resize", this.updateIsMobile);
  }

  componentDidUpdate(prevProps: Props) {
    const { selectedUnit, onCenterMapToUnit } = this.props;

    if (
      selectedUnit &&
      (!prevProps.selectedUnit || selectedUnit.id !== prevProps.selectedUnit.id)
    ) {
      onCenterMapToUnit(selectedUnit);
    }
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateIsMobile);
  }

  get leafletElement() {
    const { mapRef } = this.props;

    return mapRef?.current?.leafletElement;
  }

  handleZoom = () => {
    this.setState({
      zoomLevel: this.leafletElement?.getZoom() || DEFAULT_ZOOM,
    });
  };

  updateIsMobile = () => {
    this.setState({
      isMobile: window.innerWidth < mobileBreakpoint,
    });
  };

  locateUser = () => {
    this.leafletElement?.locate({
      setView: true,
    });
  };

  handleClick = (event: Record<string, any>) => {
    // Click events from info menu and language changer hit this. Don't
    // do anything for those events.
    if (event.originalEvent.target.className.includes("leaflet")) {
      this.setLocation(event);
    }
  };

  setLocation = (event: Record<string, any>) => {
    const { setLocation } = this.props;

    setLocation((latLngToArray(event.latlng) as any) as [number, number]);
  };

  toggleMenu = () => {
    const { menuOpen } = this.state;

    if (menuOpen) {
      this.setState({
        menuOpen: false,
      });
    } else {
      this.setState({
        menuOpen: true,
      });
    }
  };

  setView = (coordinates: [number, number]) => {
    this.leafletElement?.setView(coordinates);
  };

  openAboutModal = () => {
    this.setState({
      aboutModalOpen: true,
    });
  };

  closeAboutModal = () => {
    this.setState({
      aboutModalOpen: false,
    });
  };

  openFeedbackModal = () => {
    this.setState({
      feedbackModalOpen: true,
    });
  };

  closeFeedbackModal = () => {
    this.setState({
      feedbackModalOpen: false,
    });
  };

  render() {
    const {
      position,
      selectedUnit,
      units,
      activeLanguage,
      openUnit,
      t,
      mapRef,
    } = this.props;

    const {
      isMobile,
      zoomLevel,
      menuOpen,
      aboutModalOpen,
      feedbackModalOpen,
    } = this.state;

    return (
      <View id="map-view" className="map-view">
        <Map
          ref={mapRef}
          zoomControl={false}
          attributionControl={false}
          center={position}
          maxBounds={BOUNDARIES}
          zoom={DEFAULT_ZOOM}
          minZoom={MIN_ZOOM}
          maxZoom={MAX_ZOOM}
          onclick={this.handleClick}
          onlocationfound={this.setLocation}
          onzoomend={this.handleZoom}
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
            position={isMobile ? "bottomleft" : "topright"}
            aria-haspopup="true"
            aria-expanded={menuOpen}
            activeLanguage={activeLanguage}
            isOpen={menuOpen}
            options={
              <InfoMenu
                t={t}
                openAboutModal={this.openAboutModal}
                openFeedbackModal={this.openFeedbackModal}
              />
            }
            wrapperAttrs={{
              role: "contentinfo",
            }}
          >
            <SMIcon icon="info" aria-label={t("APP.ABOUT")} />
          </DropdownControl>
        </Map>
        {aboutModalOpen ? (
          <AboutModal closeModal={this.closeAboutModal} t={t} />
        ) : null}
        {feedbackModalOpen ? (
          <FeedbackModal closeModal={this.closeFeedbackModal} />
        ) : null}
      </View>
    );
  }
}

export default withTranslation(undefined, {
  withRef: true,
})(MapView);

type InfoMenuProps = {
  openAboutModal: () => void;
  openFeedbackModal: () => void;
  t: (arg0: string) => string;
};

function InfoMenu({ openAboutModal, openFeedbackModal, t }: InfoMenuProps) {
  return (
    <TranslationProvider>
      <div className="info-menu">
        <InfoMenuItem icon="info" handleClick={openFeedbackModal}>
          {t("MAP.INFO_MENU.GIVE_FEEDBACK")}
        </InfoMenuItem>
        <InfoMenuItem icon="info" handleClick={openAboutModal}>
          {t("MAP.INFO_MENU.ABOUT_SERVICE")}
        </InfoMenuItem>
        <OutboundLink
          className="info-menu-item"
          href="http://osm.org/copyright"
        >
          {`\u00a9 ${t("MAP.ATTRIBUTION")} `}
        </OutboundLink>
      </div>
    </TranslationProvider>
  );
}

type InfoMenuItemProps = {
  children: ReactNode;
  handleClick: () => void;
  icon?: string;
};

function InfoMenuItem({ children, handleClick, icon }: InfoMenuItemProps) {
  return (
    <button type="button" className="info-menu-item" onClick={handleClick}>
      {icon ? (
        <SMIcon
          icon={icon}
          style={{
            paddingRight: 2,
          }}
          aria-hidden="true"
        />
      ) : null}
      {children}
    </button>
  );
}

type AboutModalProps = {
  closeModal: () => void;
  t: (arg0: string) => string;
};

function AboutModal({ closeModal, t }: AboutModalProps) {
  return (
    <div className="about-modal-backdrop">
      <div className="about-modal-box">
        <div className="about-modal-controls">
          <SMIcon icon="close" onClick={() => closeModal()} />
        </div>
        <div
          className="about-modal-content" // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: t("MAP.ABOUT"),
          }}
        />
      </div>
    </div>
  );
}
