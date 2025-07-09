import test, { expect } from '@playwright/test';
import { setupPage } from '../utils/page';
import { completeGenericCheckout } from '../utils/completeGenericCheckout';

export type TestDetails = {
	productLabel: string;
	paymentType: string;
	product: string;
	billingFrequency: string;
	internationalisationId: string;
};

export const testThreeTierCheckout = (testDetails: TestDetails) => {
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
		const landingPageUrl = `/${internationalisationId.toLowerCase()}/contribute`;
		const page = await context.newPage();
		await setupPage(page, context, baseURL, landingPageUrl);

		// Select the billing frequency
		await page.getByRole('tab', { name: billingFrequency }).click();

		// Click through to the checkout (we use the aria-label to target the link)
		await page.getByLabel(productLabel, { exact: true }).click();

		// Wait for the checkout page to load
		await expect(
			page.getByRole('heading', { name: 'Your subscription' }),
		).toBeVisible({
			timeout: 100000,
		});

		await completeGenericCheckout(page, {
			product,
			paymentType,
			internationalisationId,
		});
	});
};
