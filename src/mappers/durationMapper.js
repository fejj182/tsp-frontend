export const toHoursAndMinutes = duration => {
  if (duration > 0) {
    const hours = Math.floor(duration / 60);

    let hoursString = "";
    if (hours > 0) {
      hoursString += hours;
    }
    if (hours == 1) {
      hoursString += " hr ";
    }
    if (hours > 1) {
      hoursString += " hrs ";
    }

    const minutes = duration % 60;
    const minutesString = minutes > 0 ? minutes + " min" : "";

    return hoursString + minutesString;
  } else {
    return duration || "";
  }
};
