import { LatLngTuple, Marker as LeafletMarker } from "leaflet";
import React, { Component } from "react";
import { Marker } from "react-leaflet";
import { connect } from "react-redux";
import { bindActionCreators, Dispatch } from "redux";

import AriaHiddenIcon from "./MapAriaHiddenIcon";
import latLngToArray from "./mapHelpers";
import { setLocation as setLocationActionFactory } from "./state/actions";
import { getLocation } from "./state/selectors";
import { AppState } from "../app/appConstants";
import iconUrl from "../assets/markers/location.png";
import iconRetinaUrl from "../assets/markers/location@2x.png";

type Props = {
  setLocation: (coordinates: number[]) => void;
  position: LatLngTuple;
};

const createIcon = () =>
  // @ts-ignore
  new AriaHiddenIcon({
    iconUrl,
    iconRetinaUrl,
    iconSize: [12, 23],
    iconAnchor: [6, 23],
  });

class MapUserLocationMarker extends Component<Props> {
  locationRef = React.createRef<LeafletMarker>();

  constructor(props: Props) {
    super(props);
    this.handleDragEnd = this.handleDragEnd.bind(this);
  }

  handleDragEnd() {
    const { setLocation } = this.props;
    const latLng = this.locationRef.current?.getLatLng();
    if (latLng) {
      const latLngArray = latLngToArray(latLng);
      setLocation(latLngArray);
    }
  }

  render() {
    return (
      <Marker
        ref={this.locationRef}
        icon={createIcon()}
        zIndexOffset={1000}
        draggable
        eventHandlers={{
          dragend: this.handleDragEnd,
        }}
        keyboard={false}
        {...this.props}
      />
    );
  }
}

const mapStateToProps = (state: AppState) => ({
  position: getLocation(state),
});

const mapDispatchToProps = (dispatch: Dispatch) =>
  bindActionCreators(
    {
      setLocation: setLocationActionFactory,
    },
    dispatch
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MapUserLocationMarker);
