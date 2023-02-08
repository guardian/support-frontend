import { getDiscountVsRetail } from './productPrices';

describe('getDiscountVsRetail', () => {
	it('calculates total discount vs retail', () => {
		const discount = getDiscountVsRetail(48.79, 27, 20);
		expect(discount).toEqual(42);
	});
});
