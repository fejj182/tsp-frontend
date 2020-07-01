import L from "leaflet";
import { getPaneNameFromDuration } from "@/modules/map/panes/paneUtils";
import paneConfigs from "@/modules/map/panes/paneConfigs";

export const createMap = (centreCoords, zoomLevel) => {
  const map = L.map("map");
  map.setView(centreCoords, zoomLevel);

  L.tileLayer(
    "https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}",
    {
      attribution:
        'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      minZoom: 5,
      // TODO: minZoom 6 causes big performance issues
      maxZoom: 10,
      id: "mapbox.streets",
      accessToken: process.env.VUE_APP_OPEN_STREET_MAPS_KEY
    }
  ).addTo(map);
  return map;
};

export const createPanes = map => {
  const panes = {};
  for (let i = 0; i < paneConfigs.NUMBER_OF_PANES; i++) {
    const paneName = `p${i}`;
    const pane = map.createPane(paneName);
    // https://leafletjs.com/reference-1.6.0.html#map-pane - set z index in between 600 and 700
    if (pane) {
      pane.style.zIndex = 650;
    }
    panes[paneName] = pane;
  }
  return panes;
};

export const createLine = (map, coordSet) => {
  const line = L.geoJSON({
    type: "LineString",
    coordinates: [coordSet[0], coordSet[1]]
  });
  line.addTo(map);
  return line;
};

export const generateMarker = (station, map, onClick, colour) => {
  const marker = L.marker([station.lat, station.lng], {
    pane: getPaneNameFromDuration(station.duration),
    icon: L.icon({
      iconUrl: require("@/assets/pin-" + colour + ".png"),
      iconAnchor: [0, 20],
      iconSize: [20, 20],
      className: `marker-${colour} marker-${colour}-${station.slug}`
    })
  });
  marker.addTo(map);
  marker.on("click", onClick);
  return marker;
};

export const generatePositionMarker = (station, map, position) => {
  const marker = L.marker([station.lat, station.lng], {
    icon: L.icon({
      iconUrl: require("@/assets/badge-" + position + ".png"),
      iconAnchor: [15, 15],
      iconSize: [30, 30],
      className: `position-${position}`
    })
  });
  marker.addTo(map);
  return marker;
};

export const flyTo = (map, zoom, coords, duration) => {
  map.flyTo(coords, zoom, {
    duration: duration,
    easeLinearity: 0.1
  });
};
