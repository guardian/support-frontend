import type { ProductPrice } from '../productPrices';
import type { Promotion } from '../promotions';
import { applyDiscount, getAppliedPromo, hasDiscount } from '../promotions';

describe('hasDiscount', () => {
	it('should cope with all the possible values for promotion.discountPrice', () => {
		expect(hasDiscount()).toEqual(false);
		expect(hasDiscount(undefined)).toEqual(false);
		expect(hasDiscount({} as Promotion)).toEqual(false);

		expect(hasDiscount()).toEqual(false);

		expect(
			hasDiscount({
				discountedPrice: 50,
			} as Promotion),
		).toEqual(true);

		expect(
			hasDiscount({
				discountedPrice: 0,
			} as Promotion),
		).toEqual(true);
	});
});

describe('getAppliedPromo', () => {
	const promotions = [
		{
			name: 'examplePromo1',
			description: 'example promotion1',
			promoCode: 1234,
			discountedPrice: 5.99,
		},
	] as unknown as Promotion[];

	it('should return the applied promotion based on inputs', () => {
		expect(getAppliedPromo(promotions)).toEqual({
			name: 'examplePromo1',
			description: 'example promotion1',
			promoCode: 1234,
			discountedPrice: 5.99,
		});

		expect(getAppliedPromo()).toEqual(undefined);
	});
});

describe('applyDiscount', () => {
	const productWithDiscountedPrice = {
		price: 12.99,
		currency: 'EUR',
		fixedTerm: false,
		promotions: [
			{
				name: 'Sept 2019 Discount',
				description: '25% off',
				promoCode: 'GH86H9J',
				discountedPrice: 8.99,
				isIntroductoryPricing: false,
			},
		],
	};

	it('should return an updated price with a discount applied', () => {
		expect(
			applyDiscount(
				productWithDiscountedPrice as ProductPrice,
				productWithDiscountedPrice.promotions[0],
			),
		).toEqual({
			currency: 'EUR',
			fixedTerm: false,
			price: 8.99,
			promotions: [
				{
					name: 'Sept 2019 Discount',
					description: '25% off',
					promoCode: 'GH86H9J',
					discountedPrice: 8.99,
					isIntroductoryPricing: false,
				},
			],
		});
	});
});
