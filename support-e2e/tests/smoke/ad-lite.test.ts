import test from '@playwright/test';
import { visitLandingPageAndCompleteCheckout } from '../utils/visitLandingPageAndCompleteCheckout';

export type TestDetails = {
	paymentType: string;
};

const tests: TestDetails[] = [
	{
		paymentType: 'Credit/Debit card',
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
