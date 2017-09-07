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

// Generates a key handler that only trigger a function if the
// CarriageReturnCode and SpaceCode are pressed
export function clickSubstituteKeyPressHandler(handler?: () => void = () => {}) {
  return (event: Object) => {
    const CarriageReturnCode = 13;
    const SpaceCode = 32;

    if (event.keyCode === CarriageReturnCode || event.keyCode === SpaceCode) {
      event.preventDefault();
      handler();
    }
  };
}

// Attempts to parse a boolean from a string.
export function parseBoolean(boolString: string, fallback: boolean): boolean {

  switch (boolString.toLowerCase()) {
    case 'true':
      return true;
    case 'false':
      return false;
    default:
      return fallback;
  }

}

export function titleCase(s: string) {
  return s.charAt(0).toUpperCase() + s.toLowerCase().substring(1);
}
