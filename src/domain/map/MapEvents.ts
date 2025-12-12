import { useMapEvents } from "react-leaflet";

type MapEventsProps = {
  handleMapClick: (event: Record<string, any>) => void;
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
