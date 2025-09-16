import type { PaperFulfilmentOptions } from '@modules/product/fulfilmentOptions';
import { parameteriseUrl } from 'helpers/urls/routes';

const tests = [
	{
		input: { url: '/uk/subscribe/paper' },
		expectedResult: '/uk/subscribe/paper',
	},
	{
		input: { url: '/uk/subscribe/paper', promoCode: 'NEWSPAPER10' },
		expectedResult: '/uk/subscribe/paper?promoCode=NEWSPAPER10',
	},
	{
		input: {
			url: '/uk/subscribe/paper',
			promoCode: 'NEWSPAPER10',
			abTestName: 'abPaperSubscription',
		},
		expectedResult:
			'/uk/subscribe/paper?abPaperSubscription=true&promoCode=NEWSPAPER10',
	},
	{
		input: {
			url: '/uk/subscribe/paper',
			promoCode: 'NEWSPAPER10',
			abTestName: 'abPaperSubscription',
			fulfilmentOption: 'HomeDelivery' as PaperFulfilmentOptions,
		},
		expectedResult:
			'/uk/subscribe/paper?abPaperSubscription=true&promoCode=NEWSPAPER10#HomeDelivery',
	},
	{
		input: {
			url: '/uk/subscribe/paper',
			promoCode: 'NEWSPAPER10',
			abTestName: 'abPaperSubscription',
			fulfilmentOption: 'Collection' as PaperFulfilmentOptions,
		},
		expectedResult:
			'/uk/subscribe/paper?abPaperSubscription=true&promoCode=NEWSPAPER10#Collection',
	},
];

describe('Parameterise Url', () => {
	tests.forEach((testDetails) => {
		const {
			input: { url, promoCode, abTestName, fulfilmentOption },
			expectedResult,
		} = testDetails;
		const testName = `Url - ${url}${
			promoCode ? ` promoCode:${promoCode}` : ''
		}${abTestName ? ` abTest:${abTestName}` : ''}${
			fulfilmentOption ? ` fulfilmentOption:${fulfilmentOption}` : ''
		}`.trim();

		it(testName, () => {
			expect(
				parameteriseUrl(url, promoCode, abTestName, fulfilmentOption),
			).toEqual(expectedResult);
		});
	});
});
