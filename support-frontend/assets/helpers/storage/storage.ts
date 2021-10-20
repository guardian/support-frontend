// ----- Setup ----- //
// Checks if local/sessionStorage is usable. Need to do more than check if
// 'window.localStorage' is defined, because Safari <11 in private browsing
// mode is weird and sets the storage size to 0.
function isStorageAvailable(storage): boolean {
	try {
		storage.setItem('storageTest', 'testValue');

		if (storage.getItem('storageTest') === 'testValue') {
			storage.removeItem('storageTest');
			return true;
		}

		return false;
	} catch (e) {
		return false;
	}
}

const SESSION_AVAILABLE = isStorageAvailable(window.sessionStorage);
const LOCAL_AVAILABLE = isStorageAvailable(window.localStorage);

// ----- Functions ----- //
function setLocal(key: string, item: string): void {
	if (LOCAL_AVAILABLE) {
		localStorage.setItem(key, item);
	}
}

function getLocal(key: string): string | null | undefined {
	if (LOCAL_AVAILABLE) {
		return localStorage.getItem(key);
	}

	return null;
}

function setSession(key: string, item: string): void {
	if (SESSION_AVAILABLE) {
		sessionStorage.setItem(key, item);
	}
}

function getSession(key: string): string | null | undefined {
	if (SESSION_AVAILABLE) {
		return sessionStorage.getItem(key);
	}

	return null;
}

// ----- Exports ----- //
export { setLocal, getLocal, setSession, getSession };
