import test from '@playwright/test';
import { visitLandingPageAndCompleteCheckout } from '../utils/visitLandingPageAndCompleteCheckout';

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
};
