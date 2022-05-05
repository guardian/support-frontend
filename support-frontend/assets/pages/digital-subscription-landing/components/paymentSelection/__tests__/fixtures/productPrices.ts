import type { ProductPrices } from 'helpers/productPrice/productPrices';

export const productPrices: ProductPrices = {
	'New Zealand': {
		NoFulfilmentOptions: {
			NoProductOptions: {
				// @ts-expect-error: At least one IsoCurrency be present for each BillingPeriod
				Annual: {
					NZD: {
						price: 235,
						currency: 'NZD',
						fixedTerm: false,
						promotions: [
							{
								name: 'Introductory Promotion NZ',
								description: 'Save over 20% against monthly in the first year',
								promoCode: 'ANNUAL-INTRO-NZ',
								discountedPrice: 175,
								numberOfDiscountedPeriods: 1,
								discount: {
									amount: 25.53,
									durationMonths: 12,
								},
								landingPage: {
									roundel: 'Save over 20% against monthly in the first year',
								},
							},
						],
					},
				},
				// @ts-expect-error: At least one IsoCurrency be present for each BillingPeriod
				Monthly: {
					NZD: {
						price: 23.5,
						currency: 'NZD',
						fixedTerm: false,
						promotions: [
							{
								name: 'September 2019 - 50% off for 3 months',
								description: '50% off for 3 months',
								promoCode: 'DK0NT24WG',
								discountedPrice: 11.75,
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
	'United Kingdom': {
		NoFulfilmentOptions: {
			NoProductOptions: {
				// @ts-expect-error: At least one IsoCurrency be present for each BillingPeriod
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
				// @ts-expect-error: At least one IsoCurrency be present for each BillingPeriod
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
	Australia: {
		NoFulfilmentOptions: {
			NoProductOptions: {
				// @ts-expect-error: At least one IsoCurrency be present for each BillingPeriod
				Annual: {
					AUD: {
						price: 215,
						currency: 'AUD',
						fixedTerm: false,
						promotions: [
							{
								name: 'Introductory Promotion AU',
								description: 'Save over 20% against monthly in the first year',
								promoCode: 'ANNUAL-INTRO-AU',
								discountedPrice: 174.99,
								numberOfDiscountedPeriods: 1,
								discount: {
									amount: 18.61,
									durationMonths: 12,
								},
								landingPage: {
									roundel: 'Save over 20% against monthly in the first year',
								},
							},
						],
					},
				},
				// @ts-expect-error: At least one IsoCurrency be present for each BillingPeriod
				Monthly: {
					AUD: {
						price: 21.5,
						currency: 'AUD',
						fixedTerm: false,
						promotions: [
							{
								name: 'September 2019 - 50% off for 3 months',
								description: '50% off for 3 months',
								promoCode: 'DK0NT24WG',
								discountedPrice: 10.75,
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
	Canada: {
		NoFulfilmentOptions: {
			NoProductOptions: {
				// @ts-expect-error: At least one IsoCurrency be present for each BillingPeriod
				Annual: {
					CAD: {
						price: 219,
						currency: 'CAD',
						fixedTerm: false,
						promotions: [
							{
								name: 'Introductory Promotion CA',
								description: 'Save over 20% against monthly in the first year',
								promoCode: 'ANNUAL-INTRO-CA',
								discountedPrice: 175,
								numberOfDiscountedPeriods: 1,
								discount: {
									amount: 20.09,
									durationMonths: 12,
								},
								landingPage: {
									roundel: 'Save over 20% against monthly in the first year',
								},
							},
						],
					},
				},
				// @ts-expect-error: At least one IsoCurrency be present for each BillingPeriod
				Monthly: {
					CAD: {
						price: 21.95,
						currency: 'CAD',
						fixedTerm: false,
						promotions: [
							{
								name: 'September 2019 - 50% off for 3 months',
								description: '50% off for 3 months',
								promoCode: 'DK0NT24WG',
								discountedPrice: 10.97,
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
	'United States': {
		NoFulfilmentOptions: {
			NoProductOptions: {
				// @ts-expect-error: At least one IsoCurrency be present for each BillingPeriod
				Annual: {
					USD: {
						price: 199,
						currency: 'USD',
						fixedTerm: false,
						promotions: [
							{
								name: 'Introductory Promotion US',
								description: 'Save over 20% against monthly in the first year',
								promoCode: 'ANNUAL-INTRO-US',
								discountedPrice: 164.99,
								numberOfDiscountedPeriods: 1,
								discount: {
									amount: 17.09,
									durationMonths: 12,
								},
								landingPage: {
									roundel: 'Save over 20% against monthly in the first year',
								},
							},
						],
					},
				},
				// @ts-expect-error: At least one IsoCurrency be present for each BillingPeriod
				Monthly: {
					USD: {
						price: 19.99,
						currency: 'USD',
						fixedTerm: false,
						promotions: [
							{
								name: 'September 2019 - 50% off for 3 months',
								description: '50% off for 3 months',
								promoCode: 'DK0NT24WG',
								discountedPrice: 9.99,
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
	Europe: {
		NoFulfilmentOptions: {
			NoProductOptions: {
				// @ts-expect-error: At least one IsoCurrency be present for each BillingPeriod
				Annual: {
					EUR: {
						price: 149,
						currency: 'EUR',
						fixedTerm: false,
						promotions: [
							{
								name: 'Introductory Promotion EU',
								description: 'Save over 20% against monthly in the first year',
								promoCode: 'ANNUAL-INTRO-EU',
								discountedPrice: 125,
								numberOfDiscountedPeriods: 1,
								discount: {
									amount: 16.11,
									durationMonths: 12,
								},
								landingPage: {
									roundel: 'Save over 20% against monthly in the first year',
								},
							},
						],
					},
				},
				// @ts-expect-error: At least one IsoCurrency be present for each BillingPeriod
				Monthly: {
					EUR: {
						price: 14.99,
						currency: 'EUR',
						fixedTerm: false,
						promotions: [
							{
								name: 'September 2019 - 50% off for 3 months',
								description: '50% off for 3 months',
								promoCode: 'DK0NT24WG',
								discountedPrice: 7.49,
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
	International: {
		NoFulfilmentOptions: {
			NoProductOptions: {
				// @ts-expect-error: At least one IsoCurrency be present for each BillingPeriod
				Annual: {
					GBP: {
						price: 119,
						currency: 'GBP',
						fixedTerm: false,
						promotions: [
							{
								name: 'Introductory Promotion US',
								description: 'Save over 20% against monthly in the first year',
								promoCode: 'ANNUAL-INTRO-US',
								discountedPrice: 98.66,
								numberOfDiscountedPeriods: 1,
								discount: {
									amount: 17.09,
									durationMonths: 12,
								},
								landingPage: {
									roundel: 'Save over 20% against monthly in the first year',
								},
							},
						],
					},
					USD: {
						price: 199,
						currency: 'USD',
						fixedTerm: false,
						promotions: [
							{
								name: 'Introductory Promotion US',
								description: 'Save over 20% against monthly in the first year',
								promoCode: 'ANNUAL-INTRO-US',
								discountedPrice: 164.99,
								numberOfDiscountedPeriods: 1,
								discount: {
									amount: 17.09,
									durationMonths: 12,
								},
								landingPage: {
									roundel: 'Save over 20% against monthly in the first year',
								},
							},
						],
					},
				},
				// @ts-expect-error: At least one IsoCurrency be present for each BillingPeriod
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
					USD: {
						price: 19.99,
						currency: 'USD',
						fixedTerm: false,
						promotions: [
							{
								name: 'September 2019 - 50% off for 3 months',
								description: '50% off for 3 months',
								promoCode: 'DK0NT24WG',
								discountedPrice: 9.99,
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
