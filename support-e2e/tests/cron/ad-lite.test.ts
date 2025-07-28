import test from '@playwright/test';
import { visitLandingPageAndCompleteCheckout } from '../utils/visitLandingPageAndCompleteCheckout';
import { TestDetails } from '../smoke/ad-lite.test';

const tests: TestDetails[] = [
	{
		paymentType: 'PayPal',
	},
];

test.describe('Ad Lite Checkout', () =>
	tests.map((testDetails: TestDetails) => {
		const { paymentType } = testDetails;

		test(`Ad-Lite - ${testDetails.paymentType}`, async ({
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
