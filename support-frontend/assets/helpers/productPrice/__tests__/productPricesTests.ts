// ----- Imports ----- //
import { BillingPeriod } from '@modules/product/billingPeriod';
import type {
	ProductPrice,
	ProductPrices,
} from 'helpers/productPrice/productPrices';
import {
	getCountryGroup,
	getCurrency,
	getFirstValidPrice,
	getProductPrice,
	isNumeric,
	showPrice,
} from 'helpers/productPrice/productPrices';
import { finalPrice } from 'helpers/productPrice/promotions';

// ----- Tests ----- //
jest.mock('@guardian/ophan-tracker-js/support', () => () => ({}));

describe('isNumeric', () => {
	it('should return true if a number is provided', () => {
		expect(isNumeric(null)).toEqual(false);
		expect(isNumeric()).toEqual(false);
		expect(isNumeric(0)).toEqual(true);
		expect(isNumeric(50)).toEqual(true);
	});
});

describe('getProductPrice', () => {
	const productPrices = {
		'United Kingdom': {
			Collection: {
				Weekend: {
					Monthly: {
						GBP: {
							price: 20.76,
							savingVsRetail: 20,
							currency: 'GBP',
							fixedTerm: false,
							promotions: [],
						},
					},
				},
				NoProductOptions: {
					Monthly: {
						GBP: {
							price: 11.95,
							savingVsRetail: 5,
							currency: 'GBP',
							fixedTerm: false,
							promotions: [],
						},
					},
				},
			},
			NoFulfilmentOptions: {
				NoProductOptions: {
					Monthly: {
						GBP: {
							price: 15.95,
							savingVsRetail: 10,
							currency: 'GBP',
							fixedTerm: false,
							promotions: [],
						},
					},
				},
			},
		},
		'United States': {
			Collection: {
				Weekend: {
					Monthly: {
						USD: {
							price: 12.34,
							savingVsRetail: 21,
							currency: 'USD',
							fixedTerm: false,
							promotions: [],
						},
					},
				},
			},
		},
	} as unknown as ProductPrices;

	it('should return product price information for a given currency', () => {
		expect(
			getProductPrice(
				productPrices,
				'US',
				BillingPeriod.Monthly,
				'Collection',
				'Weekend',
			),
		).toEqual({
			currency: 'USD',
			fixedTerm: false,
			price: 12.34,
			promotions: [],
			savingVsRetail: 21,
		});

		expect(
			getProductPrice(
				productPrices,
				'GB',
				BillingPeriod.Monthly,
				'Collection',
				'Weekend',
			),
		).toEqual({
			currency: 'GBP',
			fixedTerm: false,
			price: 20.76,
			promotions: [],
			savingVsRetail: 20,
		});

		expect(
			getProductPrice(productPrices, 'GB', BillingPeriod.Monthly, 'Collection'),
		).toEqual({
			currency: 'GBP',
			fixedTerm: false,
			price: 11.95,
			promotions: [],
			savingVsRetail: 5,
		});

		expect(getProductPrice(productPrices, 'GB', BillingPeriod.Monthly)).toEqual(
			{
				currency: 'GBP',
				fixedTerm: false,
				price: 15.95,
				promotions: [],
				savingVsRetail: 10,
			},
		);
	});
});

describe('finalPrice', () => {
	const productPrices = {
		'United Kingdom': {
			Collection: {
				Sunday: {
					Monthly: {
						GBP: {
							price: 15.99,
							currency: 'GBP',
							fixedTerm: false,
							promotions: [
								{
									name: 'examplePromo',
									description: 'an example promotion',
									promoCode: 1234,
									discountedPrice: 7.99,
									discount: {
										amount: 50,
										durationMonths: 3,
									},
								},
							],
						},
					},
				},
			},
		},
	} as unknown as ProductPrices;

	it('should return the final price with any discounts applied', () => {
		expect(
			finalPrice(
				productPrices,
				'GB',
				BillingPeriod.Monthly,
				'Collection',
				'Sunday',
			),
		).toEqual({
			currency: 'GBP',
			fixedTerm: false,
			price: 7.99,
			promotions: [
				{
					name: 'examplePromo',
					description: 'an example promotion',
					promoCode: 1234,
					discountedPrice: 7.99,
					discount: {
						amount: 50,
						durationMonths: 3,
					},
				},
			],
		});
	});
});

describe('getFirstValidPrice', () => {
	it('should return the first valid numeric price', () => {
		expect(getFirstValidPrice(6.99, 8.99, 11.99)).toEqual(6.99);
		expect(getFirstValidPrice(null, undefined, 8.99, 11.99)).toEqual(8.99);
	});
});

describe('getCurrency', () => {
	it('should return an ISO currency code', () => {
		expect(getCurrency('GB')).toEqual('GBP');
		expect(getCurrency('US')).toEqual('USD');
		expect(getCurrency('AU')).toEqual('AUD');
		expect(getCurrency('NZ')).toEqual('NZD');
	});
});

describe('getCountryGroup', () => {
	it('should return a country group given a valid ISO country code', () => {
		expect(getCountryGroup('GB')).toEqual({
			countries: ['GB', 'FK', 'GI', 'GG', 'IM', 'JE', 'SH'],
			currency: 'GBP',
			name: 'United Kingdom',
			supportInternationalisationId: 'uk',
		});

		expect(getCountryGroup('CA')).toEqual({
			countries: ['CA'],
			currency: 'CAD',
			name: 'Canada',
			supportInternationalisationId: 'ca',
		});
	});
});

describe('showPrice', () => {
	const productPrice: ProductPrice = {
		currency: 'USD',
		fixedTerm: true,
		price: 6.99,
	};

	it('should return the price prepended with a glyph', () => {
		expect(showPrice(productPrice)).toEqual('US$6.99');
		expect(showPrice(productPrice, false)).toEqual('$6.99');
	});
});
