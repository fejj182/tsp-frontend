import { interval, paneGroups } from "@/modules/map/panes/paneConfigs";

export const getPaneNameFromDuration = duration => {
  const proposedGroup = Math.floor(duration / interval);
  const groupNames = Object.keys(paneGroups);
  const highestGroup = groupNames.length - 1;
  const givenGroup =
    proposedGroup > highestGroup ? highestGroup : proposedGroup;
  return groupNames[givenGroup];
};

//TODO: write test for this
export const displayPanesInRange = (panes, range) => {
  const lowGroupsToHide = range[0];
  const highGroupsToHide = range[1];

  const groupNames = Object.keys(paneGroups);

  for (let i = 0; i < groupNames.length; i++) {
    const paneName = groupNames[i];

    if (i < lowGroupsToHide || i > highGroupsToHide) {
      panes[paneName].style.display = "none";
    } else {
      panes[paneName].style.display = "block";
    }
  }
};
