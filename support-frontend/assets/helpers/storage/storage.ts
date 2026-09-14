import { storage } from '@guardian/libs';
import type { ZodType } from 'zod';

// ----- Functions ----- //
function setLocal(key: string, value: unknown): void {
	storage.local.isAvailable() && storage.local.set(key, value);
}

function getLocal(key: string): unknown {
	if (!storage.local.isAvailable()) {
		return null;
	}

	const data = storage.local.get(key);

	if (data !== null && data !== undefined) {
		return data;
	}

	try {
		const item = window.localStorage.getItem(key);
		const data = item && (JSON.parse(item) as unknown);
		return data ?? null;
	} catch (error) {
		console.error(`Failed to parse ${key} from local storage`, error);
		return null;
	}
}

function setSession(key: string, value: unknown): void {
	storage.session.isAvailable() && storage.session.set(key, value);
}

function getSession<T>(key: string, schema: ZodType<T>): T | null {
	if (!storage.session.isAvailable()) {
		return null;
	}

	const data = storage.session.get(key);

	if (data !== null && data !== undefined) {
		const result = schema.safeParse(data);
		return result.success ? result.data : null;
	}

	try {
		const item = window.sessionStorage.getItem(key);
		const data = item && (JSON.parse(item) as unknown);
		const result = schema.safeParse(data ?? null);
		return result.success ? result.data : null;
	} catch (error) {
		console.error(`Failed to parse ${key} from session storage`, error);
		return null;
	}
}

// ----- Exports ----- //
export { setLocal, getLocal, setSession, getSession };
