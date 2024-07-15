/**
 * get a number between 0 and endpoint
 * @param endpoint
 * @returns 0 ~ endpoint(contain)
 */
export function getRandom(endpoint: number) {
  return Math.round(Math.random() * endpoint);
}

/**
 * get a number between startpoint and endpoint
 * @param startpoint
 * @param endpoint
 * @returns startpoint ~ endpoint(contain)
 */
export function getRangeRandom(startpoint: number, endpoint: number) {
  const diff = Math.abs(startpoint - endpoint);
  return Math.round(Math.random() * diff) + Math.min(startpoint, endpoint);
}
