import test, { expect } from '@playwright/test';
import { setupPage } from '../utils/page';
import { completeCheckout } from './checkout';

export type TestDetails = {
	paymentType: string;
	ratePlan: string;
};

export const testAdLiteCheckout = (testDetails: TestDetails) =>
	test(`Ad-Lite - ${testDetails.paymentType}`, async ({ context, baseURL }) => {
		const landingPageUrl = '/uk/guardian-ad-lite';
		const page = await context.newPage();
		await setupPage(page, context, baseURL, landingPageUrl);

		// Click through to the checkout
		const purchaseButton = await page.getByText('Get Guardian Ad-Lite');
		await purchaseButton.click();

		// Wait for the checkout page to load
		await expect(
			page.getByRole('heading', { name: 'Your subscription' }),
		).toBeVisible({
			timeout: 100000,
		});

		await completeCheckout(page, {
			product: 'GuardianAdLite',
			ratePlan: testDetails.ratePlan,
			paymentType: testDetails.paymentType,
			internationalisationId: 'UK',
		});
	});
