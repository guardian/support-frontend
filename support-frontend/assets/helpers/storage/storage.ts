import { storage } from '@guardian/libs';

// ----- Functions ----- //
function setLocal(key: string, value: unknown): void {
	storage.local.isAvailable() && storage.local.set(key, value);
}

function getLocal(key: string): unknown {
	let data;

	if (!storage.local.isAvailable()) {
		return null;
	}

	data = storage.local.get(key);

	if (!data) {
		const item = window.localStorage.getItem(key);
		try {
			data = item && (JSON.parse(item) as unknown);
		} catch (error) {
			console.error(`Failed to parse ${key} from local storage`, error);
			return null;
		}
	}

	return data;
}

function setSession(key: string, value: unknown): void {
	storage.session.isAvailable() && storage.session.set(key, value);
}

function getSession(key: string): unknown {
	let data;

	if (!storage.session.isAvailable()) {
		return null;
	}

	data = storage.session.get(key);

	if (!data) {
		const item = window.sessionStorage.getItem(key);
		try {
			data = item && (JSON.parse(item) as unknown);
		} catch (error) {
			console.error(`Failed to parse ${key} from session storage`, error);
			return null;
		}
	}

	return data;
}

// ----- Exports ----- //
export { setLocal, getLocal, setSession, getSession };
