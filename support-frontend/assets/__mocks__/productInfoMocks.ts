import type { ProductPrices } from 'helpers/productPrice/productPrices';

export const paperProducts: ProductPrices = {
	'United Kingdom': {
		Collection: {
			SixdayPlus: {
				Monthly: {
					GBP: {
						price: 27.36,
						savingVsRetail: 35,
						currency: 'GBP',
						fixedTerm: false,
						promotions: [],
					},
				},
			},
			SundayPlus: {
				Monthly: {
					GBP: {
						price: 22.06,
						savingVsRetail: 15,
						currency: 'GBP',
						fixedTerm: false,
						promotions: [],
					},
				},
			},
			SaturdayPlus: {
				Monthly: {
					GBP: {
						price: 21.99,
						savingVsRetail: 16,
						currency: 'GBP',
						fixedTerm: false,
						promotions: [],
					},
				},
			},
			Saturday: {
				Monthly: {
					GBP: {
						price: 10.36,
						currency: 'GBP',
						fixedTerm: false,
						promotions: [],
					},
				},
			},
			Sixday: {
				Monthly: {
					GBP: {
						price: 41.12,
						currency: 'GBP',
						fixedTerm: false,
						promotions: [],
					},
				},
			},
			Weekend: {
				Monthly: {
					GBP: {
						price: 20.76,
						currency: 'GBP',
						fixedTerm: false,
						promotions: [],
					},
				},
			},
			Sunday: {
				Monthly: {
					GBP: {
						price: 11.99,
						currency: 'GBP',
						fixedTerm: false,
						promotions: [],
					},
				},
			},
			WeekendPlus: {
				Monthly: {
					GBP: {
						price: 12.56,
						savingVsRetail: 26,
						currency: 'GBP',
						fixedTerm: false,
						promotions: [],
					},
				},
			},
			Everyday: {
				Monthly: {
					GBP: {
						price: 55.69,
						currency: 'GBP',
						fixedTerm: false,
						promotions: [],
					},
				},
			},
			EverydayPlus: {
				Monthly: {
					GBP: {
						price: 29.2,
						savingVsRetail: 41,
						currency: 'GBP',
						fixedTerm: false,
						promotions: [],
					},
				},
			},
		},
		HomeDelivery: {
			SixdayPlus: {
				Monthly: {
					GBP: {
						price: 30.36,
						currency: 'GBP',
						fixedTerm: false,
						promotions: [],
					},
				},
			},
			SundayPlus: {
				Monthly: {
					GBP: {
						price: 26.39,
						currency: 'GBP',
						fixedTerm: false,
						promotions: [],
					},
				},
			},
			SaturdayPlus: {
				Monthly: {
					GBP: {
						price: 25.96,
						currency: 'GBP',
						fixedTerm: false,
						promotions: [],
					},
				},
			},
			Saturday: {
				Monthly: {
					GBP: {
						price: 14.69,
						currency: 'GBP',
						fixedTerm: false,
						promotions: [],
					},
				},
			},
			Sixday: {
				Monthly: {
					GBP: {
						price: 54.12,
						savingVsRetail: 5,
						currency: 'GBP',
						fixedTerm: false,
						promotions: [],
					},
				},
			},
			Weekend: {
				Monthly: {
					GBP: {
						price: 25.09,
						savingVsRetail: 2,
						currency: 'GBP',
						fixedTerm: false,
						promotions: [],
					},
				},
			},
			Sunday: {
				Monthly: {
					GBP: {
						price: 15.12,
						currency: 'GBP',
						fixedTerm: false,
						promotions: [],
					},
				},
			},
			WeekendPlus: {
				Monthly: {
					GBP: {
						price: 12.57,
						currency: 'GBP',
						fixedTerm: false,
						promotions: [],
					},
				},
			},
			Everyday: {
				Monthly: {
					GBP: {
						price: 67.79,
						savingVsRetail: 9,
						currency: 'GBP',
						fixedTerm: false,
						promotions: [],
					},
				},
			},
			EverydayPlus: {
				Monthly: {
					GBP: {
						price: 29.19,
						currency: 'GBP',
						fixedTerm: false,
						promotions: [],
					},
				},
			},
		},
	},
};

