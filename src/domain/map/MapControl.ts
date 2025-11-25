import { createControlComponent } from "@react-leaflet/core";
import L from "leaflet";
import { ReactElement } from "react";
import {createRoot} from "react-dom/client";

type Props = {
  handleClick: (e: Event) => void;
  className?: string;
  children: ReactElement;
  position?: L.ControlPosition;
};

const createMapControl = (props: Props) => {
  const { className, children, handleClick, position } = props;

  const control = new L.Control({
    position: position || "bottomright",
  });

  control.onAdd = () => {
    const div = L.DomUtil.create("div", `custom-control ${className}`);
    const link = L.DomUtil.create("button", "custom-control-button", div);

    L.DomEvent.on(link, "mousedown dblclick", L.DomEvent.stopPropagation)
      .on(link, "click", L.DomEvent.stop)
      .on(link, "click", (event: Event) => {
        L.DomEvent.stopPropagation(event);
        handleClick && handleClick(event);
      });

    // Render React element into the control
    const root = createRoot(link);
    root.render(children);

    return div;
  };

  return control;
};

const MapControl = createControlComponent(createMapControl);

export default MapControl;
