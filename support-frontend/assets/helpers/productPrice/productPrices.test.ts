import { getDiscountVsRetail } from './productPrices';

describe('getDiscountVsRetail', () => {
	it('calculates total discount vs retail', () => {
		const discount = getDiscountVsRetail(48.79, 27, 20);
		expect(discount).toEqual(41);
	});
	it('works with fractional online vs retail savings percentages', () => {
		const discount = getDiscountVsRetail(48.14, 29.18, 22.34);
		expect(discount).toEqual(45);
	});
});
