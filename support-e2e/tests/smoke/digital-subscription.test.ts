import test from '@playwright/test';
import { visitLandingPageAndCompleteCheckout } from '../utils/visitLandingPageAndCompleteCheckout';

export type TestDetails = {
	productLabel: string;
	paymentType: string;
	product: string;
	billingFrequency: string;
	internationalisationId: string;
};

const tests: TestDetails[] = [
	{
		productLabel: 'Digital Subscription',
		product: 'DigitalSubscription',
		billingFrequency: 'Annual',
		paymentType: 'Credit/Debit card',
		internationalisationId: 'UK',
	},
	{
		productLabel: 'Digital Subscription',
		product: 'DigitalSubscription',
		billingFrequency: 'Monthly',
		paymentType: 'Credit/Debit card',
		internationalisationId: 'US',
	},
];

test.describe('Digital Subscription Checkout', () =>
	tests.map((testDetails: TestDetails) => {
		const {
			billingFrequency,
			product,
			paymentType,
			internationalisationId,
			productLabel,
		} = testDetails;

		test(`Digital Subscription - ${product} - ${billingFrequency} - ${paymentType} - ${internationalisationId}`, async ({
			context,
			baseURL,
		}) => {
			await visitLandingPageAndCompleteCheckout(
				`/${internationalisationId.toLowerCase()}/checkout`,
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
