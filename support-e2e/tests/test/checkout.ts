import { test } from '@playwright/test';
import { setupPage } from '../utils/page';
import { completeGenericCheckout } from '../utils/completeGenericCheckout';

// TODO: it'd be great to make the types here more specific, possibly using the
// shared types from the product catalog.
type TestDetails = {
	product: string;
	ratePlan: string;
	paymentType: string;
	internationalisationId: string;
	postCode?: string;
};

export const testCheckout = (testDetails: TestDetails) => {
	const { internationalisationId, product, ratePlan, paymentType, postCode } =
		testDetails;
	const testName = `${product} ${ratePlan} with ${paymentType} in ${internationalisationId} ${
		postCode ? `with postcode ${postCode}` : ''
	}`;

	test(testName, async ({ context, baseURL }) => {
		const urlProductKey =
			product === 'NationalDelivery' ? 'HomeDelivery' : product;
		const url = `/${internationalisationId.toLowerCase()}/checkout?product=${urlProductKey}&ratePlan=${ratePlan}`;
		const page = await context.newPage();
		await setupPage(page, context, baseURL, url);

		await completeGenericCheckout(page, testDetails);
	});
};
