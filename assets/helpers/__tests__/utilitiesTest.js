// @flow

// ----- Imports ----- //

import {
  ascending,
  descending,
  roundDp,
  generateClassName,
  clickSubstituteKeyPressHandler,
  parseBoolean,
  deserialiseJsonObject,
  validateEmailAddress,
  isSome,
  isNone,
  isSomeString,
  isNoneString,
  getOrElse,
  getStringOrElse,
  emptyInputField,
} from '../utilities';


// ----- Functions ----- //

// Returns a mocked keypress event.
function getMockedKeypress(key: number) {
  return { keyCode: key, preventDefault: () => {} };
}


// ----- Tests ----- //

describe('utilities', () => {

  describe('ascending', () => {

    it('should return a 1 if a > b', () => {
      expect(ascending(3, 2)).toEqual(1);
    });

    it('should return a 0 if a < b', () => {
      expect(ascending(2, 3)).toEqual(0);
    });

    it('should return a 1 if a === b', () => {
      expect(ascending(2, 2)).toEqual(0);
    });

    it('should sort an array in ascending order', () => {

      const unsorted = [100, 2, 2, 46.78, 54, 67, 54, 0.3, -3];
      const sorted = [-3, 0.3, 2, 2, 46.78, 54, 54, 67, 100];

      expect(unsorted.sort(ascending)).toEqual(sorted);

    });

  });

  describe('descending', () => {

    it('should return a 0 if a > b', () => {
      expect(ascending(3, 2)).toEqual(1);
    });

    it('should return a 1 if a < b', () => {
      expect(ascending(2, 3)).toEqual(0);
    });

    it('should return a 0 if a === b', () => {
      expect(ascending(2, 2)).toEqual(0);
    });

    it('should sort an array in descending order', () => {

      const unsorted = [100, 2, 2, 46.78, 54, 67, 54, 0.3, -3];
      const sorted = [100, 67, 54, 54, 46.78, 2, 2, 0.3, -3];

      expect(unsorted.sort(descending)).toEqual(sorted);

    });

  });

  describe('roundDp', () => {

    it('should by default round to two decimal places', () => {
      expect(roundDp(1234.5678)).toBe(1234.57);
    });

    it('should round, not floor or ceil', () => {
      expect(roundDp(12.345)).toBe(12.35);
      expect(roundDp(12.344)).toBe(12.34);
    });

    it('should round to a given number of decimal places', () => {
      expect(roundDp(12.3456789, 5)).toBe(12.34568);
      expect(roundDp(12.34, 5)).toBe(12.34);
    });

  });

  describe('generateClassName', () => {

    it('should create the same classname if no modifier is passed', () => {
      expect(generateClassName('made-up-class')).toBe('made-up-class');
    });

    it('should return a classname with a modifier attached', () => {
      expect(generateClassName('made-up-class', 'fake-modifier'))
        .toBe('made-up-class made-up-class--fake-modifier');
    });

  });

  describe('clickSubstituteKeyPressHandler', () => {

    it('should call callback if return is pressed', (done) => {
      clickSubstituteKeyPressHandler(done)(getMockedKeypress(13));
    });

    it('should call callback if space is pressed', (done) => {
      clickSubstituteKeyPressHandler(done)(getMockedKeypress(32));
    });

  });

  describe('parseBoolean', () => {

    it('should parse all variations of true', () => {
      expect(parseBoolean('true', false)).toBe(true);
      expect(parseBoolean('TRUE', false)).toBe(true);
      expect(parseBoolean('True', false)).toBe(true);
    });

    it('should parse all variations of false', () => {
      expect(parseBoolean('false', true)).toBe(false);
      expect(parseBoolean('FALSE', true)).toBe(false);
      expect(parseBoolean('False', true)).toBe(false);
    });

    it('should produce the correct fallbacks on failure to parse', () => {
      expect(parseBoolean('notaboolean', true)).toBe(true);
      expect(parseBoolean('notaboolean', false)).toBe(false);
    });

  });

  describe('deserialiseJsonObject', () => {

    it('should deserialise a valid JSON object', () => {

      const serialised = '{"a": 1, "b": "hello world"}';
      const deserialised = { a: 1, b: 'hello world' };

      expect(deserialiseJsonObject(serialised)).toEqual(deserialised);

    });

    it('should return null for JSON that is not an object', () => {

      const serialised = '[1, 2, 3]';

      expect(deserialiseJsonObject(serialised)).toBeNull();

    });

    it('should return null for JSON that is malformed', () => {

      const serialised = '{{notvalidJSON';

      expect(deserialiseJsonObject(serialised)).toBeNull();

    });

  });

  describe('validateEmailAddress', () => {

    it('should return true for test@gu.com', () => {
      expect(validateEmailAddress('test@gu.com')).toEqual(true);
    });

    it('should return false if there is a space at the end of an email address', () => {
      expect(validateEmailAddress('test@gu.com ')).toEqual(false);
    });

    it('should return false if there is a space at the start of an email address', () => {
      expect(validateEmailAddress(' test@gu.com')).toEqual(false);
    });

    it('should return false if there is no dot in the domain', () => {
      expect(validateEmailAddress('test@gu')).toEqual(false);
    });

    it('should return true for test@gu.co.uk', () => {
      expect(validateEmailAddress('test@gu.co.uk')).toEqual(true);
    });
  });

  describe('isSome', () => {

    it('should return true for values that exist', () => {
      expect(isSome('CP Scott')).toBe(true);
      expect(isSome('')).toBe(true);
      expect(isSome(50)).toBe(true);
      expect(isSome(0)).toBe(true);
      expect(isSome([1, 2, 3])).toBe(true);
      expect(isSome([])).toBe(true);
      expect(isSome({ a: 1 })).toBe(true);
      expect(isSome({})).toBe(true);
      expect(isSome(true)).toBe(true);
      expect(isSome(false)).toBe(true);
    });

    it('should return false for null and undefined', () => {
      expect(isSome(null)).toBe(false);
      expect(isSome(undefined)).toBe(false);
    });

  });

  describe('isNone', () => {

    it('should return true for null and undefined', () => {
      expect(isNone(null)).toBe(true);
      expect(isNone(undefined)).toBe(true);
    });

    it('should return false for values that exist', () => {
      expect(isNone('CP Scott')).toBe(false);
      expect(isNone('')).toBe(false);
      expect(isNone(50)).toBe(false);
      expect(isNone(0)).toBe(false);
      expect(isNone([1, 2, 3])).toBe(false);
      expect(isNone([])).toBe(false);
      expect(isNone({ a: 1 })).toBe(false);
      expect(isNone({})).toBe(false);
      expect(isNone(true)).toBe(false);
      expect(isNone(false)).toBe(false);
    });

  });

  describe('isSomeString', () => {

    it('should return true for strings that exist', () => {
      expect(isSomeString('CP Scott')).toBe(true);
      expect(isSomeString('  CP Scott  ')).toBe(true);
      expect(isSomeString(' ')).toBe(true);
    });

    it('should return false for null, undefined and empty strings', () => {
      expect(isSomeString(null)).toBe(false);
      expect(isSomeString(undefined)).toBe(false);
      expect(isSomeString('')).toBe(false);
    });

  });

  describe('isNoneString', () => {

    it('should return true for null, undefined and empty strings', () => {
      expect(isNoneString(null)).toBe(true);
      expect(isNoneString(undefined)).toBe(true);
      expect(isNoneString('')).toBe(true);
    });

    it('should return false for strings that exist', () => {
      expect(isNoneString('CP Scott')).toBe(false);
      expect(isNoneString('  CP Scott  ')).toBe(false);
      expect(isNoneString(' ')).toBe(false);
    });

  });

  describe('getOrElse', () => {

    const fallbackString = 'fallbackString';
    const fallbackNum = 42;
    const fallbackArray = [42, 42, 42];
    const fallbackObject = { name: 'CP Scott' };

    it('should return the value if it exists', () => {
      expect(getOrElse('CP Scott', fallbackString)).toBe('CP Scott');
      expect(getOrElse('', fallbackString)).toBe('');
      expect(getOrElse(50, fallbackNum)).toBe(50);
      expect(getOrElse(0, fallbackNum)).toBe(0);
      expect(getOrElse([1, 2, 3], fallbackArray)).toEqual([1, 2, 3]);
      expect(getOrElse([], fallbackArray)).toEqual([]);
      expect(getOrElse({ a: 1 }, fallbackObject)).toEqual({ a: 1 });
      expect(getOrElse({}, fallbackObject)).toEqual({});
      expect(getOrElse(true, false)).toBe(true);
      expect(getOrElse(false, true)).toBe(false);
    });

    it('should return the fallback if the value does not exist', () => {
      expect(getOrElse(null, fallbackString)).toBe(fallbackString);
      expect(getOrElse(undefined, fallbackString)).toBe(fallbackString);
      expect(getOrElse(null, fallbackNum)).toBe(fallbackNum);
      expect(getOrElse(undefined, fallbackNum)).toBe(fallbackNum);
      expect(getOrElse(null, fallbackArray)).toEqual(fallbackArray);
      expect(getOrElse(undefined, fallbackArray)).toEqual(fallbackArray);
      expect(getOrElse(null, fallbackObject)).toEqual(fallbackObject);
      expect(getOrElse(undefined, fallbackObject)).toEqual(fallbackObject);
      expect(getOrElse(null, true)).toBe(true);
      expect(getOrElse(undefined, false)).toBe(false);
    });

  });

  describe('getStringOrElse', () => {

    const fallbackString = 'fallbackString';

    it('should return the string if it exists', () => {
      expect(getStringOrElse('CP Scott', fallbackString)).toBe('CP Scott');
      expect(getStringOrElse('  CP Scott  ', fallbackString)).toBe('  CP Scott  ');
      expect(getStringOrElse(' ', fallbackString)).toBe(' ');
    });

    it('should return the fallback if the string is null, undefined or empty', () => {
      expect(getStringOrElse(null, fallbackString)).toBe(fallbackString);
      expect(getStringOrElse(undefined, fallbackString)).toBe(fallbackString);
      expect(getStringOrElse('', fallbackString)).toBe(fallbackString);
    });

  });

  describe('emptyInputField', () => {

    it('should return true for null', () => {
      expect(emptyInputField(null)).toEqual(true);
    });

    it('should return true for undefined', () => {
      expect(emptyInputField(undefined)).toEqual(true);
    });

    it('should return true for an empty string', () => {
      expect(emptyInputField('')).toEqual(true);
    });

    it('should return true for a string which only contains a space', () => {
      expect(emptyInputField(' ')).toEqual(true);
    });

    it('should return false for a string which contains characters other than a space', () => {
      expect(emptyInputField('Test')).toEqual(false);
    });

  });

});
