// @flow
// A series of general purpose helper functions.

// ----- Functions ----- //

// Ascending comparison function for use with Array.prototype.sort.
function ascending(a: number, b: number): number {
  return a > b ? 1 : 0;
}

// Descending comparison function for use with Array.prototype.sort.
function descending(a: number, b: number): number {
  return a < b ? 1 : 0;
}

// Converts a number to a given number of decimal places, default two.
function roundDp(num: number, dps: number = 2) {
  return Math.round(num * (10 ** dps)) / (10 ** dps);
}

// Generates the "class modifier-class" string for HTML elements
function generateClassName(className: string, modifierClass: ?string): string {
  let response = className;

  if (modifierClass) {
    response = `${className} ${className}--${modifierClass}`;
  }

  return response;
}

// Generates a key handler that only trigger a function if the
// CarriageReturnCode and SpaceCode are pressed
function clickSubstituteKeyPressHandler(handler?: () => void = () => {}) {
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
function parseBoolean(boolString: string, fallback: boolean): boolean {

  switch (boolString.toLowerCase()) {
    case 'true':
      return true;
    case 'false':
      return false;
    default:
      return fallback;
  }

}

// Deserialises a JSON object from a string.
function deserialiseJsonObject(serialised: string): ?Object {

  try {

    const deserialised = JSON.parse(serialised);

    if (deserialised instanceof Object && !(deserialised instanceof Array)) {
      return deserialised;
    }

    return null;

  } catch (err) {
    return null;
  }

}

/* eslint-disable no-bitwise, no-mixed-operators */
// generate a universally unique identifier
function UUID(mask: string = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx') {
  const replacer = (c) => {
    let d = new Date().getTime();
    const r = (d + (Math.random() * 16)) % 16 | 0;
    d = Math.floor(d / 16);
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  };
  return mask.replace(/[xy]/g, replacer);
}

/* eslint-enable no-bitwise, no-mixed-operators */

// ----- Exports ----- //

export {
  ascending,
  descending,
  roundDp,
  generateClassName,
  clickSubstituteKeyPressHandler,
  parseBoolean,
  deserialiseJsonObject,
  UUID,
};
