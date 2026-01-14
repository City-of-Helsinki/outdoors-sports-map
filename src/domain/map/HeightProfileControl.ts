/* eslint-disable @typescript-eslint/no-namespace */
import { Position } from "geojson";
import L, { LeafletMouseEvent } from "leaflet";
import "leaflet.heightgraph";
import { useEffect, useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useMap } from "react-leaflet";

import useIsMobile from "../../common/hooks/useIsMobile";
import { Unit } from "../unit/unitConstants";

// Extend L.control to include heightgraph
declare module "leaflet" {
  namespace control {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function heightgraph(options: any): any;
  }
}

type Props = {
  unit: Unit;
};

function HeightProfileControl({ unit }: Props) {
  const isMobile = useIsMobile();
  const { t } = useTranslation();
  const map = useMap();
  const [geometryIndex, setGeometryIndex] = useState(0);
  const [currentUnitId, setCurrentUnitId] = useState(unit.id);

  // Reset geometry index when unit changes using state comparison
  if (currentUnitId !== unit.id) {
    setCurrentUnitId(unit.id);
    setGeometryIndex(0);
  }

  // Compute geometry using useMemo to avoid setState in effect
  const geometry = useMemo(() => {
    const getUnitGeometry = (unitData: Unit, index: number): Position[] | null => {
      const { geometry_3d } = unitData;
      if (geometry_3d) {
        const coordinates = geometry_3d?.coordinates;
        if (coordinates) {
          if (geometry_3d.type === "MultiLineString") {
            const lineString = coordinates?.[index];
            return lineString;
          } else if (geometry_3d.type === "LineString") {
            return coordinates as unknown as Position[];
          }
        }
      }
      return null;
    };
    return getUnitGeometry(unit, geometryIndex);
  }, [unit, geometryIndex]);

  useEffect(() => {
    if (!geometry) {
      return;
    }
    function constructProfileGeoJson(coordinates: Position[]) {
      return [
        {
          type: "FeatureCollection" as const,
          features: [
            {
              type: "Feature",
              geometry: {
                type: "LineString",
                coordinates: coordinates,
              },
              properties: {
                attributeType: "flat",
              },
            },
          ],
          properties: {
            summary: "HeightProfile",
            label: t("MAP.HEIGHT_PROFILE.TITLE"),
          },
        },
      ];
    }
    const geoJson = constructProfileGeoJson(geometry);

    const onRoute = (event: LeafletMouseEvent) => {
      control.mapMousemoveHandler(event, { showMapMarker: true });
    };
    const outRoute = () => {
      control.mapMouseoutHandler(2000);
    };

    const control = L.control.heightgraph({
      position: "bottomright",
      mappings: {
        HeightProfile: {
          flat: {
            text: t("MAP.HEIGHT_PROFILE.TITLE"),
            color: "#3388ff",
          },
        },
      },
      graphStyle: {
        opacity: 0.8,
        "fill-opacity": 0.5,
        "stroke-width": "3px",
      },
      translation: {
        distance: t("MAP.HEIGHT_PROFILE.DISTANCE"),
        elevation: t("MAP.HEIGHT_PROFILE.ELEVATION"),
        segment_length: t("MAP.HEIGHT_PROFILE.SEGMENT_LENGTH"),
        type: t("MAP.HEIGHT_PROFILE.TYPE"),
        legend: t("MAP.HEIGHT_PROFILE.LEGEND"),
      },
      expandControls: true,
      expandCallback: function (expanded: boolean) {
        const heightProfileButtons = L.DomUtil.get("height-profile-buttons");
        if (heightProfileButtons) {
          heightProfileButtons.style.visibility = expanded
            ? "visible"
            : "hidden";
        }
      },
    });

    const displayGroup = new L.LayerGroup();
    displayGroup.addTo(map);
    control.addTo(map);
    control.addData(geoJson);

    const layer = L.geoJson(geoJson, {
      style: {
        color: "#3388ff",
        weight: 5,
        opacity: 1,
      },
    });
    layer
      .on({
        mousemove: onRoute,
        mouseout: outRoute,
      })
      .addTo(displayGroup);

    if (isMobile) {
      control.resize({ width: 370, height: 200 });
    } else {
      control.resize({ width: 800, height: 300 });
    }

    const buttonsDiv = L.DomUtil.create(
      "div",
      "height-profile-buttons",
      control.getContainer(),
    );
    buttonsDiv.id = "height-profile-buttons";
    const prevButton = L.DomUtil.create(
      "button",
      "height-profile-prev-button",
      buttonsDiv,
    );
    // Add HDS IconAngleLeft as innerHTML
    prevButton.innerHTML = `<svg aria-label="angle-left" aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill-rule="evenodd" clip-rule="evenodd" d="M10.5 12L15.5 17L14 18.5L7.5 12L14 5.5L15.5 7L10.5 12Z" fill="currentColor"></path></svg>`;
    
    const nextButton = L.DomUtil.create(
      "button",
      "height-profile-next-button",
      buttonsDiv,
    );
    // Add HDS IconAngleRight as innerHTML
    nextButton.innerHTML = `<svg aria-label="angle-right" aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill-rule="evenodd" clip-rule="evenodd" d="M13.5 12L8.5 7L10 5.5L16.5 12L10 18.5L8.5 17L13.5 12Z" fill="currentColor"></path></svg>`;

    L.DomEvent.on(
      prevButton,
      "mousedown dblclick",
      L.DomEvent.stopPropagation,
    ).on(prevButton, "click", () => {
      if (geometryIndex > 0) {
        setGeometryIndex(geometryIndex - 1);
      }
    });

    L.DomEvent.on(
      nextButton,
      "mousedown dblclick",
      L.DomEvent.stopPropagation,
    ).on(nextButton, "click", () => {
      if (
        unit.geometry_3d &&
        geometryIndex < unit.geometry_3d.coordinates.length - 1
      ) {
        setGeometryIndex(geometryIndex + 1);
      }
    });

    return () => {
      map.removeControl(control);
      map.removeLayer(displayGroup);
    };
  }, [geometry, geometryIndex, isMobile, map, t, unit]);

  return null;
}

export default HeightProfileControl;
