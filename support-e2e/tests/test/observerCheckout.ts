import { expect, test } from '@playwright/test';
import { setupPage } from '../utils/page';
import { setTestUserDetails } from '../utils/testUserDetails';
import { getUserFields } from '../utils/userFields';
import {
	expectToLandOnStripeCheckoutPage,
	fillStripeCheckoutForm,
	submitStripeCheckoutForm,
} from '../utils/stripeCheckoutForm';

type TestDetails = {
	product: string;
	ratePlan: string;
	paymentType: string;
	internationalisationId: string;
	postCode?: string;
};

export const testObserverCheckout = (testDetails: TestDetails) => {
	const { internationalisationId, product, ratePlan, paymentType, postCode } =
		testDetails;
	const testName = `${product} ${ratePlan} with ${paymentType} in ${internationalisationId} ${
		postCode ? `with postcode ${postCode}` : ''
	}`;

	test(testName, async ({ context, baseURL }) => {
		const url = `/${internationalisationId.toLowerCase()}/checkout?product=${product}&ratePlan=${ratePlan}`;
		const page = await context.newPage();
		await setupPage(page, context, baseURL, url);

		// Fill checkout form and submit
		await setTestUserDetails(
			page,
			product,
			internationalisationId,
			getUserFields(internationalisationId, postCode),
		);
		await page.getByRole('radio', { name: paymentType }).check();
		await page.getByRole('button', { name: `Pay` }).click();

		// goto Stripe checkout page
		await expectToLandOnStripeCheckoutPage(page);

		// fill in Stripe checkout form and sumbit
		await fillStripeCheckoutForm(page);
		await submitStripeCheckoutForm(page);

		// Expect to see the thank you page
		await expect(page.getByRole('heading', { name: 'Thank you' })).toBeVisible({
			timeout: 600000,
		});
	});
};
