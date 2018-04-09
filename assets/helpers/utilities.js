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
function classNameWithModifiers(className: string, modifiers?: string[] = []): string {
  return modifiers.reduce((acc, m) => `${acc} ${className}--${m}`, className);
}

// Generates a className with an optional modifier (common pattern convenience function).
function classNameWithOptModifier(className: string, modifier: ?string): string {
  return classNameWithModifiers(className, modifier ? [modifier] : undefined);
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

function validateEmailAddress(email: string): boolean {
  // Copied from
  // https://github.com/playframework/playframework/blob/38abd1ca6d17237950c82b1483057c5c39929cb4/framework/src/play/
  // src/main/scala/play/api/data/validation/Validation.scala#L80
  // but with minor modification (last * becomes +) to enforce at least one dot in domain.  This is
  // for compatibility with Stripe
  const emailValidationRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

  return emailValidationRegex.test(email);
}

function emptyInputField(input: ?string): boolean {
  return input === undefined || input === null || input === '' || input.trim().length === 0;
}

// ----- Exports ----- //

export {
  ascending,
  descending,
  roundDp,
  classNameWithOptModifier,
  classNameWithModifiers,
  clickSubstituteKeyPressHandler,
  parseBoolean,
  deserialiseJsonObject,
  validateEmailAddress,
  emptyInputField,
};
