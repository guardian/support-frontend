import { productCatalogFixture } from 'fixtures/productCatalogFixture';
import {
	getDiscountVsRetail,
	getMaxSavingVsRetail,
} from 'helpers/productPrice/paperSavingsVsRetail';

jest.mock('@guardian/ophan-tracker-js', () => () => ({}));

describe('getMaxSavingVsRetail', () => {
	it('returns the maximum saving vs retail across the paper products', () => {
		// SubscriptionCard EverydayPlus
		expect(getMaxSavingVsRetail(productCatalogFixture)).toEqual(37.62);
	});

	it('returns 0 when there are no savings', () => {
		expect(getMaxSavingVsRetail({})).toEqual(0);
	});
});

describe('getDiscountVsRetail', () => {
	it('calculates total discount vs retail', () => {
		expect(getDiscountVsRetail(48.79, 27, 20)).toEqual(41);
	});

	it('works with fractional online vs retail savings percentages', () => {
		expect(getDiscountVsRetail(48.14, 29.18, 22.34)).toEqual(45);
	});
});
