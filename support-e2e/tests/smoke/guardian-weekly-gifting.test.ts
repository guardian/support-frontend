import test from '@playwright/test';
import { visitLandingPageAndCompleteCheckout } from '../utils/visitLandingPageAndCompleteCheckout';

const giftingTests = [
	{
		product: 'GuardianWeeklyDomestic',
		ratePlan: 'Monthly',
		paymentType: 'Credit/Debit card',
		internationalisationId: 'UK',
	},
	{
		product: 'GuardianWeeklyDomestic',
		ratePlan: 'Annual',
		paymentType: 'Direct debit',
		internationalisationId: 'UK',
	},
	{
		product: 'GuardianWeeklyDomestic',
		ratePlan: 'Quarterly',
		paymentType: 'Credit/Debit card',
		internationalisationId: 'NZ',
	},
	{
		product: 'GuardianWeeklyDomestic',
		ratePlan: 'Monthly',
		paymentType: 'Credit/Debit card',
		internationalisationId: 'US',
	},
	{
		product: 'GuardianWeeklyRestOfWorld',
		ratePlan: 'Annual',
		paymentType: 'Credit/Debit card',
		internationalisationId: 'INT',
	},
	{
		product: 'GuardianWeeklyDomestic',
		ratePlan: 'Quarterly',
		paymentType: 'Credit/Debit card',
		internationalisationId: 'AU',
	},
];

test.describe('Guardian Weekly Gifting Checkout', () =>
	giftingTests.map((testDetails) => {
		const { ratePlan, product, paymentType, internationalisationId } =
			testDetails;

		test(`${product} - ${ratePlan} - ${paymentType} - ${internationalisationId}`, async ({
			context,
			baseURL,
		}) => {
			await visitLandingPageAndCompleteCheckout(
				`/${internationalisationId.toLowerCase()}/subscribe/weekly`,
				{ context, baseURL, product, paymentType, internationalisationId },
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
