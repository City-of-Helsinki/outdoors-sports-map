// eslint-disable-next-line max-classes-per-file
import L from "leaflet";
import isEqual from "lodash/isEqual";
import values from "lodash/values";
import { Component } from "react";
import { withTranslation, WithTranslation } from "react-i18next";
import { withRouter, RouteComponentProps } from "react-router-dom";

import Link from "../../common/components/Link";
import Loading from "../../home/components/Loading";
import SMIcon from "../../home/components/SMIcon";
import { SortKeys, Unit, UNIT_BATCH_SIZE } from "../constants";
import * as unitHelpers from "../helpers";
import ObservationStatus from "./ObservationStatus";
import SortSelectorDropdown from "./SortSelectorDropdown";
import UnitIcon from "./UnitIcon";
import { View } from "./View";

type UnitListItemProps = {
  unit: Unit;
  activeLanguage: string;
  locationSearch: string;
};

class UnitListItem extends Component<UnitListItemProps> {
  shouldComponentUpdate({ unit }: UnitListItemProps) {
    const { unit: currentUnit } = this.props;

    return JSON.stringify(currentUnit) !== JSON.stringify(unit);
  }

  render() {
    const { unit, activeLanguage, locationSearch } = this.props;

    return (
      <Link
        to={{
          pathname: `/unit/${unit.id}`,
          state: {
            search: locationSearch,
          },
        }}
        className="list-view-item"
      >
        <div className="list-view-item__unit-marker">
          <UnitIcon unit={unit} />
        </div>
        <div className="list-view-item__unit-details">
          <div className="list-view-item__unit-name">
            {unitHelpers.getAttr(unit.name, activeLanguage)}
          </div>
          <ObservationStatus unit={unit} />
        </div>
        <div className="list-view-item__unit-open">
          <SMIcon icon="forward" />
        </div>
      </Link>
    );
  }
}

type Props = WithTranslation &
  RouteComponentProps & {
    units: Unit[];
    isVisible: boolean;
    activeFilter: string;
    isLoading: boolean;
    position: [number, number];
    leafletMap: L.Map;
  };

type State = {
  sortKey: string;
  maxUnitCount: number;
};

export class ListViewBase extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      sortKey: SortKeys.DISTANCE,
      maxUnitCount: UNIT_BATCH_SIZE,
    };
    this.selectSortKey = this.selectSortKey.bind(this);
    this.loadMoreUnits = this.loadMoreUnits.bind(this);
    this.handleLoadMoreClick = this.handleLoadMoreClick.bind(this);
  }

  shouldComponentUpdate(nextProps: Props) {
    return nextProps.isVisible;
  }

  componentDidUpdate(prevProps: Props) {
    const { activeFilter, units } = this.props;

    if (
      !isEqual(prevProps.units, units) ||
      !isEqual(prevProps.activeFilter, activeFilter)
    ) {
      this.resetUnitCount();
    }
  }

  sortUnits = (sortKey: string) => {
    const { units, position, leafletMap } = this.props;
    let sortedUnits = [];

    switch (sortKey) {
      case SortKeys.ALPHABETICAL:
        sortedUnits = unitHelpers.sortByName(units, "fi");
        break;

      case SortKeys.CONDITION:
        sortedUnits = unitHelpers.sortByCondition(units);
        break;

      case SortKeys.DISTANCE:
        sortedUnits = unitHelpers.sortByDistance(units, position, leafletMap);
        break;

      default:
        sortedUnits = units;
    }

    return sortedUnits;
  };

  /**
   * @param  {string} sortKey
   * @return {void}
   */
  selectSortKey(sortKey: string | null): void {
    if (sortKey) {
      this.setState({
        sortKey,
      });
      this.resetUnitCount();
    }
  }

  loadMoreUnits() {
    this.setState((prevState) => ({
      maxUnitCount: prevState.maxUnitCount + UNIT_BATCH_SIZE,
    }));
  }

  resetUnitCount() {
    this.setState({
      maxUnitCount: UNIT_BATCH_SIZE,
    });
  }

  handleLoadMoreClick(e: React.SyntheticEvent<HTMLAnchorElement>) {
    e.preventDefault();
    this.loadMoreUnits();
  }

  render() {
    const { isLoading, t, i18n, units, location } = this.props;
    const { sortKey, maxUnitCount } = this.state;
    const totalUnits = units.length;

    const renderedUnits = isLoading
      ? []
      : this.sortUnits(sortKey).slice(0, maxUnitCount);

    return (
      <View id="list-view" className="list-view">
        <div className="list-view__container">
          <div className="list-view__block">
            <SortSelectorDropdown
              values={values(SortKeys)}
              active={sortKey}
              onSelect={this.selectSortKey}
            />
          </div>
          <div className="list-view__block">
            {isLoading && <Loading />}
            {renderedUnits &&
              renderedUnits.map((unit) => (
                <UnitListItem
                  unit={unit}
                  key={unit.id}
                  activeLanguage={i18n.languages[0]}
                  locationSearch={location.search}
                />
              ))}
            {renderedUnits.length !== totalUnits && ( // eslint-disable-next-line jsx-a11y/anchor-is-valid
              <a
                style={{
                  display: "block",
                  textAlign: "center",
                  cursor: "pointer",
                  margin: "18px auto 10px",
                }}
                href=""
                onClick={this.handleLoadMoreClick}
              >
                {t("UNIT.SHOW_MORE")}
              </a>
            )}
          </div>
        </div>
      </View>
    );
  }
}

export default withTranslation()(withRouter(ListViewBase));
