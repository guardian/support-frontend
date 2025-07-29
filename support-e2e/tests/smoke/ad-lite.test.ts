import test from '@playwright/test';
import { visitLandingPageAndCompleteCheckout } from '../utils/visitLandingPageAndCompleteCheckout';

const tests = [
	{
		product: 'GuardianAdLite',
		paymentType: 'Credit/Debit card',
		internationalisationId: 'UK',
	},
	{
		product: 'GuardianAdLite',
		paymentType: 'Direct debit',
		internationalisationId: 'UK',
	},
];

test.describe('Ad Lite Checkout', () =>
	tests.map((testDetails) => {
		const { product, paymentType, internationalisationId } = testDetails;

		test(`Ad-Lite - Monthly - ${paymentType} - ${internationalisationId}`, async ({
			context,
			baseURL,
		}) => {
			await visitLandingPageAndCompleteCheckout(
				`/uk/guardian-ad-lite`,
				{
					context,
					baseURL,
					product,
					paymentType,
					internationalisationId,
				},
				async (page) => {
					// Transition from landing page to checkout:
					const purchaseButton = await page.getByText('Get Guardian Ad-Lite');
					await purchaseButton.click();
				},
			);
		});
	}));
