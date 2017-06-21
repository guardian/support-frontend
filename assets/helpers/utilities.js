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

// Checks if localStorage is usable. Need to do more than check if
// 'window.localStorage' is defined, because Safari in private browsing
// mode is weird and sets the storage size to 0.
export function localStorageAvailable(): boolean {

  try {

    localStorage.setItem('storageTest', 'testValue');
    return localStorage.getItem('storageTest') === 'testValue';

  } catch (e) {
    return false;
  }

}
