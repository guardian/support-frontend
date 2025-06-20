import { expect } from '@storybook/test';
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
			TierThree: {
				'New Zealand': {
					Domestic: {
						NoProductOptions: {
							Monthly: {
								NZD: {
									price: 70,
									currency: 'NZD',
									fixedTerm: false,
									promotions: [
										{
											name: 'Tier Three SupporterPlus Guardian Weekly NZ Monthly',
											description:
												'Tier Three SupporterPlus Guardian Weekly NZ Monthly',
											promoCode: 'TIER3_NZ_MONTHLY',
											discountedPrice: 50.75,
											numberOfDiscountedPeriods: 12,
											discount: {
												amount: 27.5,
												durationMonths: 12,
											},
											starts: '2024-07-01T00:00:00.000+01:00',
										},
									],
								},
							},
							Annual: {
								NZD: {
									price: 800,
									currency: 'NZD',
									fixedTerm: false,
									promotions: [
										{
											name: 'Tier Three SupporterPlus Guardian Weekly NZ Annual',
											description:
												'Tier Three SupporterPlus Guardian Weekly NZ Annual',
											promoCode: 'TIER3_NZ_ANNUAL',
											discountedPrice: 617.14,
											numberOfDiscountedPeriods: 1,
											discount: {
												amount: 22.8571,
												durationMonths: 12,
											},
											starts: '2024-07-01T00:00:00.000+01:00',
										},
									],
								},
							},
						},
						NewspaperArchive: {
							Annual: {
								NZD: {
									price: 824,
									currency: 'NZD',
									fixedTerm: false,
									promotions: [
										{
											name: 'Tier Three SupporterPlus Guardian Weekly NZ Annual',
											description:
												'Tier Three SupporterPlus Guardian Weekly NZ Annual',
											promoCode: 'TIER3_NZ_ANNUAL',
											discountedPrice: 635.66,
											numberOfDiscountedPeriods: 1,
											discount: {
												amount: 22.8571,
												durationMonths: 12,
											},
											starts: '2024-07-01T00:00:00.000+01:00',
										},
									],
								},
							},
							Monthly: {
								NZD: {
									price: 72,
									savingVsRetail: 5,
									currency: 'NZD',
									fixedTerm: false,
									promotions: [
										{
											name: 'Tier Three SupporterPlus Guardian Weekly NZ Monthly',
											description:
												'Tier Three SupporterPlus Guardian Weekly NZ Monthly',
											promoCode: 'TIER3_NZ_MONTHLY',
											discountedPrice: 52.2,
											numberOfDiscountedPeriods: 12,
											discount: {
												amount: 27.5,
												durationMonths: 12,
											},
											starts: '2024-07-01T00:00:00.000+01:00',
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
									price: 27,
									currency: 'GBP',
									fixedTerm: false,
									promotions: [],
								},
								USD: {
									price: 45,
									currency: 'USD',
									fixedTerm: false,
									promotions: [],
								},
							},
							Annual: {
								GBP: {
									price: 300,
									currency: 'GBP',
									fixedTerm: false,
									promotions: [],
								},
								USD: {
									price: 510,
									currency: 'USD',
									fixedTerm: false,
									promotions: [],
								},
							},
						},
						NewspaperArchive: {
							Annual: {
								GBP: {
									price: 324,
									currency: 'GBP',
									fixedTerm: false,
									promotions: [],
								},
								USD: {
									price: 534,
									currency: 'USD',
									fixedTerm: false,
									promotions: [],
								},
							},
							Monthly: {
								GBP: {
									price: 29,
									savingVsRetail: 5,
									currency: 'GBP',
									fixedTerm: false,
									promotions: [],
								},
								USD: {
									price: 47,
									savingVsRetail: 5,
									currency: 'USD',
									fixedTerm: false,
									promotions: [],
								},
							},
						},
					},
					RestOfWorld: {
						NewspaperArchive: {
							Monthly: {
								GBP: {
									price: 38.8,
									currency: 'GBP',
									fixedTerm: false,
									promotions: [
										{
											name: 'Tier Three SupporterPlus Guardian Weekly INT Monthly',
											description:
												'Tier Three SupporterPlus Guardian Weekly INT Monthly',
											promoCode: 'TIER3_INT_MONTHLY',
											discountedPrice: 29.1,
											numberOfDiscountedPeriods: 12,
											discount: {
												amount: 25,
												durationMonths: 12,
											},
											starts: '2024-07-01T00:00:00.000+01:00',
										},
									],
								},
								USD: {
									price: 50,
									currency: 'USD',
									fixedTerm: false,
									promotions: [
										{
											name: 'Tier Three SupporterPlus Guardian Weekly INT Monthly',
											description:
												'Tier Three SupporterPlus Guardian Weekly INT Monthly',
											promoCode: 'TIER3_INT_MONTHLY',
											discountedPrice: 37.5,
											numberOfDiscountedPeriods: 12,
											discount: {
												amount: 25,
												durationMonths: 12,
											},
											starts: '2024-07-01T00:00:00.000+01:00',
										},
									],
								},
							},
							Annual: {
								GBP: {
									price: 441.6,
									currency: 'GBP',
									fixedTerm: false,
									promotions: [
										{
											name: 'Tier Three SupporterPlus Guardian Weekly INT Annual',
											description:
												'Tier Three SupporterPlus Guardian Weekly INT Annual',
											promoCode: 'TIER3_INT_ANNUAL',
											discountedPrice: 315.43,
											numberOfDiscountedPeriods: 1,
											discount: {
												amount: 28.5714,
												durationMonths: 12,
											},
											starts: '2024-07-01T00:00:00.000+01:00',
										},
									],
								},
								USD: {
									price: 570,
									currency: 'USD',
									fixedTerm: false,
									promotions: [
										{
											name: 'Tier Three SupporterPlus Guardian Weekly INT Annual',
											description:
												'Tier Three SupporterPlus Guardian Weekly INT Annual',
											promoCode: 'TIER3_INT_ANNUAL',
											discountedPrice: 407.15,
											numberOfDiscountedPeriods: 1,
											discount: {
												amount: 28.5714,
												durationMonths: 12,
											},
											starts: '2024-07-01T00:00:00.000+01:00',
										},
									],
								},
							},
						},
						NoProductOptions: {
							Annual: {
								GBP: {
									price: 417.6,
									currency: 'GBP',
									fixedTerm: false,
									promotions: [
										{
											name: 'Tier Three SupporterPlus Guardian Weekly INT Annual',
											description:
												'Tier Three SupporterPlus Guardian Weekly INT Annual',
											promoCode: 'TIER3_INT_ANNUAL',
											discountedPrice: 298.29,
											numberOfDiscountedPeriods: 1,
											discount: {
												amount: 28.5714,
												durationMonths: 12,
											},
											starts: '2024-07-01T00:00:00.000+01:00',
										},
									],
								},
								USD: {
									price: 546,
									currency: 'USD',
									fixedTerm: false,
									promotions: [
										{
											name: 'Tier Three SupporterPlus Guardian Weekly INT Annual',
											description:
												'Tier Three SupporterPlus Guardian Weekly INT Annual',
											promoCode: 'TIER3_INT_ANNUAL',
											discountedPrice: 390,
											numberOfDiscountedPeriods: 1,
											discount: {
												amount: 28.5714,
												durationMonths: 12,
											},
											starts: '2024-07-01T00:00:00.000+01:00',
										},
									],
								},
							},
							Monthly: {
								GBP: {
									price: 36.8,
									currency: 'GBP',
									fixedTerm: false,
									promotions: [
										{
											name: 'Tier Three SupporterPlus Guardian Weekly INT Monthly',
											description:
												'Tier Three SupporterPlus Guardian Weekly INT Monthly',
											promoCode: 'TIER3_INT_MONTHLY',
											discountedPrice: 27.6,
											numberOfDiscountedPeriods: 12,
											discount: {
												amount: 25,
												durationMonths: 12,
											},
											starts: '2024-07-01T00:00:00.000+01:00',
										},
									],
								},
								USD: {
									price: 48,
									currency: 'USD',
									fixedTerm: false,
									promotions: [
										{
											name: 'Tier Three SupporterPlus Guardian Weekly INT Monthly',
											description:
												'Tier Three SupporterPlus Guardian Weekly INT Monthly',
											promoCode: 'TIER3_INT_MONTHLY',
											discountedPrice: 36,
											numberOfDiscountedPeriods: 12,
											discount: {
												amount: 25,
												durationMonths: 12,
											},
											starts: '2024-07-01T00:00:00.000+01:00',
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
									price: 27,
									currency: 'GBP',
									fixedTerm: false,
									promotions: [],
								},
							},
							Annual: {
								GBP: {
									price: 300,
									currency: 'GBP',
									fixedTerm: false,
									promotions: [
										{
											name: 'Tier Three SupporterPlus Guardian Weekly UK Annual',
											description:
												'Tier Three SupporterPlus Guardian Weekly UK Annual',
											promoCode: 'TIER3_UK_ANNUAL',
											discountedPrice: 190,
											numberOfDiscountedPeriods: 1,
											discount: {
												amount: 36.6667,
												durationMonths: 12,
											},
											starts: '2024-07-01T00:00:00.000+01:00',
										},
									],
								},
							},
						},
						NewspaperArchive: {
							Annual: {
								GBP: {
									price: 324,
									currency: 'GBP',
									fixedTerm: false,
									promotions: [
										{
											name: 'Tier Three SupporterPlus Guardian Weekly UK Annual',
											description:
												'Tier Three SupporterPlus Guardian Weekly UK Annual',
											promoCode: 'TIER3_UK_ANNUAL',
											discountedPrice: 205.2,
											numberOfDiscountedPeriods: 1,
											discount: {
												amount: 36.6667,
												durationMonths: 12,
											},
											starts: '2024-07-01T00:00:00.000+01:00',
										},
									],
								},
							},
							Monthly: {
								GBP: {
									price: 29,
									savingVsRetail: 5,
									currency: 'GBP',
									fixedTerm: false,
									promotions: [],
								},
							},
						},
					},
					RestOfWorld: {
						NewspaperArchive: {
							Monthly: {
								GBP: {
									price: 38.8,
									currency: 'GBP',
									fixedTerm: false,
									promotions: [],
								},
							},
							Annual: {
								GBP: {
									price: 441.6,
									currency: 'GBP',
									fixedTerm: false,
									promotions: [],
								},
							},
						},
						NoProductOptions: {
							Annual: {
								GBP: {
									price: 417.6,
									currency: 'GBP',
									fixedTerm: false,
									promotions: [],
								},
							},
							Monthly: {
								GBP: {
									price: 36.8,
									currency: 'GBP',
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
									price: 38.5,
									currency: 'EUR',
									fixedTerm: false,
									promotions: [
										{
											name: 'Tier Three SupporterPlus Guardian Weekly EU Monthly',
											description:
												'Tier Three SupporterPlus Guardian Weekly EU Monthly',
											promoCode: 'TIER3_EU_MONTHLY',
											discountedPrice: 30,
											numberOfDiscountedPeriods: 12,
											discount: {
												amount: 22.09,
												durationMonths: 12,
											},
											starts: '2024-07-01T00:00:00.000+01:00',
										},
									],
								},
							},
							Annual: {
								EUR: {
									price: 438,
									currency: 'EUR',
									fixedTerm: false,
									promotions: [
										{
											name: 'Tier Three SupporterPlus Guardian Weekly EU Annual',
											description:
												'Tier Three SupporterPlus Guardian Weekly EU Annual',
											promoCode: 'TIER3_EU_ANNUAL',
											discountedPrice: 325,
											numberOfDiscountedPeriods: 1,
											discount: {
												amount: 25.7991,
												durationMonths: 12,
											},
											starts: '2024-07-01T00:00:00.000+01:00',
										},
									],
								},
							},
						},
						NewspaperArchive: {
							Annual: {
								EUR: {
									price: 462,
									currency: 'EUR',
									fixedTerm: false,
									promotions: [
										{
											name: 'Tier Three SupporterPlus Guardian Weekly EU Annual',
											description:
												'Tier Three SupporterPlus Guardian Weekly EU Annual',
											promoCode: 'TIER3_EU_ANNUAL',
											discountedPrice: 342.81,
											numberOfDiscountedPeriods: 1,
											discount: {
												amount: 25.7991,
												durationMonths: 12,
											},
											starts: '2024-07-01T00:00:00.000+01:00',
										},
									],
								},
							},
							Monthly: {
								EUR: {
									price: 40.5,
									savingVsRetail: 5,
									currency: 'EUR',
									fixedTerm: false,
									promotions: [
										{
											name: 'Tier Three SupporterPlus Guardian Weekly EU Monthly',
											description:
												'Tier Three SupporterPlus Guardian Weekly EU Monthly',
											promoCode: 'TIER3_EU_MONTHLY',
											discountedPrice: 31.55,
											numberOfDiscountedPeriods: 12,
											discount: {
												amount: 22.09,
												durationMonths: 12,
											},
											starts: '2024-07-01T00:00:00.000+01:00',
										},
									],
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
									price: 60,
									currency: 'AUD',
									fixedTerm: false,
									promotions: [
										{
											name: 'Tier Three SupporterPlus Guardian Weekly AU Monthly',
											description:
												'Tier Three SupporterPlus Guardian Weekly AU Monthly',
											promoCode: 'TIER3_AU_MONTHLY',
											discountedPrice: 48,
											numberOfDiscountedPeriods: 12,
											discount: {
												amount: 20,
												durationMonths: 12,
											},
											starts: '2024-07-01T00:00:00.000+01:00',
										},
									],
								},
							},
							Annual: {
								AUD: {
									price: 680,
									currency: 'AUD',
									fixedTerm: false,
									promotions: [
										{
											name: 'Tier Three SupporterPlus Guardian Weekly AU Annual',
											description:
												'Tier Three SupporterPlus Guardian Weekly AU Annual',
											promoCode: 'TIER3_AU_ANNUAL',
											discountedPrice: 520,
											numberOfDiscountedPeriods: 1,
											discount: {
												amount: 23.5294,
												durationMonths: 12,
											},
											starts: '2024-07-01T00:00:00.000+01:00',
										},
									],
								},
							},
						},
						NewspaperArchive: {
							Annual: {
								AUD: {
									price: 704,
									currency: 'AUD',
									fixedTerm: false,
									promotions: [
										{
											name: 'Tier Three SupporterPlus Guardian Weekly AU Annual',
											description:
												'Tier Three SupporterPlus Guardian Weekly AU Annual',
											promoCode: 'TIER3_AU_ANNUAL',
											discountedPrice: 538.36,
											numberOfDiscountedPeriods: 1,
											discount: {
												amount: 23.5294,
												durationMonths: 12,
											},
											starts: '2024-07-01T00:00:00.000+01:00',
										},
									],
								},
							},
							Monthly: {
								AUD: {
									price: 62,
									savingVsRetail: 5,
									currency: 'AUD',
									fixedTerm: false,
									promotions: [
										{
											name: 'Tier Three SupporterPlus Guardian Weekly AU Monthly',
											description:
												'Tier Three SupporterPlus Guardian Weekly AU Monthly',
											promoCode: 'TIER3_AU_MONTHLY',
											discountedPrice: 49.6,
											numberOfDiscountedPeriods: 12,
											discount: {
												amount: 20,
												durationMonths: 12,
											},
											starts: '2024-07-01T00:00:00.000+01:00',
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
									price: 48,
									currency: 'CAD',
									fixedTerm: false,
									promotions: [
										{
											name: 'Tier Three SupporterPlus Guardian Weekly CA Monthly',
											description:
												'Tier Three SupporterPlus Guardian Weekly CA Monthly',
											promoCode: 'TIER3_CA_MONTHLY',
											discountedPrice: 37,
											numberOfDiscountedPeriods: 12,
											discount: {
												amount: 22.92,
												durationMonths: 12,
											},
											starts: '2024-07-01T00:00:00.000+01:00',
										},
									],
								},
							},
							Annual: {
								CAD: {
									price: 546,
									currency: 'CAD',
									fixedTerm: false,
									promotions: [
										{
											name: 'Tier Three SupporterPlus Guardian Weekly CA Annual',
											description:
												'Tier Three SupporterPlus Guardian Weekly CA Annual',
											promoCode: 'TIER3_CA_ANNUAL',
											discountedPrice: 400,
											numberOfDiscountedPeriods: 1,
											discount: {
												amount: 26.7399,
												durationMonths: 12,
											},
											starts: '2024-07-01T00:00:00.000+01:00',
										},
									],
								},
							},
						},
						NewspaperArchive: {
							Annual: {
								CAD: {
									price: 570,
									currency: 'CAD',
									fixedTerm: false,
									promotions: [
										{
											name: 'Tier Three SupporterPlus Guardian Weekly CA Annual',
											description:
												'Tier Three SupporterPlus Guardian Weekly CA Annual',
											promoCode: 'TIER3_CA_ANNUAL',
											discountedPrice: 417.58,
											numberOfDiscountedPeriods: 1,
											discount: {
												amount: 26.7399,
												durationMonths: 12,
											},
											starts: '2024-07-01T00:00:00.000+01:00',
										},
									],
								},
							},
							Monthly: {
								CAD: {
									price: 50,
									savingVsRetail: 5,
									currency: 'CAD',
									fixedTerm: false,
									promotions: [
										{
											name: 'Tier Three SupporterPlus Guardian Weekly CA Monthly',
											description:
												'Tier Three SupporterPlus Guardian Weekly CA Monthly',
											promoCode: 'TIER3_CA_MONTHLY',
											discountedPrice: 38.54,
											numberOfDiscountedPeriods: 12,
											discount: {
												amount: 22.92,
												durationMonths: 12,
											},
											starts: '2024-07-01T00:00:00.000+01:00',
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
									price: 45,
									currency: 'USD',
									fixedTerm: false,
									promotions: [
										{
											name: 'Tier Three SupporterPlus Guardian Weekly US Monthly',
											description:
												'Tier Three SupporterPlus Guardian Weekly US Monthly',
											promoCode: 'TIER3_US_MONTHLY',
											discountedPrice: 37,
											numberOfDiscountedPeriods: 12,
											discount: {
												amount: 17.77,
												durationMonths: 12,
											},
											starts: '2024-07-01T00:00:00.000+01:00',
										},
									],
								},
							},
							Annual: {
								USD: {
									price: 510,
									currency: 'USD',
									fixedTerm: false,
									promotions: [
										{
											name: 'Tier Three SupporterPlus Guardian Weekly US Annual',
											description:
												'Tier Three SupporterPlus Guardian Weekly US Annual',
											promoCode: 'TIER3_US_ANNUAL',
											discountedPrice: 405,
											numberOfDiscountedPeriods: 1,
											discount: {
												amount: 20.5882,
												durationMonths: 12,
											},
											starts: '2024-07-01T00:00:00.000+01:00',
										},
									],
								},
							},
						},
						NewspaperArchive: {
							Annual: {
								USD: {
									price: 534,
									currency: 'USD',
									fixedTerm: false,
									promotions: [
										{
											name: 'Tier Three SupporterPlus Guardian Weekly US Annual',
											description:
												'Tier Three SupporterPlus Guardian Weekly US Annual',
											promoCode: 'TIER3_US_ANNUAL',
											discountedPrice: 424.06,
											numberOfDiscountedPeriods: 1,
											discount: {
												amount: 20.5882,
												durationMonths: 12,
											},
											starts: '2024-07-01T00:00:00.000+01:00',
										},
									],
								},
							},
							Monthly: {
								USD: {
									price: 47,
									savingVsRetail: 5,
									currency: 'USD',
									fixedTerm: false,
									promotions: [
										{
											name: 'Tier Three SupporterPlus Guardian Weekly US Monthly',
											description:
												'Tier Three SupporterPlus Guardian Weekly US Monthly',
											promoCode: 'TIER3_US_MONTHLY',
											discountedPrice: 38.65,
											numberOfDiscountedPeriods: 12,
											discount: {
												amount: 17.77,
												durationMonths: 12,
											},
											starts: '2024-07-01T00:00:00.000+01:00',
										},
									],
								},
							},
						},
					},
					RestOfWorld: {
						NewspaperArchive: {
							Monthly: {
								USD: {
									price: 50,
									currency: 'USD',
									fixedTerm: false,
									promotions: [],
								},
							},
							Annual: {
								USD: {
									price: 570,
									currency: 'USD',
									fixedTerm: false,
									promotions: [],
								},
							},
						},
						NoProductOptions: {
							Annual: {
								USD: {
									price: 546,
									currency: 'USD',
									fixedTerm: false,
									promotions: [],
								},
							},
							Monthly: {
								USD: {
									price: 48,
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
