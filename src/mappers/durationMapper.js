export const toHoursAndMinutes = duration => {
  const hours = Math.floor(duration / 60);
  const hoursString = hours > 0 ? hours + "h " : "";

  const minutes = duration % 60;
  const minutesString = minutes > 0 ? minutes + "m" : "";

  return hoursString + minutesString;
};
