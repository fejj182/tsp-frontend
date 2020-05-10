import L from "leaflet";
import { getPaneNameFromDuration } from "@/modules/map/panes/paneUtils";

export const generateMarker = (station, map, onClick, colour) => {
  const marker = L.marker([station.lat, station.lng], {
    pane: getPaneNameFromDuration(station.duration),
    icon: generateIcon(colour)
  });

  marker.addTo(map);
  marker.on("click", onClick);
  return marker;
};

const generateIcon = colour => {
  return L.icon({
    iconUrl: `pin-${colour}.png`,
    iconAnchor: [0, 20],
    iconSize: [20, 20],
    className: `marker-${colour}`
  });
};
