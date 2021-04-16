import L from "leaflet";
import values from "lodash/values";
import { Component } from "react";
import { useTranslation, withTranslation } from "react-i18next";
import { withRouter, RouteComponentProps } from "react-router-dom";

import addressBarMarker from "../../../assets/markers/location.svg";
import { Address } from "../../common/constants";
import SMIcon from "../../home/components/SMIcon";
import SearchContainer from "../../search/components/SearchContainer";
import { StatusFilters, Unit } from "../constants";
import {
  getAddressToDisplay,
  getDefaultSportFilter,
  getDefaultStatusFilter,
  getOffSeasonSportFilters,
  getOnSeasonSportFilters,
} from "../helpers";
import ListView from "./ListView";
import UnitFilters from "./UnitFilters";

type ActionButtonProps = {
  action: () => void;
  icon: string;
  isActive: boolean;
  name: string;
};

function ActionButton({ action, icon, isActive, name }: ActionButtonProps) {
  return (
    <button
      className="action-button"
      aria-pressed={isActive}
      onClick={action}
      type="button"
    >
      <SMIcon className="unit-browser__action" icon={icon} aria-label={name} />
    </button>
  );
}

type HeaderProps = {
  collapse: () => void;
  expand: () => void;
  isExpanded: boolean;
  onViewChange: (coordinates: [number, number]) => void;
};

function Header({ expand, collapse, onViewChange, isExpanded }: HeaderProps) {
  const { t } = useTranslation();

  return (
    <div className="header">
      <SearchContainer onSearch={expand} onViewChange={onViewChange} />
      <div className="action-buttons">
        <ActionButton
          action={collapse}
          icon="map-options"
          isActive={!isExpanded}
          name={t("UNIT.MAP_BUTTON")}
        />
        <ActionButton
          action={expand}
          icon="browse"
          isActive={isExpanded}
          name={t("UNIT.LIST_BUTTON")}
        />
      </div>
    </div>
  );
}

type AddressBarProps = {
  address: Address;
  handleClick: (coordinates: [number, number]) => void;
};

function AddressBar({ address, handleClick }: AddressBarProps) {
  const {
    i18n: {
      languages: [language],
    },
  } = useTranslation();

  return (
    <button
      type="button"
      className="address-bar__container"
      onClick={() => {
        const [lat, long] = address.location.coordinates;

        handleClick([lat, long]);
      }}
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
}

type Props = RouteComponentProps & {
  address: Address | undefined | null;
  isLoading: boolean;
  isSearching: boolean;
  leafletMap: L.Map | null | undefined;
  location: Record<string, any>;
  params: Record<string, any>;
  position: [number, number];
  history: Record<string, any>;
  singleUnitSelected: boolean;
  t: (arg0: string) => string;
  units: Unit[];
  onViewChange: (coordinates: [number, number]) => void;
  expandedState: [boolean, (value: boolean) => void];
};

type State = {
  contentMaxHeight: number | undefined;
};

class UnitBrowser extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      contentMaxHeight: undefined,
    };
  }

  componentDidMount() {
    window.addEventListener("resize", this.updateContentMaxHeight);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateContentMaxHeight);
  }

  updateContentMaxHeight = () => {
    this.setState({
      contentMaxHeight: this.calculateMaxHeight(),
    });
  };

  calculateMaxHeight = () => {
    const element = document.getElementById("always-visible");

    if (element) {
      const fixedPartHeight = element.offsetHeight;

      return window.innerHeight - fixedPartHeight;
    }

    return window.innerHeight;
  };

  updateQueryParameter = (key: string, value: string): void => {
    const {
      history,
      location: { search },
    } = this.props;

    const searchParams = new URLSearchParams(search);

    searchParams.set(key, value);
    history.replace({
      search: searchParams.toString(),
    });
  };

  toggleStatusFilter = (filter: string): void => {
    this.updateQueryParameter("status", filter);
  };

  toggleSportFilter = (sport: string): void => {
    this.updateQueryParameter("sport", sport);
  };

  collapse = () => {
    const {
      expandedState: [, setIsExpanded],
    } = this.props;

    setIsExpanded(false);
  };

  expand = () => {
    const {
      expandedState: [, setIsExpanded],
    } = this.props;

    setIsExpanded(true);
  };

  render() {
    const {
      t,
      units,
      isLoading,
      isSearching,
      position,
      onViewChange,
      address,
      params,
      leafletMap,
      singleUnitSelected,
      location: { search },
      expandedState: [isExpanded],
    } = this.props;

    const { contentMaxHeight } = this.state;
    const searchParams = new URLSearchParams(search);

    const currentSportFilter =
      searchParams.get("sport") || getDefaultSportFilter();

    const currentStatusFilter =
      searchParams.get("status") || getDefaultStatusFilter();

    return (
      <div
        className={`unit-browser ${isExpanded ? "expanded" : ""}`}
        style={
          params.unitId
            ? {
                display: "none",
              }
            : undefined
        }
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
                  name: "sport",
                  active: currentSportFilter,
                  options: getOnSeasonSportFilters(),
                  secondaryOptions: getOffSeasonSportFilters(),
                },
                {
                  name: "status",
                  active: currentStatusFilter,
                  options: values(StatusFilters),
                },
              ]}
              updateFilter={this.updateQueryParameter}
            />
          )}
          {!isLoading && address && Object.keys(address).length !== 0 && (
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
          {leafletMap && (
            <ListView
              activeFilter={`${currentSportFilter};${currentStatusFilter}`}
              isVisible={isExpanded && !singleUnitSelected}
              isLoading={isLoading || isSearching}
              units={units}
              position={position}
              leafletMap={leafletMap}
            />
          )}
        </div>
        {t("UNIT.TMP_MESSAGE").length > 0 && (
          <div
            className="unit-browser__tmp_msg" // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{
              __html: t("UNIT.TMP_MESSAGE"),
            }}
          />
        )}
      </div>
    );
  }
}

export default withRouter(withTranslation()(UnitBrowser));
