// ----- Imports ----- //
import { onConsentChange as _onConsentChange } from '@guardian/consent-management-platform';
import { onConsentChangeEvent } from '../thirdPartyTrackingConsent';

const onConsentChange: any = _onConsentChange;
jest.mock('@guardian/consent-management-platform', () => ({
	onConsentChange: jest.fn(),
}));
jest.mock('helpers/utilities/logger', () => ({
	logException: jest.fn(),
}));
// ----- Tests ----- //
describe('thirdPartyTrackingConsent', () => {
	let dummyCallback;
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
			foo: 12345,
			bar: 54321,
		}).then(() => {
			expect(dummyCallback).toBeCalledWith({
				foo: false,
				bar: false,
			});
		});
	});
	describe('CCPA mode', () => {
		it('calls dummyCallback with false if CCPA doNotSell is true', () => {
			onConsentChange.mockImplementation((callback) =>
				callback({
					ccpa: {
						doNotSell: true,
					},
				}),
			);
			return onConsentChangeEvent(dummyCallback, {
				foo: 12345,
				bar: 54321,
			}).then(() => {
				expect(dummyCallback).toBeCalledWith({
					foo: false,
					bar: false,
				});
			});
		});
		it('calls dummyCallback with true if CCPA doNotSell is false', () => {
			onConsentChange.mockImplementation((callback) =>
				callback({
					ccpa: {
						doNotSell: false,
					},
				}),
			);
			return onConsentChangeEvent(dummyCallback, {
				foo: 12345,
				bar: 54321,
			}).then(() => {
				expect(dummyCallback).toBeCalledWith({
					foo: true,
					bar: true,
				});
			});
		});
	});
	describe('TCFv2 mode', () => {
		describe('when vendorIds provided', () => {
			it('calls dummyCallback with correct state for each vendor present in vendorConsents', () => {
				onConsentChange.mockImplementation((callback) =>
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
						},
					}),
				);
				return onConsentChangeEvent(dummyCallback, {
					foo: 12345,
					bar: 54321,
				}).then(() => {
					expect(dummyCallback).toBeCalledWith({
						foo: true,
						bar: false,
					});
				});
			});
			it('calls dummyCallback with correct true state from consents if vendor not present in vendorConsents', () => {
				onConsentChange.mockImplementation((callback) =>
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
						},
					}),
				);
				return onConsentChangeEvent(dummyCallback, {
					foo: 12345,
					bar: 54321,
				}).then(() => {
					expect(dummyCallback).toBeCalledWith({
						foo: true,
						bar: true,
					});
				});
			});
			it('calls dummyCallback with correct false state from consents if vendor not present in vendorConsents', () => {
				onConsentChange.mockImplementation((callback) =>
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
						},
					}),
				);
				return onConsentChangeEvent(dummyCallback, {
					foo: 12345,
					bar: 54321,
				}).then(() => {
					expect(dummyCallback).toBeCalledWith({
						foo: true,
						bar: false,
					});
				});
			});
		});
	});
});
