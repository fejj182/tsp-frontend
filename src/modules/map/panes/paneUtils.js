import paneConfigs from "@/modules/map/panes/paneConfigs";

export const getPaneNameFromDuration = duration => {
  const proposedGroup = Math.floor(duration / paneConfigs.interval);
  const groupNames = Object.keys(paneConfigs.groups);
  const highestGroup = groupNames.length - 1;
  const givenGroup =
    proposedGroup > highestGroup ? highestGroup : proposedGroup;
  return groupNames[givenGroup];
};

export const displayPanesInRange = (panes, range) => {
  const lowGroupsToHide = range[0];
  const highGroupsToHide = range[1];

  const groupNames = Object.keys(paneConfigs.groups);
  for (let i = 0; i < groupNames.length; i++) {
    const paneName = groupNames[i];

    if (i < lowGroupsToHide || i > highGroupsToHide) {
      panes[paneName].style.display = "none";
    } else {
      panes[paneName].style.display = "block";
    }
  }
};
