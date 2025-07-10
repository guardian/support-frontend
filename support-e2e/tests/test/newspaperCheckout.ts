import test, { expect } from '@playwright/test';
import { setupPage } from '../utils/page';
import { completeGenericCheckout } from '../utils/completeGenericCheckout';
import { visitLandingPageAndCompleteCheckout } from '../utils/visitLandingPageAndCompleteCheckout';

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
		await visitLandingPageAndCompleteCheckout(
			`/${internationalisationId.toLowerCase()}/subscribe/paper`,
			{
				context,
				baseURL,
				product,
				paymentType,
				internationalisationId,
				postCode,
			},
			async (page) => {
				// Transition from landing page to checkout:

				// 1. Select the product (Home Delivery or Subscription Card)
				await page.getByRole('tab', { name: productLabel }).click();

				// 2. Click through to the checkout (we use the aria-label to target the link)
				await page
					.getByLabel(`${ratePlanLabel}- Subscribe`, { exact: true })
					.click();
			},
		);
	});
};
