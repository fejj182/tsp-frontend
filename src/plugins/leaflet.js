import L from "leaflet";
import { getPaneNameFromDuration } from "@/modules/map/panes/paneUtils";

export const generateMarker = (station, map, onClick, colour) => {
  const marker = L.marker([station.lat, station.lng], {
    pane: getPaneNameFromDuration(station.duration),
    icon: L.icon({
      iconUrl: `pin-${colour}.png`,
      iconAnchor: [0, 20],
      iconSize: [20, 20],
      className: `marker-${colour}`
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
