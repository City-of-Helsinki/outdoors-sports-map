import {
  LeafletContextInterface,
  createControlHook,
  createElementHook,
  createElementObject,
  createLeafComponent,
} from "@react-leaflet/core";
import L from "leaflet";
import { ReactElement } from "react";
import { Root, createRoot } from "react-dom/client";

type Props = {
  handleClick: (e: Event) => void;
  className?: string;
  children: ReactElement;
  position?: L.ControlPosition;
};

type ControlWithRoot = L.Control & { _reactRoot?: Root };

const createElement = (props: Props, context: LeafletContextInterface) => {
  const { className, children, handleClick, position } = props;

  const control: ControlWithRoot = new L.Control({
    position: position || "bottomright",
  });

  control.onAdd = () => {
    const div = L.DomUtil.create("div", `custom-control ${className}`);
    const link = L.DomUtil.create("button", "custom-control-button", div);

    L.DomEvent.on(link, "mousedown dblclick", L.DomEvent.stopPropagation)
      .on(link, "click", L.DomEvent.stop)
      .on(link, "click", (event: Event) => {
        L.DomEvent.stopPropagation(event);
        handleClick?.(event);
      });

    // Render React element into the control and store root for updates
    const root = createRoot(link);
    root.render(children);
    control._reactRoot = root;

    return div;
  };

  return createElementObject(control, context);
};

// Re-render children into the existing button when props change (e.g. on language switch)
const updateElement = (instance: ControlWithRoot, props: Props) => {
  instance._reactRoot?.render(props.children);
};

const useElement = createElementHook<ControlWithRoot, Props>(createElement, updateElement);
const useControl = createControlHook(useElement);
const MapControl = createLeafComponent(useControl);

export default MapControl;
