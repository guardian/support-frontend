import { expect } from 'storybook/test';
import { ProductPricesSchema } from './window';

test('ProductPricesSchema', () => {
	const allProductPrices = {
		allProductPrices: {
			SupporterPlus: {
				'New Zealand': {
					NoFulfilmentOptions: {
						NoProductOptions: {
							Annual: {
								NZD: {
									price: 200,
									currency: 'NZD',
									fixedTerm: false,
									promotions: [],
								},
							},
							Monthly: {
								NZD: {
									price: 20,
									currency: 'NZD',
									fixedTerm: false,
									promotions: [],
								},
							},
						},
					},
				},
				International: {
					NoFulfilmentOptions: {
						NoProductOptions: {
							Annual: {
								GBP: {
									price: 120,
									currency: 'GBP',
									fixedTerm: false,
									promotions: [],
								},
								USD: {
									price: 150,
									currency: 'USD',
									fixedTerm: false,
									promotions: [],
								},
							},
							Monthly: {
								GBP: {
									price: 12,
									currency: 'GBP',
									fixedTerm: false,
									promotions: [],
								},
								USD: {
									price: 15,
									currency: 'USD',
									fixedTerm: false,
									promotions: [],
								},
							},
						},
					},
				},
				'United Kingdom': {
					NoFulfilmentOptions: {
						NoProductOptions: {
							Annual: {
								GBP: {
									price: 120,
									currency: 'GBP',
									fixedTerm: false,
									promotions: [],
								},
							},
							Monthly: {
								GBP: {
									price: 12,
									currency: 'GBP',
									fixedTerm: false,
									promotions: [],
								},
							},
						},
					},
				},
				Europe: {
					NoFulfilmentOptions: {
						NoProductOptions: {
							Annual: {
								EUR: {
									price: 120,
									currency: 'EUR',
									fixedTerm: false,
									promotions: [],
								},
							},
							Monthly: {
								EUR: {
									price: 12,
									currency: 'EUR',
									fixedTerm: false,
									promotions: [],
								},
							},
						},
					},
				},
				Australia: {
					NoFulfilmentOptions: {
						NoProductOptions: {
							Annual: {
								AUD: {
									price: 200,
									currency: 'AUD',
									fixedTerm: false,
									promotions: [],
								},
							},
							Monthly: {
								AUD: {
									price: 20,
									currency: 'AUD',
									fixedTerm: false,
									promotions: [],
								},
							},
						},
					},
				},
				Canada: {
					NoFulfilmentOptions: {
						NoProductOptions: {
							Annual: {
								CAD: {
									price: 150,
									currency: 'CAD',
									fixedTerm: false,
									promotions: [],
								},
							},
							Monthly: {
								CAD: {
									price: 15,
									currency: 'CAD',
									fixedTerm: false,
									promotions: [],
								},
							},
						},
					},
				},
				'United States': {
					NoFulfilmentOptions: {
						NoProductOptions: {
							Annual: {
								USD: {
									price: 150,
									currency: 'USD',
									fixedTerm: false,
									promotions: [],
								},
							},
							Monthly: {
								USD: {
									price: 15,
									currency: 'USD',
									fixedTerm: false,
									promotions: [],
								},
							},
						},
					},
				},
			},
			Paper: {
				'United Kingdom': {
					Collection: {
						SixdayPlus: {
							Monthly: {
								GBP: {
									price: 58.99,
									savingVsRetail: 27,
									currency: 'GBP',
									fixedTerm: false,
									promotions: [
										{
											name: '2023 April Test',
											description:
												'Spring Discount - Get half price off for 12 months',
											promoCode: 'TEST2023',
											discountedPrice: 44.83,
											numberOfDiscountedPeriods: 12,
											discount: {
												amount: 24,
												durationMonths: 12,
											},
											landingPage: {
												title: 'Get half price off a newspaper subscription',
												description:
													"If you're waiting for our biggest sale of the year - this is it. You'll find plenty to talk about, whichever side of the fence you're on, in every copy of the Guardian and Observer. From news to reviews, climate to culture, your conversations will sparkle. From just £1.53 per issue, you've investing in the future of independent journalism while staying armed with the facts you need for an informed debate.",
												roundel:
													'Spring Discount - Get half price off for 12 months',
											},
											starts: '2023-04-19T00:00:00.000+01:00',
										},
									],
								},
							},
						},
						SaturdayPlus: {
							Monthly: {
								GBP: {
									price: 25.99,
									savingVsRetail: 4,
									currency: 'GBP',
									fixedTerm: false,
									promotions: [
										{
											name: '2023 April Test',
											description:
												'Spring Discount - Get half price off for 12 months',
											promoCode: 'TEST2023',
											discountedPrice: 19.75,
											numberOfDiscountedPeriods: 12,
											discount: {
												amount: 24,
												durationMonths: 12,
											},
											landingPage: {
												title: 'Get half price off a newspaper subscription',
												description:
													"If you're waiting for our biggest sale of the year - this is it. You'll find plenty to talk about, whichever side of the fence you're on, in every copy of the Guardian and Observer. From news to reviews, climate to culture, your conversations will sparkle. From just £1.53 per issue, you've investing in the future of independent journalism while staying armed with the facts you need for an informed debate.",
												roundel:
													'Spring Discount - Get half price off for 12 months',
											},
											starts: '2023-04-19T00:00:00.000+01:00',
										},
									],
								},
							},
						},
						Saturday: {
							Monthly: {
								GBP: {
									price: 15.99,
									savingVsRetail: 7,
									currency: 'GBP',
									fixedTerm: false,
									promotions: [
										{
											name: '2023 April Test',
											description:
												'Spring Discount - Get half price off for 12 months',
											promoCode: 'TEST2023',
											discountedPrice: 12.15,
											numberOfDiscountedPeriods: 12,
											discount: {
												amount: 24,
												durationMonths: 12,
											},
											landingPage: {
												title: 'Get half price off a newspaper subscription',
												description:
													"If you're waiting for our biggest sale of the year - this is it. You'll find plenty to talk about, whichever side of the fence you're on, in every copy of the Guardian and Observer. From news to reviews, climate to culture, your conversations will sparkle. From just £1.53 per issue, you've investing in the future of independent journalism while staying armed with the facts you need for an informed debate.",
												roundel:
													'Spring Discount - Get half price off for 12 months',
											},
											starts: '2023-04-19T00:00:00.000+01:00',
										},
									],
								},
							},
						},
						Sixday: {
							Monthly: {
								GBP: {
									price: 61.99,
									savingVsRetail: 24,
									currency: 'GBP',
									fixedTerm: false,
									promotions: [
										{
											name: '2023 April Test',
											description:
												'Spring Discount - Get half price off for 12 months',
											promoCode: 'TEST2023',
											discountedPrice: 47.11,
											numberOfDiscountedPeriods: 12,
											discount: {
												amount: 24,
												durationMonths: 12,
											},
											landingPage: {
												title: 'Get half price off a newspaper subscription',
												description:
													"If you're waiting for our biggest sale of the year - this is it. You'll find plenty to talk about, whichever side of the fence you're on, in every copy of the Guardian and Observer. From news to reviews, climate to culture, your conversations will sparkle. From just £1.53 per issue, you've investing in the future of independent journalism while staying armed with the facts you need for an informed debate.",
												roundel:
													'Spring Discount - Get half price off for 12 months',
											},
											starts: '2023-04-19T00:00:00.000+01:00',
										},
									],
								},
							},
						},
						Weekend: {
							Monthly: {
								GBP: {
									price: 26.99,
									savingVsRetail: 22,
									currency: 'GBP',
									fixedTerm: false,
									promotions: [
										{
											name: '2023 April Test',
											description:
												'Spring Discount - Get half price off for 12 months',
											promoCode: 'TEST2023',
											discountedPrice: 20.51,
											numberOfDiscountedPeriods: 12,
											discount: {
												amount: 24,
												durationMonths: 12,
											},
											landingPage: {
												title: 'Get half price off a newspaper subscription',
												description:
													"If you're waiting for our biggest sale of the year - this is it. You'll find plenty to talk about, whichever side of the fence you're on, in every copy of the Guardian and Observer. From news to reviews, climate to culture, your conversations will sparkle. From just £1.53 per issue, you've investing in the future of independent journalism while staying armed with the facts you need for an informed debate.",
												roundel:
													'Spring Discount - Get half price off for 12 months',
											},
											starts: '2023-04-19T00:00:00.000+01:00',
										},
									],
								},
							},
						},
						Sunday: {
							Monthly: {
								GBP: {
									price: 15.99,
									savingVsRetail: 7,
									currency: 'GBP',
									fixedTerm: false,
									promotions: [
										{
											name: '2023 April Test',
											description:
												'Spring Discount - Get half price off for 12 months',
											promoCode: 'TEST2023',
											discountedPrice: 12.15,
											numberOfDiscountedPeriods: 12,
											discount: {
												amount: 24,
												durationMonths: 12,
											},
											landingPage: {
												title: 'Get half price off a newspaper subscription',
												description:
													"If you're waiting for our biggest sale of the year - this is it. You'll find plenty to talk about, whichever side of the fence you're on, in every copy of the Guardian and Observer. From news to reviews, climate to culture, your conversations will sparkle. From just £1.53 per issue, you've investing in the future of independent journalism while staying armed with the facts you need for an informed debate.",
												roundel:
													'Spring Discount - Get half price off for 12 months',
											},
											starts: '2023-04-19T00:00:00.000+01:00',
										},
									],
								},
							},
						},
						WeekendPlus: {
							Monthly: {
								GBP: {
									price: 34.99,
									savingVsRetail: 17,
									currency: 'GBP',
									fixedTerm: false,
									promotions: [
										{
											name: '2023 April Test',
											description:
												'Spring Discount - Get half price off for 12 months',
											promoCode: 'TEST2023',
											discountedPrice: 26.59,
											numberOfDiscountedPeriods: 12,
											discount: {
												amount: 24,
												durationMonths: 12,
											},
											landingPage: {
												title: 'Get half price off a newspaper subscription',
												description:
													"If you're waiting for our biggest sale of the year - this is it. You'll find plenty to talk about, whichever side of the fence you're on, in every copy of the Guardian and Observer. From news to reviews, climate to culture, your conversations will sparkle. From just £1.53 per issue, you've investing in the future of independent journalism while staying armed with the facts you need for an informed debate.",
												roundel:
													'Spring Discount - Get half price off for 12 months',
											},
											starts: '2023-04-19T00:00:00.000+01:00',
										},
									],
								},
							},
						},
						Everyday: {
							Monthly: {
								GBP: {
									price: 69.99,
									savingVsRetail: 29,
									currency: 'GBP',
									fixedTerm: false,
									promotions: [
										{
											name: '2023 April Test',
											description:
												'Spring Discount - Get half price off for 12 months',
											promoCode: 'TEST2023',
											discountedPrice: 53.19,
											numberOfDiscountedPeriods: 12,
											discount: {
												amount: 24,
												durationMonths: 12,
											},
											landingPage: {
												title: 'Get half price off a newspaper subscription',
												description:
													"If you're waiting for our biggest sale of the year - this is it. You'll find plenty to talk about, whichever side of the fence you're on, in every copy of the Guardian and Observer. From news to reviews, climate to culture, your conversations will sparkle. From just £1.53 per issue, you've investing in the future of independent journalism while staying armed with the facts you need for an informed debate.",
												roundel:
													'Spring Discount - Get half price off for 12 months',
											},
											starts: '2023-04-19T00:00:00.000+01:00',
										},
									],
								},
							},
						},
						EverydayPlus: {
							Monthly: {
								GBP: {
									price: 66.99,
									savingVsRetail: 30,
									currency: 'GBP',
									fixedTerm: false,
									promotions: [
										{
											name: '2023 April Test',
											description:
												'Spring Discount - Get half price off for 12 months',
											promoCode: 'TEST2023',
											discountedPrice: 50.91,
											numberOfDiscountedPeriods: 12,
											discount: {
												amount: 24,
												durationMonths: 12,
											},
											landingPage: {
												title: 'Get half price off a newspaper subscription',
												description:
													"If you're waiting for our biggest sale of the year - this is it. You'll find plenty to talk about, whichever side of the fence you're on, in every copy of the Guardian and Observer. From news to reviews, climate to culture, your conversations will sparkle. From just £1.53 per issue, you've investing in the future of independent journalism while staying armed with the facts you need for an informed debate.",
												roundel:
													'Spring Discount - Get half price off for 12 months',
											},
											starts: '2023-04-19T00:00:00.000+01:00',
										},
									],
								},
							},
						},
					},
					HomeDelivery: {
						SixdayPlus: {
							Monthly: {
								GBP: {
									price: 70.99,
									savingVsRetail: 12,
									currency: 'GBP',
									fixedTerm: false,
									promotions: [
										{
											name: '2023 April Test',
											description:
												'Spring Discount - Get half price off for 12 months',
											promoCode: 'TEST2023',
											discountedPrice: 53.95,
											numberOfDiscountedPeriods: 12,
											discount: {
												amount: 24,
												durationMonths: 12,
											},
											landingPage: {
												title: 'Get half price off a newspaper subscription',
												description:
													"If you're waiting for our biggest sale of the year - this is it. You'll find plenty to talk about, whichever side of the fence you're on, in every copy of the Guardian and Observer. From news to reviews, climate to culture, your conversations will sparkle. From just £1.53 per issue, you've investing in the future of independent journalism while staying armed with the facts you need for an informed debate.",
												roundel:
													'Spring Discount - Get half price off for 12 months',
											},
											starts: '2023-04-19T00:00:00.000+01:00',
										},
									],
								},
							},
						},
						SaturdayPlus: {
							Monthly: {
								GBP: {
									price: 30.99,
									savingVsRetail: -14,
									currency: 'GBP',
									fixedTerm: false,
									promotions: [
										{
											name: '2023 April Test',
											description:
												'Spring Discount - Get half price off for 12 months',
											promoCode: 'TEST2023',
											discountedPrice: 23.55,
											numberOfDiscountedPeriods: 12,
											discount: {
												amount: 24,
												durationMonths: 12,
											},
											landingPage: {
												title: 'Get half price off a newspaper subscription',
												description:
													"If you're waiting for our biggest sale of the year - this is it. You'll find plenty to talk about, whichever side of the fence you're on, in every copy of the Guardian and Observer. From news to reviews, climate to culture, your conversations will sparkle. From just £1.53 per issue, you've investing in the future of independent journalism while staying armed with the facts you need for an informed debate.",
												roundel:
													'Spring Discount - Get half price off for 12 months',
											},
											starts: '2023-04-19T00:00:00.000+01:00',
										},
									],
								},
							},
						},
						Saturday: {
							Monthly: {
								GBP: {
									price: 20.99,
									savingVsRetail: -15,
									currency: 'GBP',
									fixedTerm: false,
									promotions: [
										{
											name: '2023 April Test',
											description:
												'Spring Discount - Get half price off for 12 months',
											promoCode: 'TEST2023',
											discountedPrice: 15.95,
											numberOfDiscountedPeriods: 12,
											discount: {
												amount: 24,
												durationMonths: 12,
											},
											landingPage: {
												title: 'Get half price off a newspaper subscription',
												description:
													"If you're waiting for our biggest sale of the year - this is it. You'll find plenty to talk about, whichever side of the fence you're on, in every copy of the Guardian and Observer. From news to reviews, climate to culture, your conversations will sparkle. From just £1.53 per issue, you've investing in the future of independent journalism while staying armed with the facts you need for an informed debate.",
												roundel:
													'Spring Discount - Get half price off for 12 months',
											},
											starts: '2023-04-19T00:00:00.000+01:00',
										},
									],
								},
							},
						},
						Sixday: {
							Monthly: {
								GBP: {
									price: 73.99,
									savingVsRetail: 10,
									currency: 'GBP',
									fixedTerm: false,
									promotions: [
										{
											name: '2023 April Test',
											description:
												'Spring Discount - Get half price off for 12 months',
											promoCode: 'TEST2023',
											discountedPrice: 56.23,
											numberOfDiscountedPeriods: 12,
											discount: {
												amount: 24,
												durationMonths: 12,
											},
											landingPage: {
												title: 'Get half price off a newspaper subscription',
												description:
													"If you're waiting for our biggest sale of the year - this is it. You'll find plenty to talk about, whichever side of the fence you're on, in every copy of the Guardian and Observer. From news to reviews, climate to culture, your conversations will sparkle. From just £1.53 per issue, you've investing in the future of independent journalism while staying armed with the facts you need for an informed debate.",
												roundel:
													'Spring Discount - Get half price off for 12 months',
											},
											starts: '2023-04-19T00:00:00.000+01:00',
										},
									],
								},
							},
						},
						Weekend: {
							Monthly: {
								GBP: {
									price: 33.99,
									savingVsRetail: 1,
									currency: 'GBP',
									fixedTerm: false,
									promotions: [
										{
											name: '2023 April Test',
											description:
												'Spring Discount - Get half price off for 12 months',
											promoCode: 'TEST2023',
											discountedPrice: 25.83,
											numberOfDiscountedPeriods: 12,
											discount: {
												amount: 24,
												durationMonths: 12,
											},
											landingPage: {
												title: 'Get half price off a newspaper subscription',
												description:
													"If you're waiting for our biggest sale of the year - this is it. You'll find plenty to talk about, whichever side of the fence you're on, in every copy of the Guardian and Observer. From news to reviews, climate to culture, your conversations will sparkle. From just £1.53 per issue, you've investing in the future of independent journalism while staying armed with the facts you need for an informed debate.",
												roundel:
													'Spring Discount - Get half price off for 12 months',
											},
											starts: '2023-04-19T00:00:00.000+01:00',
										},
									],
								},
							},
						},
						Sunday: {
							Monthly: {
								GBP: {
									price: 20.99,
									savingVsRetail: -15,
									currency: 'GBP',
									fixedTerm: false,
									promotions: [
										{
											name: '2023 April Test',
											description:
												'Spring Discount - Get half price off for 12 months',
											promoCode: 'TEST2023',
											discountedPrice: 15.95,
											numberOfDiscountedPeriods: 12,
											discount: {
												amount: 24,
												durationMonths: 12,
											},
											landingPage: {
												title: 'Get half price off a newspaper subscription',
												description:
													"If you're waiting for our biggest sale of the year - this is it. You'll find plenty to talk about, whichever side of the fence you're on, in every copy of the Guardian and Observer. From news to reviews, climate to culture, your conversations will sparkle. From just £1.53 per issue, you've investing in the future of independent journalism while staying armed with the facts you need for an informed debate.",
												roundel:
													'Spring Discount - Get half price off for 12 months',
											},
											starts: '2023-04-19T00:00:00.000+01:00',
										},
									],
								},
							},
						},
						WeekendPlus: {
							Monthly: {
								GBP: {
									price: 40.99,
									savingVsRetail: 3,
									currency: 'GBP',
									fixedTerm: false,
									promotions: [
										{
											name: '2023 April Test',
											description:
												'Spring Discount - Get half price off for 12 months',
											promoCode: 'TEST2023',
											discountedPrice: 31.15,
											numberOfDiscountedPeriods: 12,
											discount: {
												amount: 24,
												durationMonths: 12,
											},
											landingPage: {
												title: 'Get half price off a newspaper subscription',
												description:
													"If you're waiting for our biggest sale of the year - this is it. You'll find plenty to talk about, whichever side of the fence you're on, in every copy of the Guardian and Observer. From news to reviews, climate to culture, your conversations will sparkle. From just £1.53 per issue, you've investing in the future of independent journalism while staying armed with the facts you need for an informed debate.",
												roundel:
													'Spring Discount - Get half price off for 12 months',
											},
											starts: '2023-04-19T00:00:00.000+01:00',
										},
									],
								},
							},
						},
						Everyday: {
							Monthly: {
								GBP: {
									price: 83.99,
									savingVsRetail: 15,
									currency: 'GBP',
									fixedTerm: false,
									promotions: [
										{
											name: '2023 April Test',
											description:
												'Spring Discount - Get half price off for 12 months',
											promoCode: 'TEST2023',
											discountedPrice: 63.83,
											numberOfDiscountedPeriods: 12,
											discount: {
												amount: 24,
												durationMonths: 12,
											},
											landingPage: {
												title: 'Get half price off a newspaper subscription',
												description:
													"If you're waiting for our biggest sale of the year - this is it. You'll find plenty to talk about, whichever side of the fence you're on, in every copy of the Guardian and Observer. From news to reviews, climate to culture, your conversations will sparkle. From just £1.53 per issue, you've investing in the future of independent journalism while staying armed with the facts you need for an informed debate.",
												roundel:
													'Spring Discount - Get half price off for 12 months',
											},
											starts: '2023-04-19T00:00:00.000+01:00',
										},
									],
								},
							},
						},
						EverydayPlus: {
							Monthly: {
								GBP: {
									price: 80.99,
									savingVsRetail: 16,
									currency: 'GBP',
									fixedTerm: false,
									promotions: [
										{
											name: '2023 April Test',
											description:
												'Spring Discount - Get half price off for 12 months',
											promoCode: 'TEST2023',
											discountedPrice: 61.55,
											numberOfDiscountedPeriods: 12,
											discount: {
												amount: 24,
												durationMonths: 12,
											},
											landingPage: {
												title: 'Get half price off a newspaper subscription',
												description:
													"If you're waiting for our biggest sale of the year - this is it. You'll find plenty to talk about, whichever side of the fence you're on, in every copy of the Guardian and Observer. From news to reviews, climate to culture, your conversations will sparkle. From just £1.53 per issue, you've investing in the future of independent journalism while staying armed with the facts you need for an informed debate.",
												roundel:
													'Spring Discount - Get half price off for 12 months',
											},
											starts: '2023-04-19T00:00:00.000+01:00',
										},
									],
								},
							},
						},
					},
					NationalDelivery: {
						Sixday: {
							Monthly: {
								GBP: {
									price: 73.99,
									savingVsRetail: 15,
									currency: 'GBP',
									fixedTerm: false,
									promotions: [
										{
											name: '2023 April Test',
											description:
												'Spring Discount - Get half price off for 12 months',
											promoCode: 'TEST2023',
											discountedPrice: 56.23,
											numberOfDiscountedPeriods: 12,
											discount: {
												amount: 24,
												durationMonths: 12,
											},
											landingPage: {
												title: 'Get half price off a newspaper subscription',
												description:
													"If you're waiting for our biggest sale of the year - this is it. You'll find plenty to talk about, whichever side of the fence you're on, in every copy of the Guardian and Observer. From news to reviews, climate to culture, your conversations will sparkle. From just £1.53 per issue, you've investing in the future of independent journalism while staying armed with the facts you need for an informed debate.",
												roundel:
													'Spring Discount - Get half price off for 12 months',
											},
											starts: '2023-04-19T00:00:00.000+01:00',
										},
									],
								},
							},
						},
						Weekend: {
							Monthly: {
								GBP: {
									price: 33.99,
									savingVsRetail: 8,
									currency: 'GBP',
									fixedTerm: false,
									promotions: [
										{
											name: '2023 April Test',
											description:
												'Spring Discount - Get half price off for 12 months',
											promoCode: 'TEST2023',
											discountedPrice: 25.83,
											numberOfDiscountedPeriods: 12,
											discount: {
												amount: 24,
												durationMonths: 12,
											},
											landingPage: {
												title: 'Get half price off a newspaper subscription',
												description:
													"If you're waiting for our biggest sale of the year - this is it. You'll find plenty to talk about, whichever side of the fence you're on, in every copy of the Guardian and Observer. From news to reviews, climate to culture, your conversations will sparkle. From just £1.53 per issue, you've investing in the future of independent journalism while staying armed with the facts you need for an informed debate.",
												roundel:
													'Spring Discount - Get half price off for 12 months',
											},
											starts: '2023-04-19T00:00:00.000+01:00',
										},
									],
								},
							},
						},
						Everyday: {
							Monthly: {
								GBP: {
									price: 83.99,
									savingVsRetail: 20,
									currency: 'GBP',
									fixedTerm: false,
									promotions: [
										{
											name: '2023 April Test',
											description:
												'Spring Discount - Get half price off for 12 months',
											promoCode: 'TEST2023',
											discountedPrice: 63.83,
											numberOfDiscountedPeriods: 12,
											discount: {
												amount: 24,
												durationMonths: 12,
											},
											landingPage: {
												title: 'Get half price off a newspaper subscription',
												description:
													"If you're waiting for our biggest sale of the year - this is it. You'll find plenty to talk about, whichever side of the fence you're on, in every copy of the Guardian and Observer. From news to reviews, climate to culture, your conversations will sparkle. From just £1.53 per issue, you've investing in the future of independent journalism while staying armed with the facts you need for an informed debate.",
												roundel:
													'Spring Discount - Get half price off for 12 months',
											},
											starts: '2023-04-19T00:00:00.000+01:00',
										},
									],
								},
							},
						},
					},
				},
			},
		},
	};
	const result = ProductPricesSchema.safeParse(allProductPrices);
	if (result.success) {
		const allProductPrices = result.data.allProductPrices;
		expect(allProductPrices.Contribution).toBeUndefined;
		expect(allProductPrices.SupporterPlus).toBeDefined;
	}
});
