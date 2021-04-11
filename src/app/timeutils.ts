const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const weekdays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

function padZero(input: number) {
  return input.toString().length === 1 ? `0${input}` : input;
}

function isThisWeek(compare: Date, now: Date) {
  const inAWeek = new Date(now);
  inAWeek.setDate(inAWeek.getDate() + 7);

  return compare.getTime() < inAWeek.getTime();
}

function isToday(compare: Date, now: Date) {
  return isThisWeek(compare, now) && compare.getDate() === now.getDate();
}

export function autoDatify(dateObj: Date) {
  // if posted within 24h, state how many minutes | hours have passed since this date
  // if posted within a week, state how many days have passed since this date
  // else say how many weeks since that date
  // if weeks > 52, then say what year it was created -> eg. June 2019

  const now = new Date();

  if (isToday(dateObj, now)) {
    const nowSeconds = Math.round(now.getTime() / 1000);
    const dateSeconds = Math.round(dateObj.getTime() / 1000);

    return nowSeconds - dateSeconds < 60 * 60
      ? now.getMinutes() - dateObj.getMinutes() + "m ago"
      : now.getHours() - dateObj.getHours() + "h ago";
  }
}

export function properDatify(dateObj: Date) {
  return `${weekdays[dateObj.getDay()]}, ${dateObj.getDate()} ${
    months[dateObj.getMonth()]
  } ${dateObj.getFullYear()} ${padZero(dateObj.getHours())}:${padZero(
    dateObj.getMinutes()
  )}`;
}
