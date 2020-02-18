/*
   eslint-disable
   max-classes-per-file,
   jsx-a11y/anchor-is-valid,
   jsx-a11y/click-events-have-key-events,
   jsx-a11y/no-static-element-interactions,
   react/destructuring-assignment,
   react/prop-types,
   react/require-default-props,
*/

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { withNamespaces } from 'react-i18next';
import { Link } from 'react-router';
import isEqual from 'lodash/isEqual';
import values from 'lodash/values';

import SMIcon from '../../home/components/SMIcon';
import * as unitHelpers from '../helpers';
import { SortKeys, UNIT_BATCH_SIZE } from '../constants';
import { View } from './View';
import Loading from '../../home/components/Loading';
import ObservationStatus from './ObservationStatus';
import SortSelectorDropdown from './SortSelectorDropdown';
import UnitIcon from './UnitIcon';

class UnitListItem extends Component {
  shouldComponentUpdate({ unit }) {
    return JSON.stringify(this.props.unit) !== JSON.stringify(unit);
  }

  render() {
    const { unit, handleClick } = this.props;
    const { context } = this;

    return (
      <Link
        to={`/unit/${unit.id}`}
        onClick={(e) => {
          e.preventDefault();
          handleClick();
        }}
        className="list-view-item"
      >
        <div className="list-view-item__unit-marker">
          <UnitIcon unit={unit} />
        </div>
        <div className="list-view-item__unit-details">
          <div className="list-view-item__unit-name">
            {unitHelpers.getAttr(unit.name, context.getActiveLanguage())}
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

UnitListItem.contextTypes = {
  getActiveLanguage: PropTypes.func,
};

export class ListViewBase extends Component {
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

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (
      !isEqual(nextProps.units, this.props.units) ||
      !isEqual(nextProps.activeFilter, this.props.activeFilter)
    ) {
      this.resetUnitCount();
    }
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.isVisible;
  }

  sortUnits(props, sortKey) {
    let sortedUnits = [];
    switch (sortKey) {
      case SortKeys.ALPHABETICAL:
        sortedUnits = unitHelpers.sortByName(
          props.units,
          this.context.getActiveLanguage()
        );
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
  }

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
    const { services, openUnit, isLoading, t } = this.props;
    const { sortKey, maxUnitCount } = this.state;
    const totalUnits = this.props.units.length;
    const units = isLoading
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
            {units &&
              units.map((unit) => (
                <UnitListItem
                  unit={unit}
                  services={services}
                  key={unit.id}
                  handleClick={() => openUnit(unit.id)}
                />
              ))}
            {units.length !== totalUnits && (
              <a
                style={{
                  display: 'block',
                  textAlign: 'center',
                  cursor: 'pointer',
                  margin: '18px auto 10px',
                }}
                href
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

ListViewBase.propTypes = {
  units: PropTypes.arrayOf(PropTypes.object).isRequired,
  services: PropTypes.objectOf(PropTypes.object).isRequired,
};

ListViewBase.contextTypes = {
  getActiveLanguage: PropTypes.func,
};

export default withNamespaces()(ListView);
