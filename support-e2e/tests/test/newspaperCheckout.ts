import test, { expect } from '@playwright/test';
import { setupPage } from '../utils/page';
import { completeGenericCheckout } from '../utils/completeGenericCheckout';

export type TestDetails = {
	product: string;
	productLabel: string;
	ratePlanLabel: string;
	paymentType: string;
	internationalisationId: string;
	postCode?: string;
};

export const testNewspaperCheckout = (testDetails: TestDetails) => {
	const {
		product,
		productLabel,
		paymentType,
		internationalisationId,
		postCode,
		ratePlanLabel,
	} = testDetails;

	test(`Newspaper - ${product} - ${paymentType} - ${internationalisationId} ${postCode ? `- ${postCode}` : ''}`, async ({
		context,
		baseURL,
	}) => {
		const landingPageUrl = `/${internationalisationId.toLowerCase()}/subscribe/paper`;
		const page = await context.newPage();
		await setupPage(page, context, baseURL, landingPageUrl);

		// Select the product (Home Delivery or Subscription Card)
		await page.getByRole('tab', { name: productLabel }).click();

		// // Click through to the checkout (we use the aria-label to target the link)
		await page
			.getByLabel(`${ratePlanLabel}- Subscribe`, { exact: true })
			.click();

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
			postCode,
		});
	});
};
