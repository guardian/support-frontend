import test from '@playwright/test';
import { visitLandingPageAndCompleteCheckout } from '../utils/visitLandingPageAndCompleteCheckout';

const tests = [
	{
		paymentType: 'Credit/Debit card',
	},
	{
		paymentType: 'Direct debit',
	},
];

test.describe('Ad Lite Checkout', () =>
	tests.map((testDetails) => {
		const { paymentType } = testDetails;

		test(`GuardianAdLite - Monthly - ${paymentType} - UK`, async ({
			context,
			baseURL,
		}) => {
			await visitLandingPageAndCompleteCheckout(
				`/uk/guardian-ad-lite`,
				{
					context,
					baseURL,
					product: 'GuardianAdLite',
					paymentType,
					internationalisationId: 'UK',
				},
				async (page) => {
					// Transition from landing page to checkout:
					const purchaseButton = await page.getByText('Get Guardian Ad-Lite');
					await purchaseButton.click();
				},
			);
		});
	}));
