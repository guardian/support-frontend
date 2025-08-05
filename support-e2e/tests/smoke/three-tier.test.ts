import test from '@playwright/test';
import { visitLandingPageAndCompleteCheckout } from '../utils/visitLandingPageAndCompleteCheckout';

const tests = [
	{
		productLabel: 'Support',
		product: 'Contribution',
		billingFrequency: 'Monthly',
		paymentType: 'Direct debit',
		internationalisationId: 'UK',
	},
	{
		productLabel: 'Support',
		product: 'Contribution',
		billingFrequency: 'Annual',
		paymentType: 'Credit/Debit card',
		internationalisationId: 'CA',
	},
	{
		productLabel: 'All-access digital',
		product: 'SupporterPlus',
		billingFrequency: 'Monthly',
		paymentType: 'Credit/Debit card',
		internationalisationId: 'US',
	},
	{
		productLabel: 'Digital + print',
		product: 'TierThree',
		billingFrequency: 'Annual',
		paymentType: 'Credit/Debit card',
		internationalisationId: 'EU',
	},
];

test.describe('Three Tier Checkout', () =>
	tests.map((testDetails) => {
		const {
			billingFrequency,
			product,
			paymentType,
			internationalisationId,
			productLabel,
		} = testDetails;

		test(`Three Tier - ${product} - ${billingFrequency} - ${paymentType} - ${internationalisationId}`, async ({
			context,
			baseURL,
		}) => {
			await visitLandingPageAndCompleteCheckout(
				`/${internationalisationId.toLowerCase()}/contribute`,
				{ context, baseURL, product, paymentType, internationalisationId },
				async (page) => {
					// Transition from landing page to checkout:

					// 1. Select the billing frequency
					await page.getByRole('tab', { name: billingFrequency }).click();

					// 2. Click through to the checkout (we use the aria-label to target the link)
					await page.getByLabel(productLabel, { exact: true }).click();
				},
			);
		});
	}));
