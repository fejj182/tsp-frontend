import { getPaneNameFromDuration } from "@/modules/map/panes/paneUtils";

export const generateMarker = (station, map, onClick, colour) => {
  const paneName =
    station.duration > 0 ? getPaneNameFromDuration(station.duration) : "p0";

  const marker = L.marker([station.lat, station.lng], {
    pane: paneName,
    icon: generateIcon(colour)
  });

  marker.addTo(map);
  marker.on("click", onClick);
  return marker;
};

const generateIcon = colour => {
  return L.divIcon({
    html: `<i class="fas fa-map-marker-alt marker-${colour}"></i>`,
    iconAnchor: [6.75, 18],
    iconSize: [13.5, 18],
    className: `div-icon-${colour}`
  });
};
