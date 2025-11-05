import test from '@playwright/test';
import { visitLandingPageAndCompleteCheckout } from '../utils/visitLandingPageAndCompleteCheckout';

const tests = [
	{
		paymentType: 'PayPal',
	},
];

test.describe('Ad Lite Checkout', () =>
	tests.map((testDetails) => {
		const { paymentType } = testDetails;

		test(`Ad-Lite - ${testDetails.paymentType}`, async ({
			context,
			baseURL,
		}) => {
			await visitLandingPageAndCompleteCheckout(
				`/uk/guardian-ad-lite`,
				{
					context,
					baseURL: baseURL,
					product: 'GuardianAdLite',
					paymentType,
					internationalisationId: 'UK',
				},
				async (page) => {
					// Transition from landing page to checkout:
					const purchaseButton = page.getByText('Get Guardian Ad-Lite');
					await purchaseButton.click();
				},
			);
		});
	}));
