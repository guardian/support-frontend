// @flow

// ----- Setup ----- //

// Checks if local/sessionStorage is usable. Need to do more than check if
// 'window.localStorage' is defined, because Safari in private browsing
// mode is weird and sets the storage size to 0.
let localAvailable = false;
let sessionAvailable = false;

try {

  localStorage.setItem('storageTest', 'testValue');
  localAvailable = localStorage.getItem('storageTest') === 'testValue';

} catch (e) {
  localAvailable = false;
}

try {

  sessionStorage.setItem('storageTest', 'testValue');
  sessionAvailable = sessionStorage.getItem('storageTest') === 'testValue';

} catch (e) {
  sessionAvailable = false;
}


// ----- Exports ----- //

function setLocal(key: string, item: string): void {

  if (localAvailable) {
    localStorage.setItem(key, item);
  }

}

function getLocal(key: string): ?string {

  if (localAvailable) {
    return localStorage.getItem(key);
  }

  return null;

}

function setSession(key: string, item: string): void {

  if (sessionAvailable) {
    sessionStorage.setItem(key, item);
  }

}

function getSession(key: string): ?string {

  if (sessionAvailable) {
    return sessionStorage.getItem(key);
  }

  return null;

}


// ----- Exports ----- //

export {
  setLocal,
  getLocal,
  setSession,
  getSession,
};
