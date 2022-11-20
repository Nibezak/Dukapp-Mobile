/**
 * Format number into thousands separators
 * @param {numeric} number
 * @returns string
 */
export function number(numberToFormat) {
  if (numberToFormat == 0) {
    return 0;
  }

  if (
    typeof numberToFormat == "undefined" ||
    isNaN(numberToFormat) ||
    numberToFormat === null
  ) {
    return 0;
  }

  return numberToFormat.toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
}

/**
 * Get amount formatted with currency
 *
 * @param {number} amount
 * @returns
 */
export function money(amount, currency = "RWF") {
  return currency + " "+ number(amount);
}

/**
 * Extract a number from a string
 * @param {string} str
 * @returns
 */
export function numberFromString(str) {
  return str.toString().match(/(\d+)/);
}

/**
 * Get Random number
 */
export function randomNumber(minimum, maximum) {
  return Math.round(Math.random() * (maximum - minimum) + minimum);
}
