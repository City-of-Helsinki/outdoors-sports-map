import { useMapEvents } from "react-leaflet";

type MapEventsProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleMapClick: (event: Record<string, any>) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setLocation: (event: Record<string, any>) => void;
};

function MapEvents(props: MapEventsProps) {
  const { handleMapClick, setLocation } = props;
  useMapEvents({
    click: (e) => {
      handleMapClick(e);
    },
    locationfound: (location) => {
      setLocation(location);
    },
  });
  return null;
}

export default MapEvents;
