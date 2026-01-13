import {
	baseCollectionPromotion,
	baseHomeDeliveryPromotion,
	productPrices,
} from '../__fixtures__/productPrices.fixtures';
import getPaperPromotions from '../getPromotions';

describe('getPaperPromotions', () => {
	it('returns an empty array when no Plus products are active', () => {
		const result = getPaperPromotions({
			activePaperProductTypes: ['Saturday', 'Sunday'],
			productPrices,
			paperFulfilment: 'HomeDelivery',
		});

		expect(result).toEqual([]);
	});

	it('returns a promotion for a single Plus product', () => {
		const result = getPaperPromotions({
			activePaperProductTypes: ['EverydayPlus'],
			productPrices,
			paperFulfilment: 'HomeDelivery',
		});

		expect(result).toHaveLength(1);
		expect(result[0]).toMatchObject({
			promoCode: baseHomeDeliveryPromotion.promoCode,
			activePaperProducts: ['EverydayPlus'],
		});
	});

	it('returns diferent promotions per fulfilment', () => {
		const result = getPaperPromotions({
			activePaperProductTypes: ['EverydayPlus'],
			productPrices,
			paperFulfilment: 'Collection',
		});

		expect(result).toHaveLength(1);
		expect(result[0]).toMatchObject({
			promoCode: baseCollectionPromotion.promoCode,
			activePaperProducts: ['EverydayPlus'],
		});
	});

	it('groups multiple Plus products under the same promo code', () => {
		const result = getPaperPromotions({
			activePaperProductTypes: ['EverydayPlus', 'WeekendPlus'],
			productPrices,
			paperFulfilment: 'HomeDelivery',
		});

		expect(result).toHaveLength(1);
		expect(result[0].activePaperProducts).toEqual(
			expect.arrayContaining(['EverydayPlus', 'WeekendPlus']),
		);
	});

	it('ignores products with no promotions', () => {
		const result = getPaperPromotions({
			activePaperProductTypes: ['SixdayPlus'],
			productPrices,
			paperFulfilment: 'HomeDelivery',
		});

		expect(result).toEqual([]);
	});

	it('only uses the first promotion per product option', () => {
		const result = getPaperPromotions({
			activePaperProductTypes: ['SaturdayPlus'],
			productPrices,
			paperFulfilment: 'HomeDelivery',
		});

		expect(result).toHaveLength(1);
		expect(result[0].promoCode).toBe('FIRST');
	});
});
