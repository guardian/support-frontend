import type { ProductPrices } from 'helpers/productPrice/productPrices';

export const productPrices: ProductPrices = {
	'United Kingdom': {
		NoFulfilmentOptions: {
			NoProductOptions: {
				Annual: {
					GBP: {
						price: 119,
						currency: 'GBP',
						fixedTerm: false,
						promotions: [
							{
								name: 'Introductory Promotion UK',
								description: 'Save over 20% against monthly in the first year',
								promoCode: 'ANNUAL-INTRO-UK',
								discountedPrice: 99,
								numberOfDiscountedPeriods: 1,
								discount: {
									amount: 16.81,
									durationMonths: 12,
								},
								landingPage: {
									roundel: 'Save over 20% against monthly in the first year',
								},
							},
						],
					},
				},
				Monthly: {
					GBP: {
						price: 11.99,
						currency: 'GBP',
						fixedTerm: false,
						promotions: [
							{
								name: 'September 2019 - 50% off for 3 months',
								description: '50% off for 3 months',
								promoCode: 'DK0NT24WG',
								discountedPrice: 5.99,
								numberOfDiscountedPeriods: 3,
								discount: {
									amount: 50,
									durationMonths: 3,
								},
								landingPage: {
									roundel: '50% off for 3 months',
								},
							},
						],
					},
				},
			},
		},
	},
};
