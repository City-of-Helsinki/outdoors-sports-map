import { Position } from 'geojson';
import L from 'leaflet';
import 'leaflet.heightgraph';
import { useEffect, useState } from 'react';
import { useTranslation } from "react-i18next";
import { useMap } from 'react-leaflet';

import { Unit } from "../unit/unitConstants";

// Extend L.control to include heightgraph
declare module 'leaflet' {
  namespace control {
    function heightgraph(options: any): any;
  }
}

type Props = {
  data: Unit;
  isMobile: boolean;
};

function HeightProfileControl({data, isMobile}: Props) {
  const { t } = useTranslation();
  const map = useMap();
  const [geometryData, setGeometryData] = useState<{coordinates: Position[]} | null>(null);

  useEffect(() => {
    const getUnitGeometry = (unit: Unit) => {
      const { geometry_3d } = unit;
      if (geometry_3d) {
        const coordinates = geometry_3d?.coordinates;
        if (coordinates && geometry_3d.type === 'MultiLineString') {
            const lineString = coordinates && coordinates[0];
            return {
                coordinates: lineString,
            };
        }
      }
      return null;
    };

    setGeometryData(getUnitGeometry(data));
  }, [data]);

  useEffect(() => {
    if(!geometryData || !geometryData.coordinates) {
        return;
    }
    function constructProfileGeoJson(coordinates: Position[]) {
        return [{
            'type': 'FeatureCollection' as const,
            'features': [{
                'type': 'Feature',
                'geometry': {
                    'type': 'LineString',
                    'coordinates': coordinates
                },
                'properties': {
                    'attributeType': 'flat'
                }
            }],
            'properties': {
                "summary": 'HeightProfile',
                'label': t("MAP.HEIGHT_PROFILE.TITLE"),
            }
        }];
    }
    const geoJson = constructProfileGeoJson(geometryData.coordinates);
    
    const onRoute = (event: any) => {
        control.mapMousemoveHandler(event, { showMapMarker: true });
    }
    const outRoute = (event: any) => {
        control.mapMouseoutHandler(2000);
    }

    const control = L.control.heightgraph({
        position: !isMobile ? 'bottomright' : 'topright',
        mappings: {
            'HeightProfile': {
                'flat': {
                    text: t("MAP.HEIGHT_PROFILE.TITLE"),
                    color: '#3388ff'
                }
            }
        },
        graphStyle: {
            opacity: 0.8,
            'fill-opacity': 0.5,
            'stroke-width': '3px'
        },
        translation: {
            distance: t("MAP.HEIGHT_PROFILE.DISTANCE"),
            elevation: t("MAP.HEIGHT_PROFILE.ELEVATION"),
            segment_length: t("MAP.HEIGHT_PROFILE.SEGMENT_LENGTH"),
            type: t("MAP.HEIGHT_PROFILE.TYPE"),
            legend: t("MAP.HEIGHT_PROFILE.LEGEND"),
        },
        expandControls: true
    });

    const displayGroup = new L.LayerGroup();
    displayGroup.addTo(map);
    control.addTo(map);
    control.addData(geoJson);

    const layer = L.geoJson(geoJson, {
        style: {
            "color": "#3388ff",
            "weight": 5,
            "opacity": 1
        }
    });
    layer
        .on({
            'mousemove': onRoute,
            'mouseout': outRoute,
        })
        .addTo(displayGroup);
    
    if (isMobile) {
        control.getContainer().style.marginTop = '80px';
        control.getContainer().style.marginRight = '-108px';
        control._button.style.marginRight = '154px';
        control._button.style.marginTop = '210px';
        control.resize({width:370, height:200});
    } else {
        control.resize({width:800, height:300});
    }

    return () => {
        map.removeControl(control);
        map.removeLayer(displayGroup);
    }
  });

  return null;
}

export default HeightProfileControl;
