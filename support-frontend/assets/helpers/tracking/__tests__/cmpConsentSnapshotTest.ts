import { cmp, onConsent } from '@guardian/consent-manager';
import type { ConsentState } from '@guardian/consent-manager';
import { readCmpConsentSnapshot } from '../cmpConsentSnapshot';

jest.mock('@guardian/consent-manager', () => ({
	cmp: { version: 'test-version' },
	onConsent: jest.fn(),
}));

const mockOnConsent = jest.mocked(onConsent);

describe('readCmpConsentSnapshot', () => {
	afterEach(() => {
		jest.clearAllTimers();
		jest.useRealTimers();
		jest.resetAllMocks();
	});

	it('captures TCFv2 purposes, vendors, jurisdiction, GPC, and CMP metadata', async () => {
		const state: ConsentState = {
			framework: 'tcfv2',
			canTarget: true,
			gpcSignal: true,
			tcfv2: {
				gdprApplies: true,
				consents: { '1': true, '4': false },
				vendorConsents: { '755': true, '999': false },
				eventStatus: 'useractioncomplete',
				addtlConsent: '1~755',
				tcString: 'encoded-consent',
			},
		};
		mockOnConsent.mockResolvedValue(state);

		const snapshot = await readCmpConsentSnapshot();

		expect(snapshot).toMatchObject({
			framework: 'tcfv2',
			consentManagerVersion: cmp.version,
			gpcSignal: true,
			tcfv2: {
				gdprApplies: true,
				consents: { '1': true, '4': false },
				vendorConsents: { '755': true, '999': false },
				eventStatus: 'useractioncomplete',
				addtlConsent: '1~755',
				tcString: 'encoded-consent',
			},
		});
		expect(snapshot).not.toHaveProperty('canTarget');
		expect(snapshot).toHaveProperty('capturedAt');
	});

	it('captures USNAT do-not-sell choice and signal status', async () => {
		mockOnConsent.mockResolvedValue({
			framework: 'usnat',
			canTarget: false,
			gpcSignal: false,
			usnat: { doNotSell: true, signalStatus: 'ready' },
		});

		await expect(readCmpConsentSnapshot()).resolves.toMatchObject({
			framework: 'usnat',
			gpcSignal: false,
			usnat: { doNotSell: true, signalStatus: 'ready' },
		});
	});

	it('captures AUS personalised advertising choice and signal status', async () => {
		mockOnConsent.mockResolvedValue({
			framework: 'aus',
			canTarget: false,
			aus: { personalisedAdvertising: false, signalStatus: 'ready' },
		});

		await expect(readCmpConsentSnapshot()).resolves.toMatchObject({
			framework: 'aus',
			aus: { personalisedAdvertising: false, signalStatus: 'ready' },
		});
	});

	it('returns null for an unknown framework', async () => {
		mockOnConsent.mockResolvedValue({
			framework: null,
			canTarget: false,
		} as ConsentState);

		await expect(readCmpConsentSnapshot()).resolves.toBeNull();
	});

	it('returns null when an active framework has incomplete choices', async () => {
		mockOnConsent.mockResolvedValue({
			framework: 'tcfv2',
			canTarget: true,
			tcfv2: {
				gdprApplies: true,
				consents: {},
				vendorConsents: {},
				eventStatus: 'useractioncomplete',
				addtlConsent: '',
				tcString: 'encoded-consent',
			},
		});

		await expect(readCmpConsentSnapshot()).resolves.toBeNull();
	});

	it('returns null when the consent manager rejects', async () => {
		mockOnConsent.mockRejectedValue(new Error('consent unavailable'));

		await expect(readCmpConsentSnapshot()).resolves.toBeNull();
	});

	it('returns null after a bounded read when consent is unavailable', async () => {
		jest.useFakeTimers();
		mockOnConsent.mockReturnValue(new Promise(() => undefined));

		const snapshotPromise = readCmpConsentSnapshot();
		await jest.advanceTimersByTimeAsync(1000);

		await expect(snapshotPromise).resolves.toBeNull();
	});

	it('reads the latest consent state when called for submission', async () => {
		let currentState: ConsentState = {
			framework: 'usnat',
			canTarget: true,
			usnat: { doNotSell: false, signalStatus: 'ready' },
		};
		mockOnConsent.mockImplementation(() => Promise.resolve(currentState));

		await readCmpConsentSnapshot();
		currentState = {
			framework: 'usnat',
			canTarget: false,
			usnat: { doNotSell: true, signalStatus: 'ready' },
		};

		await expect(readCmpConsentSnapshot()).resolves.toMatchObject({
			usnat: { doNotSell: true },
		});
	});
});
