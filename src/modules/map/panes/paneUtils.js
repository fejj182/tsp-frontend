import paneConfigs from "@/modules/map/panes/paneConfigs";

export const getPaneNameFromDuration = duration => {
  if (duration > 0) {
    const proposedGroup = Math.floor((duration - 1) / paneConfigs.INTERVAL);
    const highestGroup = paneConfigs.NUMBER_OF_PANES - 1;
    const givenGroup =
      proposedGroup > highestGroup ? highestGroup : proposedGroup;
    return `p${givenGroup}`;
  }
  return "p0";
};

export const filterStationsOutOfRange = (stations, range) => {
  return stations.filter(station => {
    const interval = paneConfigs.INTERVAL;
    const highestPane = paneConfigs.NUMBER_OF_PANES - 1;
    return (
      (station.duration > range[0] * interval &&
        station.duration <= range[1] * interval) ||
      (range[1] == highestPane && station.duration > highestPane * interval) ||
      !station.duration
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
