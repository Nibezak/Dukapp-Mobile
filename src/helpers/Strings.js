/**
 * Convert camelCase to snake_case
 *
 * @param {string} key
 * @returns
 */
export function camelToUnderscore(key) {
  var result = key.replace(/([A-Z])/g, ' $1');
  return result.split(' ').join('_').toLowerCase();
}

/**
 * Change to Camel case
 *
 * @param {string} key
 * @returns string
 */
export function camelToSnakeCase(key) {
  var result = key.replace(/([A-Z])/g, ' $1');
  return result
    .substring(1) // Remove first space
    .split(' ') // Identity where to put _
    .join('_') // put everything together
    .toLowerCase(); // Ensure they are in lower case
}

/**
 * Query Key and Value Joiner
 */
export function queryJoiner(glue, separator, object) {
  if (glue == undefined) {
    glue = '=';
  }

  if (separator == undefined) {
    separator = ',';
  }

  return Object.keys(object)
    .map(function (key, value) {
      return [key, value].join(glue);
    })
    .join(separator);
}
