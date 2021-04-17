import L from "leaflet";
import { ReactElement } from "react";
import ReactDOM from "react-dom";
import {
  MapControl as RLMapControl,
  withLeaflet,
  MapControlProps,
} from "react-leaflet";

type Props = MapControlProps & {
  handleClick: (e: Event) => void;
  className?: string;
  children: ReactElement;
};

class MapControl extends RLMapControl<Props> {
  // note we're extending MapControl from react-leaflet, not Component from react
  constructor(props: Props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(event: Event) {
    L.DomEvent.stopPropagation(event);

    this.props.handleClick && this.props.handleClick(event);
  }

  createLeafletElement({ className, children }: Props) {
    const control = new L.Control({
      position: this.props.position || "bottomright",
    });

    control.onAdd = () => {
      const div = L.DomUtil.create("div", `custom-control ${className}`);
      const link = L.DomUtil.create("button", "custom-control-button", div);

      L.DomEvent.on(link, "mousedown dblclick", L.DomEvent.stopPropagation)
        .on(link, "click", L.DomEvent.stop)
        .on(link, "click", this.handleClick, control);

      ReactDOM.render(children, link);

      return div;
    };

    return control;
  }
}

export default withLeaflet(MapControl);
