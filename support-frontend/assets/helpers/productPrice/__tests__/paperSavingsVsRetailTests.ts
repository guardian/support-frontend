import { productCatalogFixture } from 'fixtures/productCatalogFixture';
import { getMaxSavingVsRetail } from 'helpers/productPrice/paperSavingsVsRetail';

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
