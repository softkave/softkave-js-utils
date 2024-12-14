/** Generates a random number between `min` and `max`. `min` is inclusive and
 * `max` is exclusive */
export function getRandomInt(
  /** `min` is inclusive and `max` is exclusive */
  min: number,
  /** `max` is exclusive and `min` is inclusive */
  max: number
) {
  min = Math.ceil(min);
  max = Math.floor(max);

  // The maximum is exclusive and the minimum is inclusive
  return Math.floor(Math.random() * (max - min) + min);
}
