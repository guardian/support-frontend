// @flow
// A series of general purpose helper functions.

// Ascending comparison function for use with Array.prototype.sort.
export function ascending(a: number, b: number): number {
  return a > b ? 1 : 0;
}


// Descending comparison function for use with Array.prototype.sort.
export function descending(a: number, b: number): number {
  return a < b ? 1 : 0;
}

// Converts a number to a given number of decimal places, default two.
export function roundDp(num: number, dps: number = 2) {
  return Math.round(num * (10 ** dps)) / (10 ** dps);
}

// Generates the "class modifier-class" string for HTML elements
export function generateClassName(className: string, modifierClass: ?string): string {
  let response = className;

  if (modifierClass) {
    response = `${className} ${className}--${modifierClass}`;
  }

  return response;
}

