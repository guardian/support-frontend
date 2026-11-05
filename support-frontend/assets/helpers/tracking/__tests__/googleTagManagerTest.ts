// ----- Imports ----- //
import { DirectDebit } from '../../forms/paymentMethods';
import {
	_,
	init,
	successfulContributionConversion,
} from '../googleTagManager';

jest.mock('../thirdPartyTrackingConsent', () => ({
	onConsentChangeEvent: jest.fn(
		(callback: (consents: Record<string, boolean>) => void) => {
			callback({ 'google-tag-manager': true });
			return Promise.resolve();
		},
	),
}));

const { mapFields } = _;

// ----- Tests ----- //
jest.mock('@guardian/ophan-tracker-js', () => ({
	getViewId: () => '123456',
}));

describe('googleTagManager', () => {
	it('should map a support frontend PaymentMethod type to Ophan payment methods', () => {
		const input = {
			orderId: 1,
			currency: 'GBP',
			paymentMethod: DirectDebit,
		};
		const mapped = mapFields(input);

		expect(mapped.paymentMethod).toEqual('Gocardless');
		expect(mapped.currency).toEqual('GBP');
		expect(mapped.orderId).toEqual(1);
		expect(Object.keys(mapped).length).toEqual(Object.keys(input).length);
	});

	it('keeps conversion data queued until consent and script readiness, without identity fields', async () => {
		Object.defineProperty(window, 'googleTagManagerDataLayer', {
			configurable: true,
			value: undefined,
			writable: true,
		});
		window.sessionStorage.clear();
		document.head.innerHTML = '<script></script>';

		successfulContributionConversion(
			12,
			'MONTHLY',
			'GBP',
			DirectDebit,
			'SupporterPlus',
		);
		expect(window.googleTagManagerDataLayer).toBeUndefined();

		await init();
		expect(window.googleTagManagerDataLayer).not.toEqual(
			expect.arrayContaining([
				expect.objectContaining({ event: 'SuccessfulConversion' }),
			]),
		);

		const script = document.querySelector<HTMLScriptElement>(
			'script[src*="googletagmanager.com/gtm.js"]',
		);
		expect(script).not.toBeNull();
		script?.onload?.(new Event('load'));

		const conversion = window.googleTagManagerDataLayer?.find(
			(event) => event.event === 'SuccessfulConversion',
		);
		expect(conversion).toEqual(
			expect.objectContaining({
				event: 'SuccessfulConversion',
				value: 12,
				currency: 'GBP',
				paymentMethod: 'Gocardless',
				contributionType: 'MONTHLY',
				productType: 'SupporterPlus',
				thirdPartyTrackingConsent: 'OptedIn',
			}),
		);
		expect(typeof conversion?.orderId).toBe('string');
		expect(conversion).not.toHaveProperty('email');
		expect(conversion).not.toHaveProperty('firstName');
	});
});
