// @flow

// ----- Setup ----- //

// Checks if localStorage is usable. Need to do more than check if
// 'window.localStorage' is defined, because Safari in private browsing
// mode is weird and sets the storage size to 0.
let localStorageAvailable = false;

try {

  localStorage.setItem('storageTest', 'testValue');
  localStorageAvailable = localStorage.getItem('storageTest') === 'testValue';

} catch (e) {
  localStorageAvailable = false;
}


// ----- Exports ----- //

export function setItem(key: string, item: string): void {

  if (localStorageAvailable) {
    localStorage.setItem(key, item);
  }

}

export function getItem(key: string): ?string {

  if (localStorageAvailable) {
    return localStorage.getItem(key);
  }

  return null;

}
