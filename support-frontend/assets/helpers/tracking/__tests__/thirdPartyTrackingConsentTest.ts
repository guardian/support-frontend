// ----- Imports ----- //
import { onConsentChange as _onConsentChange } from '@guardian/libs';
import type { ConsentState } from '@guardian/libs';
import { onConsentChangeEvent } from '../thirdPartyTrackingConsent';

const onConsentChange = _onConsentChange as jest.Mock;
jest.mock('@guardian/libs', () => ({
	// eslint-disable-next-line -- ESLint doesn't understand jest.requireActual
	...jest.requireActual<typeof import('@guardian/libs')>('@guardian/libs'),
	onConsentChange: jest.fn(),
}));

jest.mock('helpers/utilities/logger', () => ({
	logException: jest.fn(),
}));

// ----- Tests ----- //
describe('thirdPartyTrackingConsent', () => {
	let dummyCallback: jest.Mock<unknown>;

	beforeEach(() => {
		dummyCallback = jest.fn();
	});
	afterEach(() => {
		jest.restoreAllMocks();
	});

	it('should call dummyCallback with false if onConsentChange throws an error', () => {
		onConsentChange.mockImplementation(() => {
			throw new Error('fail');
		});
		return onConsentChangeEvent(dummyCallback, {
			foo: '12345',
			bar: '54321',
		}).then(() => {
			expect(dummyCallback).toBeCalledWith({
				foo: false,
				bar: false,
			});
		});
	});

	describe('USNAT mode', () => {
		it('calls dummyCallback with false if CCPA doNotSell is true', async () => {
			onConsentChange.mockImplementation(
				(callback: (callback: ConsentState) => void) =>
					callback({
						usnat: {
							doNotSell: true,
						},
					} as ConsentState),
			);
			await onConsentChangeEvent(dummyCallback, {
				foo: '12345',
				bar: '54321',
			});

			expect(dummyCallback).toBeCalledWith({
				foo: false,
				bar: false,
			});
		});

		it('calls dummyCallback with true if USNAT doNotSell is false', async () => {
			onConsentChange.mockImplementation(
				(callback: (callback: ConsentState) => void) =>
					callback({
						usnat: {
							doNotSell: false,
						},
					} as ConsentState),
			);

			await onConsentChangeEvent(dummyCallback, {
				foo: '12345',
				bar: '54321',
			});

			expect(dummyCallback).toBeCalledWith({
				foo: true,
				bar: true,
			});
		});
	});

	describe('TCFv2 mode', () => {
		describe('when vendorIds provided', () => {
			it('calls dummyCallback with correct state for each vendor present in vendorConsents', async () => {
				onConsentChange.mockImplementation(
					(callback: (callback: ConsentState) => void) =>
						callback({
							tcfv2: {
								consents: {
									0: true,
									1: true,
									2: true,
								},
								vendorConsents: {
									12345: true,
									54321: false,
								},
								eventStatus: 'useractioncomplete',
								addtlConsent: '',
								gdprApplies: undefined,
								tcString: '',
							},
						} as unknown as ConsentState),
				);

				await onConsentChangeEvent(dummyCallback, {
					foo: '12345',
					bar: '54321',
				});

				expect(dummyCallback).toBeCalledWith({
					foo: true,
					bar: false,
				});
			});

			it('calls dummyCallback with correct true state from consents if vendor not present in vendorConsents', async () => {
				onConsentChange.mockImplementation(
					(callback: (callback: ConsentState) => void) =>
						callback({
							tcfv2: {
								consents: {
									0: true,
									1: true,
									2: true,
								},
								vendorConsents: {
									12345: true,
								},
								eventStatus: 'useractioncomplete',
								addtlConsent: '',
								tcString: '',
								gdprApplies: undefined,
							},
						} as unknown as ConsentState),
				);

				await onConsentChangeEvent(dummyCallback, {
					foo: '12345',
					bar: '54321',
				});

				expect(dummyCallback).toBeCalledWith({
					foo: true,
					bar: true,
				});
			});

			it('calls dummyCallback with correct false state from consents if vendor not present in vendorConsents', async () => {
				onConsentChange.mockImplementation(
					(callback: (callback: ConsentState) => void) =>
						callback({
							tcfv2: {
								consents: {
									0: false,
									1: true,
									2: true,
								},
								vendorConsents: {
									12345: true,
								},
								eventStatus: 'useractioncomplete',
								addtlConsent: '',
								tcString: '',
								gdprApplies: undefined,
							},
						} as unknown as ConsentState),
				);

				await onConsentChangeEvent(dummyCallback, {
					foo: '12345',
					bar: '54321',
				});

				expect(dummyCallback).toBeCalledWith({
					foo: true,
					bar: false,
				});
			});
		});
	});
});
