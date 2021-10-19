// A series of general purpose helper functions.
// ----- Functions ----- //
// Ascending comparison function for use with Array.prototype.sort.
function ascending(a: number, b: number): number {
  return a - b;
}

// Converts a number to a given number of decimal places, default two.
function roundDp(num: number, dps: number = 2) {
  return Math.round(num * 10 ** dps) / 10 ** dps;
}

// Generates the "class class-modifier" string for HTML elements.
// Does not add null, undefined and empty string.
function classNameWithModifiers(className: string, modifiers: Array<string | null | undefined>): string {
  return modifiers.filter(Boolean).reduce((acc, modifier) => `${acc} ${className}--${modifier}`, className);
}

function hiddenIf(shouldHide: boolean, className: string): string {
  return shouldHide ? classNameWithModifiers(className, ['hidden']) : className;
}

// Deserialises a JSON object from a string.
function deserialiseJsonObject(serialised: string): Record<string, any> | null | undefined {
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

// ----- Exports ----- //
export { ascending, roundDp, classNameWithModifiers, hiddenIf, deserialiseJsonObject };