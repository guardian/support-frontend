// ----- Imports ----- //
import { BillingPeriod } from '@modules/product/billingPeriod';
import { Domestic, RestOfWorld } from '@modules/product/fulfilmentOptions';
import type { ProductPrices } from 'helpers/productPrice/productPrices';
import { getProductPrice } from 'helpers/productPrice/productPrices';
import { getWeeklyFulfilmentOption } from '../../productCatalogToFulfilmentOption';

jest.mock('@guardian/ophan-tracker-js', () => () => ({}));

// ----- Tests ----- //
const productPrices = {
	'United Kingdom': {
		RestOfWorld: {
			NoProductOptions: {
				Quarterly: {
					GBP: {
						price: 60,
						currency: 'GBP',
						promotions: [],
					},
				},
				Annual: {
					GBP: {
						price: 240,
						currency: 'GBP',
						promotions: [],
					},
				},
			},
		},
		Domestic: {
			NoProductOptions: {
				Quarterly: {
					GBP: {
						price: 37.5,
						currency: 'GBP',
						promotions: [],
					},
				},
				Annual: {
					GBP: {
						price: 150,
						currency: 'GBP',
						promotions: [
							{
								name: '10% Off Annual Guardian Weekly Subs',
								description: 'Subscribe for 12 months and save 10%',
								promoCode: '10ANNUAL',
								discountedPrice: 135,
								numberOfDiscountedPeriods: 1,
								discount: {
									amount: 10,
									durationMonths: 12,
								},
							},
						],
					},
				},
			},
		},
	},
	Europe: {
		RestOfWorld: {
			NoProductOptions: {
				Quarterly: {
					EUR: {
						price: 67.5,
						currency: 'EUR',
						promotions: [],
					},
				},
				Annual: {
					EUR: {
						price: 270,
						currency: 'EUR',
						promotions: [],
					},
				},
			},
		},
		Domestic: {
			NoProductOptions: {
				Quarterly: {
					EUR: {
						price: 61.3,
						currency: 'EUR',
						promotions: [],
					},
				},
				Annual: {
					EUR: {
						price: 245.2,
						currency: 'EUR',
						promotions: [
							{
								name: '10% Off Annual Guardian Weekly Subs',
								description: 'Subscribe for 12 months and save 10%',
								promoCode: '10ANNUAL',
								discountedPrice: 220.68,
								numberOfDiscountedPeriods: 1,
								discount: {
									amount: 10,
									durationMonths: 12,
								},
							},
						],
					},
				},
			},
		},
	},
	'New Zealand': {
		RestOfWorld: {
			NoProductOptions: {
				Quarterly: {
					NZD: {
						price: 132.5,
						currency: 'NZD',
						promotions: [],
					},
				},
				Annual: {
					NZD: {
						price: 530,
						currency: 'NZD',
						promotions: [],
					},
				},
			},
		},
		Domestic: {
			NoProductOptions: {
				Quarterly: {
					NZD: {
						price: 123,
						currency: 'NZD',
						promotions: [],
					},
				},
				Annual: {
					NZD: {
						price: 492,
						currency: 'NZD',
						promotions: [
							{
								name: '10% Off Annual Guardian Weekly Subs',
								description: 'Subscribe for 12 months and save 10%',
								promoCode: '10ANNUAL',
								discountedPrice: 442.8,
								numberOfDiscountedPeriods: 1,
								discount: {
									amount: 10,
									durationMonths: 12,
								},
							},
						],
					},
				},
			},
		},
	},
	Canada: {
		RestOfWorld: {
			NoProductOptions: {
				Quarterly: {
					CAD: {
						price: 86.25,
						currency: 'CAD',
						promotions: [],
					},
				},
				Annual: {
					CAD: {
						price: 345,
						currency: 'CAD',
						promotions: [],
					},
				},
			},
		},
		Domestic: {
			NoProductOptions: {
				Quarterly: {
					CAD: {
						price: 80,
						currency: 'CAD',
						promotions: [],
					},
				},
				Annual: {
					CAD: {
						price: 320,
						currency: 'CAD',
						promotions: [
							{
								name: '10% Off Annual Guardian Weekly Subs',
								description: 'Subscribe for 12 months and save 10%',
								promoCode: '10ANNUAL',
								discountedPrice: 288,
								numberOfDiscountedPeriods: 1,
								discount: {
									amount: 10,
									durationMonths: 12,
								},
							},
						],
					},
				},
			},
		},
	},
	Australia: {
		RestOfWorld: {
			NoProductOptions: {
				Quarterly: {
					AUD: {
						price: 106,
						currency: 'AUD',
						promotions: [],
					},
				},
				Annual: {
					AUD: {
						price: 424,
						currency: 'AUD',
						promotions: [],
					},
				},
			},
		},
		Domestic: {
			NoProductOptions: {
				Quarterly: {
					AUD: {
						price: 97.5,
						currency: 'AUD',
						promotions: [],
					},
				},
				Annual: {
					AUD: {
						price: 390,
						currency: 'AUD',
						promotions: [
							{
								name: '10% Off Annual Guardian Weekly Subs',
								description: 'Subscribe for 12 months and save 10%',
								promoCode: '10ANNUAL',
								discountedPrice: 351,
								numberOfDiscountedPeriods: 1,
								discount: {
									amount: 10,
									durationMonths: 12,
								},
							},
						],
					},
				},
			},
		},
	},
	International: {
		RestOfWorld: {
			NoProductOptions: {
				Quarterly: {
					GBP: {
						price: 60,
						currency: 'GBP',
						promotions: [],
					},
					USD: {
						price: 81.3,
						currency: 'USD',
						promotions: [],
					},
				},
				Annual: {
					GBP: {
						price: 240,
						currency: 'GBP',
						promotions: [],
					},
					USD: {
						price: 325.2,
						currency: 'USD',
						promotions: [],
					},
				},
			},
		},
		Domestic: {
			NoProductOptions: {
				Quarterly: {
					GBP: {
						price: 37.5,
						currency: 'GBP',
						promotions: [],
					},
					USD: {
						price: 75,
						currency: 'USD',
						promotions: [],
					},
				},
				Annual: {
					GBP: {
						price: 150,
						currency: 'GBP',
						promotions: [
							{
								name: '10% Off Annual Guardian Weekly Subs',
								description: 'Subscribe for 12 months and save 10%',
								promoCode: '10ANNUAL',
								discountedPrice: 135,
								numberOfDiscountedPeriods: 1,
								discount: {
									amount: 10,
									durationMonths: 12,
								},
							},
						],
					},
					USD: {
						price: 300,
						currency: 'USD',
						promotions: [
							{
								name: '10% Off Annual Guardian Weekly Subs',
								description: 'Subscribe for 12 months and save 10%',
								promoCode: '10ANNUAL',
								discountedPrice: 270,
								numberOfDiscountedPeriods: 1,
								discount: {
									amount: 10,
									durationMonths: 12,
								},
							},
						],
					},
				},
			},
		},
	},
	'United States': {
		RestOfWorld: {
			NoProductOptions: {
				Quarterly: {
					USD: {
						price: 81.3,
						currency: 'USD',
						promotions: [],
					},
				},
				Annual: {
					USD: {
						price: 325.2,
						currency: 'USD',
						promotions: [],
					},
				},
			},
		},
		Domestic: {
			NoProductOptions: {
				Quarterly: {
					USD: {
						price: 75,
						currency: 'USD',
						promotions: [],
					},
				},
				Annual: {
					USD: {
						price: 300,
						currency: 'USD',
						promotions: [
							{
								name: '10% Off Annual Guardian Weekly Subs',
								description: 'Subscribe for 12 months and save 10%',
								promoCode: '10ANNUAL',
								discountedPrice: 270,
								numberOfDiscountedPeriods: 1,
								discount: {
									amount: 10,
									durationMonths: 12,
								},
							},
						],
					},
				},
			},
		},
	},
} as unknown as ProductPrices;

