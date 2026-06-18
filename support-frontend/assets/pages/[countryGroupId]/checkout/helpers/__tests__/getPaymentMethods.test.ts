import { getPaymentMethods } from '../getPaymentMethods';

describe('getPaymentMethods', () => {
	it('Includes DirectDebit if the country ID is GB', () => {
		const countryId = 'GB';
		const productKey = 'SupporterPlus';
		const ratePlanKey = 'Annual';

		const result = getPaymentMethods(countryId, productKey, ratePlanKey, {});

		expect(result).toContain('DirectDebit');
	});

	it('Has Direct Debit and StripeHostedCheckout for Sunday newspaper subscription', () => {
		const countryId = 'GB';
		const productKey = 'HomeDelivery';
		const ratePlanKey = 'Sunday';

		const result = getPaymentMethods(countryId, productKey, ratePlanKey, {});

		expect(result).toEqual(['DirectDebit', 'StripeHostedCheckout']);
	});

	it('Includes PayPal if the user is not in variant of the paypalMigrationRecurring AB test', () => {
		const countryId = 'US';
		const productKey = 'DigitalSubscription';
		const ratePlanKey = 'Monthly';
		const participations = {
			paypalMigrationRecurring: 'control',
		};

		const result = getPaymentMethods(
			countryId,
			productKey,
			ratePlanKey,
			participations,
		);

		expect(result).toContain('PayPal');
	});

	it('Includes PayPal if the user is in the variant of the paypalMigrationRecurring AB test', () => {
		const countryId = 'US';
		const productKey = 'DigitalSubscription';
		const ratePlanKey = 'Monthly';
		const participations = {
			paypalMigrationRecurring: 'variant',
		};

		const result = getPaymentMethods(
			countryId,
			productKey,
			ratePlanKey,
			participations,
		);

		expect(result).toContain('PayPalCompletePayments');
	});
});
