import type { PaperFulfilmentOptions } from '@modules/product/fulfilmentOptions';
import { parameteriseUrl } from 'helpers/urls/routes';

const tests = [
	{
		url: '/uk/subscribe/paper',
	},
	{
		url: '/uk/subscribe/paper',
		promoCode: 'NEWSPAPER10',
	},
	{
		url: '/uk/subscribe/paper',
		promoCode: 'NEWSPAPER10',
		abTestName: 'abPaperSubscription',
	},
	{
		url: '/uk/subscribe/paper',
		promoCode: 'NEWSPAPER10',
		abTestName: 'abPaperSubscription',
		fulfilmentOption: 'HomeDelivery' as PaperFulfilmentOptions,
	},
	{
		url: '/uk/subscribe/paper',
		promoCode: 'NEWSPAPER10',
		abTestName: 'abPaperSubscription',
		fulfilmentOption: 'Collection' as PaperFulfilmentOptions,
	},
];

const results = [
	'/uk/subscribe/paper',
	'/uk/subscribe/paper?promoCode=NEWSPAPER10',
	'/uk/subscribe/paper?abPaperSubscription=true&promoCode=NEWSPAPER10',
	'/uk/subscribe/paper?abPaperSubscription=true&promoCode=NEWSPAPER10#HomeDelivery',
	'/uk/subscribe/paper?abPaperSubscription=true&promoCode=NEWSPAPER10#Collection',
];

describe('Parameterise Url', () => {
	tests.forEach((testDetails) => {
		const { url, promoCode, abTestName, fulfilmentOption } = testDetails;
		const testName = `Url - ${url}${
			promoCode ? ` promoCode:${promoCode}` : ''
		}${abTestName ? ` abTest:${abTestName}` : ''}${
			fulfilmentOption ? ` fulfilmentOption:${fulfilmentOption}` : ''
		}`.trim();

		it(testName, () => {
			expect(
				parameteriseUrl(url, promoCode, abTestName, fulfilmentOption),
			).toEqual(results[tests.indexOf(testDetails)]);
		});
	});
});
