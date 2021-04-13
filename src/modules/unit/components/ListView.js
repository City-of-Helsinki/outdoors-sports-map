// @flow

// eslint-disable-next-line max-classes-per-file
import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import isEqual from 'lodash/isEqual';
import values from 'lodash/values';

import SMIcon from '../../home/components/SMIcon';
import Loading from '../../home/components/Loading';
import * as unitHelpers from '../helpers';
import { SortKeys, UNIT_BATCH_SIZE } from '../constants';
import ObservationStatus from './ObservationStatus';
import SortSelectorDropdown from './SortSelectorDropdown';
import { View } from './View';
import UnitIcon from './UnitIcon';

type UnitListItemProps = {
  unit: object,
  activeLanguage: string,
};

class UnitListItem extends Component<UnitListItemProps> {
  shouldComponentUpdate({ unit }) {
    const { unit: currentUnit } = this.props;

    return JSON.stringify(currentUnit) !== JSON.stringify(unit);
  }

  render() {
    const { unit, activeLanguage } = this.props;

    return (
      <Link to={`/unit/${unit.id}`} className="list-view-item">
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

type Props = {
  units: object[],
  services: object,
  isVisible: boolean,
  activeFilter: string,
  isLoading: boolean,
  t: (string) => string,
  i18n: {
    languages: string[],
  },
};

export class ListViewBase extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      sortKey: SortKeys.DISTANCE,
      maxUnitCount: UNIT_BATCH_SIZE,
    };

    this.selectSortKey = this.selectSortKey.bind(this);
    this.loadMoreUnits = this.loadMoreUnits.bind(this);
    this.handleLoadMoreClick = this.handleLoadMoreClick.bind(this);
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.isVisible;
  }

  componentDidUpdate(prevProps) {
    const { activeFilter, units } = this.props;

    if (
      !isEqual(prevProps.units, units) ||
      !isEqual(prevProps.activeFilter, activeFilter)
    ) {
      this.resetUnitCount();
    }
  }

  sortUnits = (props, sortKey) => {
    let sortedUnits = [];
    switch (sortKey) {
      case SortKeys.ALPHABETICAL:
        sortedUnits = unitHelpers.sortByName(props.units, 'fi');
        break;
      case SortKeys.CONDITION:
        sortedUnits = unitHelpers.sortByCondition(props.units);
        break;
      case SortKeys.DISTANCE:
        sortedUnits = unitHelpers.sortByDistance(
          props.units,
          props.position,
          props.leafletMap,
          props.filter
        );
        break;

      default:
        sortedUnits = props.units;
    }

    return sortedUnits;
  };

  /**
   * @param  {string} sortKey
   * @return {void}
   */
  selectSortKey(sortKey) {
    this.setState({ sortKey });
    this.resetUnitCount();
  }

  loadMoreUnits() {
    this.setState((prevState) => ({
      maxUnitCount: prevState.maxUnitCount + UNIT_BATCH_SIZE,
    }));
  }

  resetUnitCount() {
    this.setState({ maxUnitCount: UNIT_BATCH_SIZE });
  }

  handleLoadMoreClick(e) {
    e.preventDefault();
    this.loadMoreUnits();
  }

  render() {
    const { services, isLoading, t, i18n, units } = this.props;
    const { sortKey, maxUnitCount } = this.state;
    const totalUnits = units.length;
    const renderedUnits = isLoading
      ? []
      : this.sortUnits(this.props, sortKey).slice(0, maxUnitCount);

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
                  services={services}
                  key={unit.id}
                  activeLanguage={i18n.languages[0]}
                />
              ))}
            {renderedUnits.length !== totalUnits && (
              // eslint-disable-next-line jsx-a11y/anchor-is-valid
              <a
                style={{
                  display: 'block',
                  textAlign: 'center',
                  cursor: 'pointer',
                  margin: '18px auto 10px',
                }}
                href=""
                onClick={this.handleLoadMoreClick}
              >
                {t('UNIT.SHOW_MORE')}
              </a>
            )}
          </div>
        </div>
      </View>
    );
  }
}

export default withTranslation()(ListViewBase);
