// ----- Imports ----- //
import { storage } from '@guardian/libs';
import { getLocal, getSession, setLocal, setSession } from '../storage';

// ----- Tests ----- //
describe('storage', () => {
	beforeEach(() => {
		jest.restoreAllMocks();
	});

	describe('setLocal', () => {
		it('sets a value in local storage when available', () => {
			const setSpy = jest.spyOn(storage.local, 'set');
			setLocal('myKey', 'myValue');
			expect(setSpy).toHaveBeenCalledWith('myKey', 'myValue');
		});

		it('does not set a value when local storage is unavailable', () => {
			jest.spyOn(storage.local, 'isAvailable').mockReturnValue(false);
			const setSpy = jest.spyOn(storage.local, 'set');
			setLocal('myKey', 'myValue');
			expect(setSpy).not.toHaveBeenCalled();
		});
	});

	describe('getLocal', () => {
		it('returns value from @guardian/libs storage when present', () => {
			setLocal('myKey', { foo: 'bar' });
			expect(getLocal('myKey')).toEqual({ foo: 'bar' });
		});

		it('falls back to window.localStorage when @guardian/libs returns falsy', () => {
			window.localStorage.setItem('myKey', JSON.stringify({ fallback: true }));
			expect(getLocal('myKey')).toEqual({ fallback: true });
		});

		it('parses a JSON string from window.localStorage', () => {
			window.localStorage.setItem('myKey', '"plainString"');
			expect(getLocal('myKey')).toBe('plainString');
		});

		it('returns null when window.localStorage has invalid JSON', () => {
			const consoleSpy = jest
				.spyOn(console, 'error')
				.mockImplementation(() => {});

			window.localStorage.setItem('myKey', 'not-json');
			expect(getLocal('myKey')).toBeNull();
			expect(consoleSpy).toHaveBeenCalled();
		});

		it('returns null when neither source has the key', () => {
			expect(getLocal('missing')).toBeNull();
		});
	});

	describe('setSession', () => {
		it('sets a value in session storage when available', () => {
			const setSpy = jest.spyOn(storage.session, 'set');
			jest.spyOn(storage.session, 'isAvailable').mockReturnValue(true);
			setSession('myKey', 'myValue');
			expect(setSpy).toHaveBeenCalledWith('myKey', 'myValue');
		});

		it('does not set a value when session storage is unavailable', () => {
			jest.spyOn(storage.session, 'isAvailable').mockReturnValue(false);
			const setSpy = jest.spyOn(storage.session, 'set');
			setSession('myKey', 'myValue');
			expect(setSpy).not.toHaveBeenCalled();
		});
	});

	describe('getSession', () => {
		it('returns value from @guardian/libs storage when present', () => {
			const getSpy = jest.spyOn(storage.session, 'get');
			setSession('myKey', { session: 'data' });
			expect(getSession('myKey')).toEqual({ session: 'data' });
			expect(getSpy).toHaveBeenCalledWith('myKey');
		});

		it('returns a string value from @guardian/libs storage', () => {
			storage.session.set('myKey', 'sessionString');
			expect(getSession('myKey')).toBe('sessionString');
		});

		it('falls back to window.sessionStorage when @guardian/libs returns falsy', () => {
			window.sessionStorage.setItem(
				'myKey',
				JSON.stringify({ fallback: true }),
			);
			expect(getSession('myKey')).toEqual({ fallback: true });
		});

		it('parses a JSON string from window.sessionStorage', () => {
			window.sessionStorage.setItem('myKey', '"plainString"');
			expect(getSession('myKey')).toBe('plainString');
		});

		it('returns null when window.sessionStorage has invalid JSON', () => {
			const consoleSpy = jest
				.spyOn(console, 'error')
				.mockImplementation(() => {});

			window.sessionStorage.setItem('myKey', 'not-json');
			expect(getSession('myKey')).toBeNull();
			expect(consoleSpy).toHaveBeenCalled();
		});

		it('returns null when session storage is unavailable', () => {
			jest.spyOn(storage.session, 'isAvailable').mockReturnValue(false);
			const getSpy = jest.spyOn(storage.session, 'get');
			expect(getSession('myKey')).toBeNull();
			expect(getSpy).not.toHaveBeenCalled();
		});

		it('returns null when neither source has the key', () => {
			jest.spyOn(storage.session, 'isAvailable').mockReturnValue(true);
			jest.spyOn(storage.session, 'get').mockReturnValue(null);
			expect(getSession('missing')).toBeNull();
		});
	});
});
