import { LatLngTuple } from "leaflet";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";

import EmbedMap from "./EmbedMap";
import EmbedUnitPanel from "./EmbedUnitPanel";
import Loading from "../../common/components/Loading";
import useLanguage from "../../common/hooks/useLanguage";
import { DETAIL_ZOOM_IN, DEFAULT_ZOOM } from "../map/mapConstants";
import { useGetUnitByIdQuery, useGetUnitsQuery } from "../unit/state/unitSlice";
import { Unit } from "../unit/types";
import { SportServices } from "../unit/unitConstants";
import { getOffSeasonSportFilters } from "../unit/unitHelpers";
import "./_embedView.scss";

const HELSINKI_POSITION: LatLngTuple = [60.171944, 24.941389];

function getEmbedUnits(
  unitId: string | null,
  singleUnit: Unit | undefined,
  services: number[] | undefined,
  rawUnits: Unit[],
): Unit[] {
  if (unitId) {
    return singleUnit ? [singleUnit] : [];
  }
  if (services) {
    return rawUnits.filter((unit) =>
      unit.services?.some((service) => services.includes(service)),
    );
  }
  return rawUnits;
}

function getEmbedPosition(units: Unit[]): LatLngTuple {
  if (units.length !== 1 || !units[0].location?.coordinates) {
    return HELSINKI_POSITION;
  }
  const [longitude, latitude] = units[0].location.coordinates;
  return [latitude, longitude];
}

function EmbedView() {
  const { t } = useTranslation();
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const unitId = params.get("unit");
  const sport = params.get("sport");

  const [clickedUnit, setClickedUnit] = useState<Unit | undefined>(undefined);

  const services = sport ? SportServices[sport] : undefined;

  const { data: singleUnit, isLoading: isSingleLoading } =
    useGetUnitByIdQuery(unitId ?? "", { skip: !unitId });

  const { data: unitsData, isLoading: isUnitsLoading } = useGetUnitsQuery(
    services ? { services } : undefined,
    { skip: !!unitId }
  );

  // React Compiler handles memoization — no manual useMemo needed
  const rawUnits = (unitsData?.entities?.unit
    ? Object.values(unitsData.entities.unit)
    : []) as unknown as Unit[];

  const units = getEmbedUnits(unitId, singleUnit, services, rawUnits);
  const position = getEmbedPosition(units);

  const seasonEnded = !!sport && getOffSeasonSportFilters().includes(sport);
  const isLoading = unitId ? isSingleLoading : isUnitsLoading;
  const language = useLanguage();
  const targetZoom = unitId ? DETAIL_ZOOM_IN : DEFAULT_ZOOM;

  // Delay rendering the map until we have the actual position so MapContainer
  // initialises at the correct centre rather than the Helsinki default.
  const mapReady = !unitId || !!singleUnit;
  const selectedUnit = clickedUnit ?? (unitId && singleUnit ? singleUnit : undefined);

  const handleSelectUnit = (id: string) => {
    setClickedUnit(units.find((u) => u.id === id));
  };

  return (
    <div className="embed-view">
      {mapReady ? (
        <EmbedMap
          units={units}
          position={position}
          targetZoom={targetZoom}
          isLoading={isLoading}
          activeLanguage={language}
          selectedUnit={selectedUnit}
          onSelectUnit={handleSelectUnit}
        />
      ) : (
        <div className="embed-view__loading" aria-busy="true">
          <Loading />
        </div>
      )}
      {clickedUnit && (
        <EmbedUnitPanel
          unit={clickedUnit}
          onClose={() => setClickedUnit(undefined)}
        />
      )}
      {seasonEnded && (
        <output className="embed-view__season-ended">
          <p className="embed-view__season-ended-title">
            {t("EMBED_TOOL.SEASON_ENDED")}
          </p>
          <p className="embed-view__season-ended-detail">
            {t("EMBED_TOOL.SEASON_ENDED_DETAIL")}
          </p>
        </output>
      )}
    </div>
  );
}

export default EmbedView;
