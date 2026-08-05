// ----- Imports ----- //
import { storage } from '@guardian/libs';
import { getLocal, getSession, setLocal, setSession } from '../storage';

jest.mock('@guardian/libs', () => ({
	storage: {
		local: {
			isAvailable: jest.fn(),
			get: jest.fn(),
			set: jest.fn(),
		},
		session: {
			isAvailable: jest.fn(),
			get: jest.fn(),
			set: jest.fn(),
		},
	},
}));

const mockLocal = storage.local as jest.Mocked<typeof storage.local>;
const mockSession = storage.session as jest.Mocked<typeof storage.session>;

// ----- Tests ----- //
describe('storage', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe('setLocal', () => {
		it('sets a value in local storage when available', () => {
			mockLocal.isAvailable.mockReturnValue(true);
			setLocal('myKey', 'myValue');
			expect(mockLocal.set).toHaveBeenCalledWith('myKey', 'myValue');
		});

		it('does not set a value when local storage is unavailable', () => {
			mockLocal.isAvailable.mockReturnValue(false);
			setLocal('myKey', 'myValue');
			expect(mockLocal.set).not.toHaveBeenCalled();
		});
	});

	describe('getLocal', () => {
		it('returns the value from local storage when available', () => {
			mockLocal.isAvailable.mockReturnValue(true);
			mockLocal.get.mockReturnValue('storedValue');
			expect(getLocal('myKey')).toBe('storedValue');
			expect(mockLocal.get).toHaveBeenCalledWith('myKey');
		});

		it('returns null when local storage is unavailable', () => {
			mockLocal.isAvailable.mockReturnValue(false);
			expect(getLocal('myKey')).toBeNull();
			expect(mockLocal.get).not.toHaveBeenCalled();
		});

		it('returns null when the key does not exist', () => {
			mockLocal.isAvailable.mockReturnValue(true);
			mockLocal.get.mockReturnValue(null);
			expect(getLocal('missing')).toBeNull();
		});
	});

	describe('setSession', () => {
		it('sets a value in session storage when available', () => {
			mockSession.isAvailable.mockReturnValue(true);
			setSession('myKey', 'myValue');
			expect(mockSession.set).toHaveBeenCalledWith('myKey', 'myValue');
		});

		it('does not set a value when session storage is unavailable', () => {
			mockSession.isAvailable.mockReturnValue(false);
			setSession('myKey', 'myValue');
			expect(mockSession.set).not.toHaveBeenCalled();
		});
	});

	describe('getSession', () => {
		it('returns the value from session storage when available', () => {
			mockSession.isAvailable.mockReturnValue(true);
			mockSession.get.mockReturnValue('sessionValue');
			expect(getSession('myKey')).toBe('sessionValue');
			expect(mockSession.get).toHaveBeenCalledWith('myKey');
		});

		it('returns null when session storage is unavailable', () => {
			mockSession.isAvailable.mockReturnValue(false);
			expect(getSession('myKey')).toBeNull();
			expect(mockSession.get).not.toHaveBeenCalled();
		});

		it('returns null when the key does not exist', () => {
			mockSession.isAvailable.mockReturnValue(true);
			mockSession.get.mockReturnValue(null);
			expect(getSession('missing')).toBeNull();
		});
	});
});
