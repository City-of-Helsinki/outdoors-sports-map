// @flow

import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Marker } from 'react-leaflet';

import { setLocation as setLocationActionFactory } from '../actions';
import { getLocation } from '../selectors';
import latLngToArray from '../helpers';
import AriaHiddenIcon from '../AriaHiddenIcon';

const iconUrl = require('@assets/markers/location.png');
const iconRetinaUrl = require('@assets/markers/location@2x.png');

type Props = {
  setLocation: (coordinates: [Number, number]) => void,
};

const createIcon = () =>
  new AriaHiddenIcon({
    iconUrl,
    iconRetinaUrl,
    iconSize: [12, 23],
    iconAnchor: [6, 23],
  });

class UserLocationMarker extends Component<Props> {
  locationRef = React.createRef();

  constructor(props) {
    super(props);

    this.handleDragEnd = this.handleDragEnd.bind(this);
  }

  handleDragEnd() {
    const { setLocation } = this.props;

    setLocation(
      latLngToArray(this.locationRef.current.leafletElement.getLatLng())
    );
  }

  render() {
    return (
      <Marker
        ref={this.locationRef}
        icon={createIcon()}
        zIndexOffset={1000}
        draggable
        onDragEnd={this.handleDragEnd}
        {...this.props}
      />
    );
  }
}

const mapStateToProps = (state) => ({
  position: getLocation(state),
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators({ setLocation: setLocationActionFactory }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(UserLocationMarker);
