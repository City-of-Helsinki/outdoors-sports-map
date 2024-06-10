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
            className={`unit-geometry__hilight ${
              isSelected ? "unit-geometry__hilight--show" : ""
            }`}
            key={`${id}_hilight`}
            opacity={isSelected ? 1 : 0}
            data={geometry}
            {...rest}
          />
        )
      }
      <GeoJSON // Click area
        className="unit-geometry__click-area"
        key={`${id}_click-area`}
        data={geometry}
        onClick={handleClick}
        {...rest}
      />
      <GeoJSON // actual track
        className={`unit-geometry__track unit-geometry__track--${quality}`}
        key={id}
        data={geometry}
        {...rest}
      />
    </div>
  );
}

export default MapGeometry;
