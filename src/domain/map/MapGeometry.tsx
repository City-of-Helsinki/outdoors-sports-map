import { GeoJSON } from "react-leaflet";

type Props = {
  id: string;
  geometry: GeoJSON.GeoJsonObject | GeoJSON.GeoJsonObject[];
  isSelected: boolean;
  quality: string;
  handleClick: (e: L.LeafletMouseEvent) => void;
};

function MapGeometry({ id, geometry, isSelected, quality, handleClick, ...rest }: Props) {
  return (
    <div className="unit-geometry">
      {
        // highlight background for selected unit
        isSelected && (
          <GeoJSON
            key={`${id}_hilight`}
            style={{
              "className": `unit-geometry__hilight`,
            }}
            data={geometry as GeoJSON.GeoJsonObject}
            {...rest}
          />
        )
      }
      <GeoJSON // Click area
        key={`${id}_click-area`}
        style={{
          "className": `unit-geometry__click-area`,
        }}
        data={geometry as GeoJSON.GeoJsonObject}
        eventHandlers={{
          click: handleClick,
        }}
        {...rest}
      />
      <GeoJSON // actual track
        key={id}
        style={{
          "className": `unit-geometry__track--${quality}`,
        }}
        data={geometry as GeoJSON.GeoJsonObject}
        {...rest}
      />
    </div>
  );
}

export default MapGeometry;
