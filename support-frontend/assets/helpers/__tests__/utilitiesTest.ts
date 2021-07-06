// ----- Imports ----- //
import { ascending, roundDp, classNameWithModifiers, deserialiseJsonObject } from "../utilities/utilities";
// ----- Tests ----- //
describe('utilities', () => {
  describe('ascending', () => {
    it('should return a 1 if a > b', () => {
      expect(ascending(3, 2)).toEqual(1);
    });
    it('should return a -1 if a < b', () => {
      expect(ascending(2, 3)).toEqual(-1);
    });
    it('should return a 0 if a === b', () => {
      expect(ascending(2, 2)).toEqual(0);
    });
    it('should sort an array in ascending order', () => {
      const unsorted = [100, 2, 2, 46.78, 54, 67, 54, 0.3, -3];
      const sorted = [-3, 0.3, 2, 2, 46.78, 54, 54, 67, 100];
      expect(unsorted.sort(ascending)).toEqual(sorted);
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
  describe('classNameWithModifiers', () => {
    it('should create the same classname if no modifiers are passed', () => {
      expect(classNameWithModifiers('made-up-class', [])).toBe('made-up-class');
    });
    it('should return a classname with a modifier attached', () => {
      expect(classNameWithModifiers('made-up-class', ['fake-modifier'])).toBe('made-up-class made-up-class--fake-modifier');
    });
    it('should return a classname with multiple modifiers attached', () => {
      expect(classNameWithModifiers('made-up-class', ['fake-modifier', 'pseudo-modifier'])).toBe('made-up-class made-up-class--fake-modifier made-up-class--pseudo-modifier');
    });
    it('should not add modifiers for null, undefined or empty strings', () => {
      expect(classNameWithModifiers('made-up-class', [null, undefined, 'pseudo-modifier', ''])).toBe('made-up-class made-up-class--pseudo-modifier');
    });
  });
  describe('deserialiseJsonObject', () => {
    it('should deserialise a valid JSON object', () => {
      const serialised = '{"a": 1, "b": "hello world"}';
      const deserialised = {
        a: 1,
        b: 'hello world'
      };
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
});