describe('getPrice', () => {
	it('should return a price based on inputs', () => {
		const euroPriceQuarterly = getProductPrice(
			productPrices,
			'FR',
			BillingPeriod.Quarterly,
			Domestic,
		);

		expect(euroPriceQuarterly).toEqual({
			currency: 'EUR',
			price: 61.3,
			promotions: [],
		});

		const gbpPriceAnnual = getProductPrice(
			productPrices,
			'GB',
			BillingPeriod.Annual,
			Domestic,
		);

		expect(gbpPriceAnnual).toEqual({
			price: 150,
			currency: 'GBP',
			promotions: [
				{
					name: '10% Off Annual Guardian Weekly Subs',
					description: 'Subscribe for 12 months and save 10%',
					promoCode: '10ANNUAL',
					discountedPrice: 135,
					numberOfDiscountedPeriods: 1,
					discount: {
						amount: 10,
						durationMonths: 12,
					},
				},
			],
		});

		const intPriceAnnual = getProductPrice(
			productPrices,
			'CG',
			BillingPeriod.Annual,
			RestOfWorld,
		);

		expect(intPriceAnnual).toEqual({
			currency: 'USD',
			price: 325.2,
			promotions: [],
		});
	});
});

describe('getWeeklyFulfilmentOption', () => {
	it('should work out the correct fulfilment option for a country', () => {
		expect(getWeeklyFulfilmentOption('GB')).toEqual(Domestic);
		expect(getWeeklyFulfilmentOption('FR')).toEqual(Domestic);
		expect(getWeeklyFulfilmentOption('US')).toEqual(Domestic);
		expect(getWeeklyFulfilmentOption('AU')).toEqual(Domestic);
		expect(getWeeklyFulfilmentOption('AE')).toEqual(RestOfWorld);
	});
});
