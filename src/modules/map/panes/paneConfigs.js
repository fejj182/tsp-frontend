const interval = 60;

export const getPaneNameFromDuration = duration => {
  const groupNumber = Math.floor(duration / interval);
  const numberOfGroups = Object.keys(paneConfigs).length;
  const group = groupNumber < numberOfGroups ? groupNumber : numberOfGroups - 1;

  return paneConfigs["p" + group].name;
};

export const paneConfigs = Object.freeze({
  p0: {
    name: "pane0to1hr",
    min: 0 * interval
  },
  p1: {
    name: "pane1to2hr",
    min: 1 * interval
  },
  p2: {
    name: "pane2to3hr",
    min: 2 * interval
  },
  p3: {
    name: "pane3to4hr",
    min: 3 * interval
  },
  p4: {
    name: "pane4to5hr",
    min: 4 * interval
  },
  p5: {
    name: "pane5to6hr",
    min: 5 * interval
  },
  p6: {
    name: "pane6to7hr",
    min: 6 * interval
  },
  p7: {
    name: "pane7to8hr",
    min: 7 * interval
  },
  p8: {
    name: "pane8to9hr",
    min: 8 * interval
  },
  p9: {
    name: "pane9to10hr",
    min: 9 * interval
  },
  p10: {
    name: "pane10to11hr",
    min: 10 * interval
  },
  p11: {
    name: "pane11to12hr",
    min: 11 * interval
  }
});