export const weeklyProducts: ProductPrices = {
	'New Zealand': {
		Domestic: {
			NoProductOptions: {
				Monthly: {
					NZD: {
						price: 41,
						currency: 'NZD',
						fixedTerm: false,
						promotions: [],
					},
				},
				Quarterly: {
					NZD: {
						price: 123,
						currency: 'NZD',
						fixedTerm: false,
						promotions: [],
					},
				},
				SixWeekly: {
					NZD: {
						price: 41,
						currency: 'NZD',
						fixedTerm: false,
						promotions: [
							{
								name: 'Six For Six',
								description: 'Introductory offer',
								promoCode: '6FOR6',
								introductoryPrice: {
									price: 6,
									periodLength: 6,
									periodType: 'issue',
								},
							},
						],
					},
				},
				Annual: {
					NZD: {
						price: 492,
						currency: 'NZD',
						fixedTerm: false,
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
								landingPage: {
									roundel: 'Subscribe for 12 months and save 10%',
								},
							},
						],
					},
				},
			},
		},
		RestOfWorld: {
			NoProductOptions: {
				Quarterly: {
					NZD: {
						price: 132.5,
						currency: 'NZD',
						fixedTerm: false,
						promotions: [],
					},
				},
				Annual: {
					NZD: {
						price: 530,
						currency: 'NZD',
						fixedTerm: false,
						promotions: [
							{
								name: '10% Off Annual Guardian Weekly Subs',
								description: 'Subscribe for 12 months and save 10%',
								promoCode: '10ANNUAL',
								discountedPrice: 477,
								numberOfDiscountedPeriods: 1,
								discount: {
									amount: 10,
									durationMonths: 12,
								},
								landingPage: {
									roundel: 'Subscribe for 12 months and save 10%',
								},
							},
						],
					},
				},
			},
		},
	},
	'United Kingdom': {
		Domestic: {
			NoProductOptions: {
				Monthly: {
					GBP: {
						price: 12.5,
						currency: 'GBP',
						fixedTerm: false,
						promotions: [],
					},
				},
				Quarterly: {
					GBP: {
						price: 37.5,
						currency: 'GBP',
						fixedTerm: false,
						promotions: [],
					},
				},
				SixWeekly: {
					GBP: {
						price: 12.5,
						currency: 'GBP',
						fixedTerm: false,
						promotions: [
							{
								name: 'Six For Six',
								description: 'Introductory offer',
								promoCode: '6FOR6',
								introductoryPrice: {
									price: 6,
									periodLength: 6,
									periodType: 'issue',
								},
							},
						],
					},
				},
				Annual: {
					GBP: {
						price: 150,
						currency: 'GBP',
						fixedTerm: false,
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
								landingPage: {
									roundel: 'Subscribe for 12 months and save 10%',
								},
							},
						],
					},
				},
			},
		},
		RestOfWorld: {
			NoProductOptions: {
				Quarterly: {
					GBP: {
						price: 60,
						currency: 'GBP',
						fixedTerm: false,
						promotions: [],
					},
				},
				Annual: {
					GBP: {
						price: 240,
						currency: 'GBP',
						fixedTerm: false,
						promotions: [
							{
								name: '10% Off Annual Guardian Weekly Subs',
								description: 'Subscribe for 12 months and save 10%',
								promoCode: '10ANNUAL',
								discountedPrice: 216,
								numberOfDiscountedPeriods: 1,
								discount: {
									amount: 10,
									durationMonths: 12,
								},
								landingPage: {
									roundel: 'Subscribe for 12 months and save 10%',
								},
							},
						],
					},
				},
				SixWeekly: {
					GBP: {
						price: 12.5,
						currency: 'GBP',
						fixedTerm: false,
						promotions: [
							{
								name: 'Six For Six',
								description: 'Introductory offer',
								promoCode: '6FOR6',
								introductoryPrice: {
									price: 6,
									periodLength: 6,
									periodType: 'issue',
								},
							},
						],
					},
				},
				Monthly: {
					GBP: {
						price: 12.5,
						currency: 'GBP',
						fixedTerm: false,
						promotions: [],
					},
				},
			},
		},
	},
	Australia: {
		Domestic: {
			NoProductOptions: {
				Monthly: {
					AUD: {
						price: 32.5,
						currency: 'AUD',
						fixedTerm: false,
						promotions: [],
					},
				},
				Quarterly: {
					AUD: {
						price: 97.5,
						currency: 'AUD',
						fixedTerm: false,
						promotions: [],
					},
				},
				SixWeekly: {
					AUD: {
						price: 32.5,
						currency: 'AUD',
						fixedTerm: false,
						promotions: [
							{
								name: 'Six For Six',
								description: 'Introductory offer',
								promoCode: '6FOR6',
								introductoryPrice: {
									price: 6,
									periodLength: 6,
									periodType: 'issue',
								},
							},
						],
					},
				},
				Annual: {
					AUD: {
						price: 390,
						currency: 'AUD',
						fixedTerm: false,
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
								landingPage: {
									roundel: 'Subscribe for 12 months and save 10%',
								},
							},
						],
					},
				},
			},
		},
		RestOfWorld: {
			NoProductOptions: {
				Quarterly: {
					AUD: {
						price: 106,
						currency: 'AUD',
						fixedTerm: false,
						promotions: [],
					},
				},
				Annual: {
					AUD: {
						price: 424,
						currency: 'AUD',
						fixedTerm: false,
						promotions: [
							{
								name: '10% Off Annual Guardian Weekly Subs',
								description: 'Subscribe for 12 months and save 10%',
								promoCode: '10ANNUAL',
								discountedPrice: 381.6,
								numberOfDiscountedPeriods: 1,
								discount: {
									amount: 10,
									durationMonths: 12,
								},
								landingPage: {
									roundel: 'Subscribe for 12 months and save 10%',
								},
							},
						],
					},
				},
			},
		},
	},
	Canada: {
		Domestic: {
			NoProductOptions: {
				Monthly: {
					CAD: {
						price: 27,
						currency: 'CAD',
						fixedTerm: false,
						promotions: [],
					},
				},
				Quarterly: {
					CAD: {
						price: 80,
						currency: 'CAD',
						fixedTerm: false,
						promotions: [],
					},
				},
				SixWeekly: {
					CAD: {
						price: 27,
						currency: 'CAD',
						fixedTerm: false,
						promotions: [
							{
								name: 'Six For Six',
								description: 'Introductory offer',
								promoCode: '6FOR6',
								introductoryPrice: {
									price: 6,
									periodLength: 6,
									periodType: 'issue',
								},
							},
						],
					},
				},
				Annual: {
					CAD: {
						price: 320,
						currency: 'CAD',
						fixedTerm: false,
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
								landingPage: {
									roundel: 'Subscribe for 12 months and save 10%',
								},
							},
						],
					},
				},
			},
		},
		RestOfWorld: {
			NoProductOptions: {
				Quarterly: {
					CAD: {
						price: 86.25,
						currency: 'CAD',
						fixedTerm: false,
						promotions: [],
					},
				},
				Annual: {
					CAD: {
						price: 345,
						currency: 'CAD',
						fixedTerm: false,
						promotions: [
							{
								name: '10% Off Annual Guardian Weekly Subs',
								description: 'Subscribe for 12 months and save 10%',
								promoCode: '10ANNUAL',
								discountedPrice: 310.5,
								numberOfDiscountedPeriods: 1,
								discount: {
									amount: 10,
									durationMonths: 12,
								},
								landingPage: {
									roundel: 'Subscribe for 12 months and save 10%',
								},
							},
						],
					},
				},
			},
		},
	},
	'United States': {
		Domestic: {
			NoProductOptions: {
				Monthly: {
					USD: {
						price: 25,
						currency: 'USD',
						fixedTerm: false,
						promotions: [],
					},
				},
				Quarterly: {
					USD: {
						price: 75,
						currency: 'USD',
						fixedTerm: false,
						promotions: [],
					},
				},
				SixWeekly: {
					USD: {
						price: 25,
						currency: 'USD',
						fixedTerm: false,
						promotions: [
							{
								name: 'Six For Six',
								description: 'Introductory offer',
								promoCode: '6FOR6',
								introductoryPrice: {
									price: 6,
									periodLength: 6,
									periodType: 'issue',
								},
							},
						],
					},
				},
				Annual: {
					USD: {
						price: 300,
						currency: 'USD',
						fixedTerm: false,
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
								landingPage: {
									roundel: 'Subscribe for 12 months and save 10%',
								},
							},
						],
					},
				},
			},
		},
		RestOfWorld: {
			NoProductOptions: {
				Quarterly: {
					USD: {
						price: 81.3,
						currency: 'USD',
						fixedTerm: false,
						promotions: [],
					},
				},
				Annual: {
					USD: {
						price: 325.2,
						currency: 'USD',
						fixedTerm: false,
						promotions: [
							{
								name: '10% Off Annual Guardian Weekly Subs',
								description: 'Subscribe for 12 months and save 10%',
								promoCode: '10ANNUAL',
								discountedPrice: 292.68,
								numberOfDiscountedPeriods: 1,
								discount: {
									amount: 10,
									durationMonths: 12,
								},
								landingPage: {
									roundel: 'Subscribe for 12 months and save 10%',
								},
							},
						],
					},
				},
				SixWeekly: {
					USD: {
						price: 27.5,
						currency: 'USD',
						fixedTerm: false,
						promotions: [
							{
								name: 'Six For Six',
								description: 'Introductory offer',
								promoCode: '6FOR6',
								introductoryPrice: {
									price: 6,
									periodLength: 6,
									periodType: 'issue',
								},
							},
						],
					},
				},
				Monthly: {
					USD: {
						price: 27.5,
						currency: 'USD',
						fixedTerm: false,
						promotions: [],
					},
				},
			},
		},
	},
	Europe: {
		Domestic: {
			NoProductOptions: {
				Monthly: {
					EUR: {
						price: 21,
						currency: 'EUR',
						fixedTerm: false,
						promotions: [],
					},
				},
				Quarterly: {
					EUR: {
						price: 61.3,
						currency: 'EUR',
						fixedTerm: false,
						promotions: [],
					},
				},
				SixWeekly: {
					EUR: {
						price: 21,
						currency: 'EUR',
						fixedTerm: false,
						promotions: [
							{
								name: 'Six For Six',
								description: 'Introductory offer',
								promoCode: '6FOR6',
								introductoryPrice: {
									price: 6,
									periodLength: 6,
									periodType: 'issue',
								},
							},
						],
					},
				},
				Annual: {
					EUR: {
						price: 245.2,
						currency: 'EUR',
						fixedTerm: false,
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
								landingPage: {
									roundel: 'Subscribe for 12 months and save 10%',
								},
							},
						],
					},
				},
			},
		},
		RestOfWorld: {
			NoProductOptions: {
				Quarterly: {
					EUR: {
						price: 67.5,
						currency: 'EUR',
						fixedTerm: false,
						promotions: [],
					},
				},
				Annual: {
					EUR: {
						price: 270,
						currency: 'EUR',
						fixedTerm: false,
						promotions: [
							{
								name: '10% Off Annual Guardian Weekly Subs',
								description: 'Subscribe for 12 months and save 10%',
								promoCode: '10ANNUAL',
								discountedPrice: 243,
								numberOfDiscountedPeriods: 1,
								discount: {
									amount: 10,
									durationMonths: 12,
								},
								landingPage: {
									roundel: 'Subscribe for 12 months and save 10%',
								},
							},
						],
					},
				},
			},
		},
	},
	International: {
		Domestic: {
			NoProductOptions: {
				Monthly: {
					GBP: {
						price: 12.5,
						currency: 'GBP',
						fixedTerm: false,
						promotions: [],
					},
					USD: {
						price: 25,
						currency: 'USD',
						fixedTerm: false,
						promotions: [],
					},
				},
				Quarterly: {
					GBP: {
						price: 37.5,
						currency: 'GBP',
						fixedTerm: false,
						promotions: [],
					},
					USD: {
						price: 75,
						currency: 'USD',
						fixedTerm: false,
						promotions: [],
					},
				},
				SixWeekly: {
					GBP: {
						price: 12.5,
						currency: 'GBP',
						fixedTerm: false,
						promotions: [
							{
								name: 'Six For Six',
								description: 'Introductory offer',
								promoCode: '6FOR6',
								introductoryPrice: {
									price: 6,
									periodLength: 6,
									periodType: 'issue',
								},
							},
						],
					},
					USD: {
						price: 25,
						currency: 'USD',
						fixedTerm: false,
						promotions: [
							{
								name: 'Six For Six',
								description: 'Introductory offer',
								promoCode: '6FOR6',
								introductoryPrice: {
									price: 6,
									periodLength: 6,
									periodType: 'issue',
								},
							},
						],
					},
				},
				Annual: {
					GBP: {
						price: 150,
						currency: 'GBP',
						fixedTerm: false,
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
								landingPage: {
									roundel: 'Subscribe for 12 months and save 10%',
								},
							},
						],
					},
					USD: {
						price: 300,
						currency: 'USD',
						fixedTerm: false,
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
								landingPage: {
									roundel: 'Subscribe for 12 months and save 10%',
								},
							},
						],
					},
				},
			},
		},
		RestOfWorld: {
			NoProductOptions: {
				Quarterly: {
					GBP: {
						price: 60,
						currency: 'GBP',
						fixedTerm: false,
						promotions: [],
					},
					USD: {
						price: 81.3,
						currency: 'USD',
						fixedTerm: false,
						promotions: [],
					},
				},
				Annual: {
					GBP: {
						price: 240,
						currency: 'GBP',
						fixedTerm: false,
						promotions: [
							{
								name: '10% Off Annual Guardian Weekly Subs',
								description: 'Subscribe for 12 months and save 10%',
								promoCode: '10ANNUAL',
								discountedPrice: 216,
								numberOfDiscountedPeriods: 1,
								discount: {
									amount: 10,
									durationMonths: 12,
								},
								landingPage: {
									roundel: 'Subscribe for 12 months and save 10%',
								},
							},
						],
					},
					USD: {
						price: 325.2,
						currency: 'USD',
						fixedTerm: false,
						promotions: [
							{
								name: '10% Off Annual Guardian Weekly Subs',
								description: 'Subscribe for 12 months and save 10%',
								promoCode: '10ANNUAL',
								discountedPrice: 292.68,
								numberOfDiscountedPeriods: 1,
								discount: {
									amount: 10,
									durationMonths: 12,
								},
								landingPage: {
									roundel: 'Subscribe for 12 months and save 10%',
								},
							},
						],
					},
				},
				SixWeekly: {
					GBP: {
						price: 12.5,
						currency: 'GBP',
						fixedTerm: false,
						promotions: [
							{
								name: 'Six For Six',
								description: 'Introductory offer',
								promoCode: '6FOR6',
								introductoryPrice: {
									price: 6,
									periodLength: 6,
									periodType: 'issue',
								},
							},
						],
					},
					USD: {
						price: 27.5,
						currency: 'USD',
						fixedTerm: false,
						promotions: [
							{
								name: 'Six For Six',
								description: 'Introductory offer',
								promoCode: '6FOR6',
								introductoryPrice: {
									price: 6,
									periodLength: 6,
									periodType: 'issue',
								},
							},
						],
					},
				},
				Monthly: {
					GBP: {
						price: 12.5,
						currency: 'GBP',
						fixedTerm: false,
						promotions: [],
					},
					USD: {
						price: 27.5,
						currency: 'USD',
						fixedTerm: false,
						promotions: [],
					},
				},
			},
		},
	},
};
