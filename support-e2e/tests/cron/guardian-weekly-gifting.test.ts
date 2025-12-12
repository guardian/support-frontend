import test from '@playwright/test';
import { visitLandingPageAndCompleteCheckout } from '../utils/visitLandingPageAndCompleteCheckout';

const giftTests = [
	{
		product: 'GuardianWeeklyDomestic',
		ratePlan: '3MonthGift',
		paymentType: 'PayPal',
		internationalisationId: 'UK',
	},
	{
		product: 'GuardianWeeklyDomestic',
		ratePlan: 'OneYearGift',
		paymentType: 'PayPal',
		internationalisationId: 'US',
	},
	{
		product: 'GuardianWeeklyRestOfWorld',
		ratePlan: 'OneYearGift',
		paymentType: 'PayPal',
		internationalisationId: 'INT',
		billingCountry: 'United States',
	},
];

test.describe('Guardian Weekly Gift Checkout', () =>
	giftTests.map((testDetails) => {
		const {
			ratePlan,
			product,
			paymentType,
			internationalisationId,
			billingCountry,
		} = testDetails;
		const countries = `${internationalisationId}${billingCountry ? ` / ${billingCountry}` : ''}`;
		const giftPeriod = ratePlan === '3MonthGift' ? '3 months' : '12 months';
		test(`${product} - ${ratePlan} - ${paymentType} - ${countries}`, async ({
			context,
			baseURL,
		}) => {
			await visitLandingPageAndCompleteCheckout(
				`/${internationalisationId.toLowerCase()}/subscribe/weekly/gift`,
				{
					context,
					baseURL,
					product,
					ratePlan,
					paymentType,
					internationalisationId,
				},
				async (page) => {
					// Transition from landing page to checkout:

					// Click through to the checkout (we use the aria-label to target the link)
					await page
						.getByLabel(`${giftPeriod}- Subscribe now`, { exact: true })
						.click();
				},
			);
		});
	}));
