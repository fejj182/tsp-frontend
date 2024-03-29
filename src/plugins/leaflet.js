import L from "leaflet";
import { getPaneNameFromDuration } from "@/modules/map/panes/paneUtils";
import paneConfigs from "@/modules/map/panes/paneConfigs";

export const createMap = (mapId, centreCoords, zoomLevel) => {
  L.Map.addInitHook(function() {
    window.myInitializedMap = this;
  });

  const map = L.map(mapId);
  map.setView(centreCoords, zoomLevel);

  L.tileLayer(
    "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
    {
      attribution:
        '© <a href="https://www.mapbox.com/about/maps/">Mapbox</a> © <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> <strong><a href="https://www.mapbox.com/map-feedback/" target="_blank">Improve this map</a></strong>',
      tileSize: 512,
      minZoom: 5,
      // TODO: minZoom 6 causes big performance issues
      maxZoom: 10,
      zoomOffset: -1,
      id: "mapbox/outdoors-v11",
      accessToken: process.env.VUE_APP_OPEN_STREET_MAPS_KEY
    }
  ).addTo(map);

  // Leaflet can load the tiles before vuetify has finished the layout
  // https://stackoverflow.com/questions/36246815/data-toggle-tab-does-not-download-leaflet-map
  setTimeout(() => {
    window.myInitializedMap.invalidateSize();
  }, 250);

  return map;
};

export const createPanes = map => {
  const panes = {};
  for (let i = 0; i < paneConfigs.NUMBER_OF_PANES; i++) {
    const paneName = `p${i}`;
    const pane = map.createPane(paneName);
    // https://leafletjs.com/reference-1.6.0.html#map-pane - set z index in between 600 and 700
    pane.style.zIndex = 650;
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

export const flyTo = (map, zoom, coords, duration) => {
  map.flyTo(coords, zoom, {
    duration: duration,
    easeLinearity: 0.1
  });
};

export const createLegend = (map, html, position, onClick) => {
  const legend = L.control({ position: position });
  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "legend");
    div.innerHTML = html.$el.outerHTML;
    if (onClick) {
      div.onclick = onClick;
    }
    return div;
  };
  legend.addTo(map);
  return legend;
};

export const generateMarker = (station, map, onClick, type) => {
  const marker = L.marker([station.lat, station.lng], {
    pane: getPaneNameFromDuration(station.duration),
    icon: L.icon({
      iconUrl: require("@/assets/pin-purple.png"),
      iconAnchor: [0, 20],
      iconSize: [20, 20],
      className: `marker-${type} marker-${type}-${station.slug}`
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
      iconAnchor: [8, 8],
      iconSize: [16, 16],
      className: `position-${position}`
    })
  });
  marker.addTo(map);
  return marker;
};

export const bindPopupToMarker = (marker, popupHTML) => {
  return marker.bindPopup(popupHTML, {
    closeButton: false,
    offset: [-3, -2]
  });
};
