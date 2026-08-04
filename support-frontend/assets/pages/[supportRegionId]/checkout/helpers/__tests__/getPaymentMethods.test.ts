import { getPaymentMethods } from '../getPaymentMethods';

describe('getPaymentMethods', () => {
	it('Includes DirectDebit if the country ID is GB', () => {
		const countryId = 'GB';
		const productKey = 'SupporterPlus';
		const ratePlanKey = 'Annual';

		const result = getPaymentMethods(countryId, productKey, ratePlanKey);

		expect(result).toContain('DirectDebit');
	});

	it('Has Direct Debit and StripeHostedCheckout for Sunday newspaper subscription', () => {
		const countryId = 'GB';
		const productKey = 'HomeDelivery';
		const ratePlanKey = 'Sunday';

		const result = getPaymentMethods(countryId, productKey, ratePlanKey);

		expect(result).toEqual(['DirectDebit', 'StripeHostedCheckout']);
	});
	it('Includes PayPal for the monthly US DigitalSubscription', () => {
		const countryId = 'US';
		const productKey = 'DigitalSubscription';
		const ratePlanKey = 'Monthly';

		const result = getPaymentMethods(countryId, productKey, ratePlanKey);

		expect(result).toContain('PayPalCompletePayments');
	});
});
