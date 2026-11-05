// ----- Imports ----- //
import { DirectDebit } from '../../forms/paymentMethods';
import {
	_,
	init,
	successfulContributionConversion,
} from '../googleTagManager';
import { onConsentChangeEvent } from '../thirdPartyTrackingConsent';

jest.mock('../thirdPartyTrackingConsent', () => ({
	onConsentChangeEvent: jest.fn(() => Promise.resolve()),
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

	it('keeps conversions queued until consent and script readiness', async () => {
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
		const updateConsent = jest.mocked(onConsentChangeEvent).mock.calls[0]?.[0];
		expect(updateConsent).toBeDefined();
		updateConsent?.({});
		expect(window.googleTagManagerDataLayer).toBeUndefined();
		expect(
			document.querySelector('script[src*="googletagmanager.com/gtm.js"]'),
		).toBeNull();

		updateConsent?.({ 'google-tag-manager': true });
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
		expect(
			Object.keys(conversion ?? {}).sort(),
		).toEqual(
			[
				'event',
				'value',
				'currency',
				'paymentMethod',
				'contributionType',
				'productType',
				'orderId',
				'thirdPartyTrackingConsent',
				'campaignCodeBusinessUnit',
				'campaignCodeTeam',
				'internalCampaignCode',
				'vendorConsentsLookup',
			].sort(),
		);
		expect(
			window.googleTagManagerDataLayer?.filter(
				(event) => event.event === 'SuccessfulConversion',
			),
		).toHaveLength(1);
	});
});
