import test from '@playwright/test';
import { visitLandingPageAndCompleteCheckout } from '../utils/visitLandingPageAndCompleteCheckout';

const tests = [
	{
		product: 'GuardianWeeklyDomestic',
		ratePlan: 'Monthly',
		paymentType: 'PayPal',
		internationalisationId: 'US',
		postCode: '60601',
	},
	{
		product: 'GuardianWeeklyRestOfWorld',
		ratePlan: 'Annual',
		paymentType: 'PayPal',
		internationalisationId: 'INT',
		postCode: '8001',
		billingCountry: 'United States',
	},
	{
		product: 'GuardianWeeklyDomestic',
		ratePlan: 'Quarterly',
		paymentType: 'PayPal',
		internationalisationId: 'UK',
		postCode: 'BN44 3QG',
	},
];

test.describe('Guardian Weekly Checkout', () =>
	tests.map((testDetails) => {
		const {
			ratePlan,
			product,
			paymentType,
			internationalisationId,
			postCode,
			billingCountry,
		} = testDetails;
		const countries = `${internationalisationId}${billingCountry ? ` / ${billingCountry}` : ''}`;
		test(`Guardian Weekly - ${ratePlan} - ${paymentType} - ${countries}`, async ({
			context,
			baseURL,
		}) => {
			await visitLandingPageAndCompleteCheckout(
				`/${internationalisationId.toLowerCase()}/subscribe/weekly`,
				{
					context,
					baseURL,
					product,
					paymentType,
					internationalisationId,
					postCode,
				},
				async (page) => {
					// Transition from landing page to checkout:

					// Click through to the checkout (we use the aria-label to target the link)
					await page
						.getByLabel(`${ratePlan}- Subscribe now`, { exact: true })
						.click();
				},
			);
		});
	}));
