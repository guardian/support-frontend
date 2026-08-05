import { storage } from '@guardian/libs';

// ----- Functions ----- //
function setLocal(key: string, value: unknown): void {
	storage.local.isAvailable() && storage.local.set(key, value);
}

function getLocal(key: string): string | null | undefined {
	let data;

	if (!storage.local.isAvailable()) {
		return null;
	}

	data = storage.local.get(key) as string | null | undefined;

	if (!data) {
		data = window.localStorage.getItem(key) as string | null | undefined;
	}

	return data;
}

function setSession(key: string, value: unknown): void {
	storage.session.isAvailable() && storage.session.set(key, value);
}

function getSession(key: string): string | null | undefined {
	let data;

	if (!storage.session.isAvailable()) {
		return null;
	}

	data = storage.session.get(key) as string | null | undefined;

	if (!data) {
		data = window.sessionStorage.getItem(key) as string | null | undefined;
	}

	return data;
}

// ----- Exports ----- //
export { setLocal, getLocal, setSession, getSession };
