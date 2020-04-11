import paneConfigs from "@/modules/map/panes/paneConfigs";

export const getPaneNameFromDuration = duration => {
  const proposedGroup = Math.floor(duration / paneConfigs.INTERVAL);
  const highestGroup = paneConfigs.NUMBER_OF_PANES - 1;
  const givenGroup =
    proposedGroup > highestGroup ? highestGroup : proposedGroup;
  return `p${givenGroup}`;
};

export const filterStationsOutOfRange = (stations, range) => {
  return stations.filter(station => {
    const interval = paneConfigs.INTERVAL;
    return (
      (station.duration > range[0] * interval &&
        station.duration <= range[1] * interval) ||
      station.duration > (paneConfigs.NUMBER_OF_PANES - 1) * interval
    );
  });
};

export const displayPanesInRange = (panes, range) => {
  const lowGroupsToHide = range[0];
  const highGroupsToHide = range[1];

  for (let i = 0; i < paneConfigs.NUMBER_OF_PANES; i++) {
    const paneName = `p${i}`;

    if (
      i < lowGroupsToHide ||
      (i >= highGroupsToHide &&
        highGroupsToHide != paneConfigs.NUMBER_OF_PANES - 1)
    ) {
      panes[paneName].style.display = "none";
    } else {
      panes[paneName].style.display = "block";
    }
  }
};
