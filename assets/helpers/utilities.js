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
