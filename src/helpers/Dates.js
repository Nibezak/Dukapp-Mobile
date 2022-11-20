import { swapKeysAndValues } from "./Arrays";

/**
 * Get ISO Date string
 */
export function ISODate() {
  return new Date().toISOString();
}

/**
 * Function that returns today's date
 */
export function today() {
  return ISODate().slice(0, 10);
}

/**
 * Get unix time stamp
 */
export function unixTimeStamp() {
  return Math.round(new Date().getTime() / 1000);
}

/**
 * Get Last X days
 * @returns
 */
export function yesterday() {
  return lastXDaysDate(1);
}

/**
 * Get last x days
 * @param {integer} numberOfDays
 * @returns
 */
export function lastXDaysDate(numberOfDays) {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - numberOfDays);
  return yesterday.toISOString().slice(0, 10);
}

/**
 * Get current day of the month
 *
 * @returns number
 */
export function dayOfTheMonth() {
  return new Date().getDate();
}

/**
 * Get day of the year
 *
 * @returns number
 */
export function dayOfTheYear() {
  var now = new Date();
  var start = new Date(now.getFullYear(), 0, 0);
  var diff = now - start;
  var oneDay = 1000 * 60 * 60 * 24;
  var day = Math.floor(diff / oneDay);
  return day;
}

/**
 *
 * @returns get Monday's date
 */
export function getMondayDate() {
  d = new Date(new Date());
  var day = d.getDay(),
    diff = d.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
  return new Date(d.setDate(diff));
}

/**
 * Get shortNames of last x days
 * @param {number} numberOfDays default 7
 * @returns
 */
export function lastXDaysNames(numberOfDays = 7) {
  return [...Array(numberOfDays)].map((_, i) => {
    const d = new Date();

    // Get day name
    d.setDate(d.getDate() - i).toLocaleString("en-us", {
      weekday: "long",
    });
    return d.toString().substr(0, 3);
  });
}

/**
 * Get array for chart data
 *
 * @param {number of days} numberOfDays
 * @returns
 */
export function lastXDaysNamesForChart(numberOfDays = 7) {
  const lastxDays = lastXDaysNames(numberOfDays);

  return Object.values(lastxDays).reverse();
}
