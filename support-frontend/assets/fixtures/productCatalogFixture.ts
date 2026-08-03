import type { WindowProductCatalog } from 'helpers/globalsAndSwitches/window';

export const productCatalogFixture: WindowProductCatalog = {
	Contribution: {
		ratePlans: {
			Annual: {
				billingPeriod: 'Annual',
				charges: {
					Contribution: {
						id: '2c92c0f85e2d19af015e3896e84d092e',
					},
				},
				id: '2c92c0f85e2d19af015e3896e824092c',
				pricing: {
					AUD: 100,
					CAD: 5,
					EUR: 60,
					GBP: 60,
					NZD: 60,
					USD: 60,
				},
				taxMode: 'TaxExclusive',
			},
			Monthly: {
				billingPeriod: 'Month',
				charges: {
					Contribution: {
						id: '2c92c0f85a6b1352015a7fcf35ab397c',
					},
				},
				id: '2c92c0f85a6b134e015a7fcd9f0c7855',
				pricing: {
					AUD: 10,
					CAD: 5,
					EUR: 5,
					GBP: 5,
					NZD: 5,
					USD: 5,
				},
				taxMode: null,
			},
		},
	},
	DigitalSubscription: {
		ratePlans: {
			Annual: {
				billingPeriod: 'Annual',
				charges: {
					Subscription: {
						id: '2c92c0f94bbffaaa014bc6a4213e205d',
					},
				},
				id: '2c92c0f94bbffaaa014bc6a4212e205b',
				pricing: {
					AUD: 300,
					CAD: 300,
					EUR: 200,
					GBP: 180,
					NZD: 300,
					USD: 280,
				},
				taxMode: 'TaxInclusive',
			},
			AnnualTaxExclusive: {
				billingPeriod: 'Annual',
				charges: {
					Subscription: {
						id: '8eeca2b0e5494f879c0e05d7069a6e6d',
					},
				},
				id: '14253478e8ca41888a2742f139823b51',
				pricing: {
					CAD: 300,
					GBP: 180,
				},
				taxMode: 'TaxExclusive',
			},
			Discount: {
				billingPeriod: 'Month',
				charges: {
					Percentage: {
						id: '2c92c0f957220b5d0157299c97a60bbd',
					},
				},
				id: '2c92c0f85721ff7c01572942235b6d7a',
				pricing: {},
				taxMode: 'TaxExclusive',
			},
			Monthly: {
				billingPeriod: 'Month',
				charges: {
					Subscription: {
						id: '2c92c0f84bbfec58014bc6a2c37e1f15',
					},
				},
				id: '2c92c0f84bbfec8b014bc655f4852d9d',
				pricing: {
					AUD: 30,
					CAD: 30,
					EUR: 20,
					GBP: 18,
					NZD: 30,
					USD: 28,
				},
				taxMode: 'TaxInclusive',
			},
			MonthlyTaxExclusive: {
				billingPeriod: 'Month',
				charges: {
					Subscription: {
						id: '71a1889a1579daf14eedb5c6508300ca',
					},
				},
				id: '71a1889a1579daf14eedb5c64fe800c9',
				pricing: {
					CAD: 30,
					GBP: 18,
				},
				taxMode: 'TaxExclusive',
			},
			OneYearGift: {
				charges: {
					Subscription: {
						id: '2c92c0f9778c090d0177a613d98c177e',
					},
				},
				id: '2c92c0f8778bf8cd0177a610cdf230ae',
				pricing: {
					AUD: 99,
					CAD: 99,
					EUR: 99,
					GBP: 99,
					NZD: 99,
					USD: 99,
				},
				taxMode: 'TaxInclusive',
			},
			Quarterly: {
				billingPeriod: 'Quarter',
				charges: {
					Subscription: {
						id: '2c92c0f84bbfec58014bc6a2d5691f5d',
					},
				},
				id: '2c92c0f84bbfec58014bc6a2d43a1f5b',
				pricing: {
					AUD: 79.99,
					CAD: 82.31,
					EUR: 56.19,
					GBP: 44.94,
					NZD: 79.99,
					USD: 74.94,
				},
				taxMode: 'TaxInclusive',
			},
			ThreeMonthGift: {
				charges: {
					Subscription: {
						id: '2c92c0f9778c090d0177916fd95b47a2',
					},
				},
				id: '2c92c0f8778bf8f60177915b477714aa',
				pricing: {
					AUD: 36,
					CAD: 36,
					EUR: 36,
					GBP: 36,
					NZD: 36,
					USD: 36,
				},
				taxMode: 'TaxInclusive',
			},
		},
	},
	GuardianAdLite: {
		ratePlans: {
			Monthly: {
				billingPeriod: 'Month',
				charges: {
					Subscription: {
						id: '71a1bebf6be9444afad446c5ec26001a',
					},
				},
				id: '71a1bebf6be9444afad446c5ebaf0019',
				pricing: {
					EUR: 5,
					GBP: 5,
				},
				taxMode: 'TaxInclusive',
			},
		},
	},
	GuardianPatron: {
		ratePlans: {
			GuardianPatron: {
				billingPeriod: 'Month',
				charges: {
					Subscription: {
						id: 'guardian_patron',
					},
				},
				id: 'guardian_patron',
				pricing: {},
				taxMode: 'TaxInclusive',
			},
		},
	},
	GuardianWeeklyDomestic: {
		ratePlans: {
			Annual: {
				billingPeriod: 'Annual',
				charges: {
					Subscription: {
						id: '2c92c0f965d280590165f16b1ba946c4',
					},
				},
				id: '2c92c0f965d280590165f16b1b9946c2',
				pricing: {
					AUD: 528,
					CAD: 432,
					EUR: 348,
					GBP: 198,
					NZD: 660,
					USD: 360,
				},
				taxMode: 'TaxInclusive',
			},
			AnnualPlus: {
				billingPeriod: 'Annual',
				charges: {
					DigitalPack: {
						id: '42b45774e8304680a459307ca1761f82',
					},
					GuardianWeekly: {
						id: '71a10c626869c3262f1c33d510290010',
					},
				},
				id: '71a10c626869c3262f1c33d50fd3000f',
				pricing: {
					AUD: 600,
					CAD: 480,
					EUR: 366,
					GBP: 228,
					NZD: 660,
					USD: 432,
				},
				taxMode: 'TaxInclusive',
			},
			Discount: {
				billingPeriod: 'Month',
				charges: {
					Percentage: {
						id: '2c92c0f957220b5d0157299c97a60bbd',
					},
				},
				id: '2c92c0f85721ff7c01572942235b6d7a',
				pricing: {},
				taxMode: 'TaxExclusive',
			},
			Monthly: {
				billingPeriod: 'Month',
				charges: {
					Subscription: {
						id: '2c92c0f878ac40300178acae0612681b',
					},
				},
				id: '2c92c0f878ac40300178acaa04bb401d',
				pricing: {
					AUD: 44,
					CAD: 36,
					EUR: 29,
					GBP: 16.5,
					NZD: 55,
					USD: 30,
				},
				taxMode: 'TaxInclusive',
			},
			MonthlyPlus: {
				billingPeriod: 'Month',
				charges: {
					DigitalPack: {
						id: 'dbf41ba6d90c4765a35701bfbc9947e8',
					},
					GuardianWeekly: {
						id: '71a1889a11e9c3262efc33d4d35d003e',
					},
				},
				id: '71a1889a11e9c3262efc33d4d2e6003d',
				pricing: {
					AUD: 50,
					CAD: 40,
					EUR: 30.5,
					GBP: 19,
					NZD: 55,
					USD: 36,
				},
				taxMode: 'TaxInclusive',
			},
			OneYearGift: {
				billingPeriod: 'Annual',
				charges: {
					Subscription: {
						id: '2c92c0f867cae0700167eff921884f7d',
					},
				},
				id: '2c92c0f867cae0700167eff921734f7b',
				pricing: {
					AUD: 422.4,
					CAD: 345.6,
					EUR: 278.4,
					GBP: 158.4,
					NZD: 528,
					USD: 288,
				},
				taxMode: 'TaxInclusive',
			},
			Quarterly: {
				billingPeriod: 'Quarter',
				charges: {
					Subscription: {
						id: '2c92c0f865d273010165f16ada0a4346',
					},
				},
				id: '2c92c0f965dc30640165f150c0956859',
				pricing: {
					AUD: 132,
					CAD: 108,
					EUR: 87,
					GBP: 49.5,
					NZD: 165,
					USD: 90,
				},
				taxMode: 'TaxInclusive',
			},
			QuarterlyPlus: {
				billingPeriod: 'Quarter',
				charges: {
					DigitalPack: {
						id: 'd5b95b38c03340eda78117b2023d1da0',
					},
					GuardianWeekly: {
						id: '71a1b1d5ae19c3274a6c33d4e9420001',
					},
				},
				id: '71a1b1d5ae19c3274a6c33d4e8c80000',
				pricing: {
					AUD: 150,
					CAD: 120,
					EUR: 91.5,
					GBP: 57,
					NZD: 165,
					USD: 108,
				},
				taxMode: 'TaxInclusive',
			},
			ThreeMonthGift: {
				billingPeriod: 'Quarter',
				charges: {
					Subscription: {
						id: '2c92c0f96ded216a016df49113814093',
					},
				},
				id: '2c92c0f96ded216a016df491134d4091',
				pricing: {
					AUD: 132,
					CAD: 108,
					EUR: 87,
					GBP: 49.5,
					NZD: 165,
					USD: 90,
				},
				taxMode: 'TaxInclusive',
			},
		},
	},
	GuardianWeeklyRestOfWorld: {
		ratePlans: {
			Annual: {
				billingPeriod: 'Annual',
				charges: {
					Subscription: {
						id: '2c92c0f965f2122101660fb6ac46550e',
					},
				},
				id: '2c92c0f965f2122101660fb33ed24a45',
				pricing: {
					GBP: 336,
					USD: 432,
				},
				taxMode: 'TaxInclusive',
			},
			AnnualPlus: {
				billingPeriod: 'Annual',
				charges: {
					DigitalPack: {
						id: '637052f29f944602b5a6f6b04087938a',
					},
					GuardianWeekly: {
						id: '71a10c626ff9c22b079c24523a09000a',
					},
				},
				id: '71a10c626ff9c22b079c245239af0009',
				pricing: {
					GBP: 386.91,
					USD: 456,
				},
				taxMode: 'TaxInclusive',
			},
			Discount: {
				billingPeriod: 'Month',
				charges: {
					Percentage: {
						id: '2c92c0f957220b5d0157299c97a60bbd',
					},
				},
				id: '2c92c0f85721ff7c01572942235b6d7a',
				pricing: {},
				taxMode: 'TaxExclusive',
			},
			Monthly: {
				billingPeriod: 'Month',
				charges: {
					Monthly: {
						id: '2c92c0f878ac402c0178acf675822d88',
					},
				},
				id: '2c92c0f878ac402c0178acb3a90a3620',
				pricing: {
					GBP: 28,
					USD: 36,
				},
				taxMode: 'TaxInclusive',
			},
			MonthlyPlus: {
				billingPeriod: 'Month',
				charges: {
					DigitalPack: {
						id: '78fba989a3fa4f1d9c4cf49a0a8400b3',
					},
					GuardianWeekly: {
						id: '71a17af0e0e9c22c33ec241bf6d6005c',
					},
				},
				id: '71a17af0e0e9c22c33ec241bf657005b',
				pricing: {
					GBP: 32.24,
					USD: 38,
				},
				taxMode: 'TaxInclusive',
			},
			OneYearGift: {
				billingPeriod: 'Annual',
				charges: {
					Subscription: {
						id: '2c92c0f967caee410167eff78e975246',
					},
				},
				id: '2c92c0f967caee410167eff78e7b5244',
				pricing: {
					GBP: 268.8,
					USD: 345.6,
				},
				taxMode: 'TaxInclusive',
			},
			Quarterly: {
				billingPeriod: 'Quarter',
				charges: {
					Subscription: {
						id: '2c92c0f965f2122101660fb81b875a0b',
					},
				},
				id: '2c92c0f965f2122101660fb81b745a06',
				pricing: {
					GBP: 83.9,
					USD: 108,
				},
				taxMode: 'TaxInclusive',
			},
			QuarterlyPlus: {
				billingPeriod: 'Quarter',
				charges: {
					DigitalPack: {
						id: '6e1824b50339435697e2a755e6bc04bd',
					},
					GuardianWeekly: {
						id: '71a10c6268a9c22b079c2452f53c0138',
					},
				},
				id: '71a10c6268a9c22b079c2452f51f0137',
				pricing: {
					GBP: 96.61,
					USD: 114,
				},
				taxMode: 'TaxInclusive',
			},
			ThreeMonthGift: {
				billingPeriod: 'Quarter',
				charges: {
					Subscription: {
						id: '2c92c0f96df75b5a016df81ba1e9260b',
					},
				},
				id: '2c92c0f96df75b5a016df81ba1c62609',
				pricing: {
					GBP: 83.9,
					USD: 108,
				},
				taxMode: 'TaxInclusive',
			},
		},
	},
	GuardianWeeklyZoneA: {
		ratePlans: {
			Annual: {
				billingPeriod: 'Annual',
				charges: {
					Subscription: {
						id: '2c92c0f8574b2b8101574c4a9494068f',
					},
				},
				id: '2c92c0f8574b2b8101574c4a9480068d',
				pricing: {
					GBP: 120,
					USD: 240,
				},
				taxMode: 'TaxExclusive',
			},
			Discount: {
				billingPeriod: 'Month',
				charges: {
					Percentage: {
						id: '2c92c0f957220b5d0157299c97a60bbd',
					},
				},
				id: '2c92c0f85721ff7c01572942235b6d7a',
				pricing: {},
				taxMode: 'TaxExclusive',
			},
			Quarterly: {
				billingPeriod: 'Quarter',
				charges: {
					Subscription: {
						id: '2c92c0f8574b2b8101574c4a958d06c0',
					},
				},
				id: '2c92c0f8574b2b8101574c4a957706be',
				pricing: {
					GBP: 30,
					USD: 60,
				},
				taxMode: 'TaxExclusive',
			},
		},
	},
	GuardianWeeklyZoneB: {
		ratePlans: {
			Annual: {
				billingPeriod: 'Annual',
				charges: {
					Subscription: {
						id: '2c92c0f8574b2be601574c39889c6852',
					},
				},
				id: '2c92c0f8574b2be601574c39888d6850',
				pricing: {
					AUD: 312,
					CAD: 240,
					EUR: 196,
					GBP: 152,
					NZD: 392,
					USD: 240,
				},
				taxMode: 'TaxExclusive',
			},
			Discount: {
				billingPeriod: 'Month',
				charges: {
					Percentage: {
						id: '2c92c0f957220b5d0157299c97a60bbd',
					},
				},
				id: '2c92c0f85721ff7c01572942235b6d7a',
				pricing: {},
				taxMode: 'TaxExclusive',
			},
			Quarterly: {
				billingPeriod: 'Quarter',
				charges: {
					Subscription: {
						id: '2c92c0f8574b2be601574c323cb35c80',
					},
				},
				id: '2c92c0f8574b2be601574c323ca15c7e',
				pricing: {
					AUD: 78,
					CAD: 60,
					EUR: 49,
					GBP: 38,
					NZD: 98,
					USD: 60,
				},
				taxMode: 'TaxExclusive',
			},
		},
	},
	GuardianWeeklyZoneC: {
		ratePlans: {
			Annual: {
				billingPeriod: 'Annual',
				charges: {
					Subscription: {
						id: '2c92c0f858aa38af0158da325d450b3f',
					},
				},
				id: '2c92c0f858aa38af0158da325d2f0b3d',
				pricing: {
					AUD: 312,
					CAD: 999,
					EUR: 196,
					GBP: 192,
					NZD: 392,
					USD: 260,
				},
				taxMode: 'TaxExclusive',
			},
			Discount: {
				billingPeriod: 'Month',
				charges: {
					Percentage: {
						id: '2c92c0f957220b5d0157299c97a60bbd',
					},
				},
				id: '2c92c0f85721ff7c01572942235b6d7a',
				pricing: {},
				taxMode: 'TaxExclusive',
			},
			Quarterly: {
				billingPeriod: 'Quarter',
				charges: {
					Subscription: {
						id: '2c92c0f858aa38af0158da325d010b30',
					},
				},
				id: '2c92c0f858aa38af0158da325cec0b2e',
				pricing: {
					AUD: 78,
					CAD: 999,
					EUR: 49,
					GBP: 48,
					NZD: 98,
					USD: 65,
				},
				taxMode: 'TaxExclusive',
			},
		},
	},
	HomeDelivery: {
		ratePlans: {
			Discount: {
				billingPeriod: 'Month',
				charges: {
					Percentage: {
						id: '2c92c0f957220b5d0157299c97a60bbd',
					},
				},
				id: '2c92c0f85721ff7c01572942235b6d7a',
				pricing: {},
				taxMode: 'TaxExclusive',
			},
			Everyday: {
				billingPeriod: 'Month',
				charges: {
					Friday: {
						id: '2c92c0f955c3cf0f0155c5d9e2713c45',
					},
					Monday: {
						id: '2c92c0f955c3cf0f0155c5d9e43a3c6d',
					},
					Saturday: {
						id: '2c92c0f955c3cf0f0155c5d9e2c83c4d',
					},
					Sunday: {
						id: '2c92c0f955c3cf0f0155c5d9e4993c75',
					},
					Thursday: {
						id: '2c92c0f955c3cf0f0155c5d9e3233c55',
					},
					Tuesday: {
						id: '2c92c0f955c3cf0f0155c5d9e3da3c65',
					},
					Wednesday: {
						id: '2c92c0f955c3cf0f0155c5d9e37f3c5d',
					},
				},
				id: '2c92c0f955c3cf0f0155c5d9e2493c43',
				pricing: {
					GBP: 83.99,
				},
				taxMode: 'TaxInclusive',
			},
			EverydayPlus: {
				billingPeriod: 'Month',
				charges: {
					DigitalPack: {
						id: '2c92c0f85aff3453015b104a62cd3ff4',
					},
					Friday: {
						id: '2c92c0f85aff3453015b10496b713d19',
					},
					Monday: {
						id: '2c92c0f85aff3453015b10496c2f3d41',
					},
					Saturday: {
						id: '2c92c0f85aff3453015b10496b983d21',
					},
					Sunday: {
						id: '2c92c0f85aff3453015b10496c583d49',
					},
					Thursday: {
						id: '2c92c0f85aff3453015b10496bbb3d29',
					},
					Tuesday: {
						id: '2c92c0f85aff3453015b10496c083d39',
					},
					Wednesday: {
						id: '2c92c0f85aff3453015b10496be13d31',
					},
				},
				id: '2c92c0f85aff3453015b10496b5e3d17',
				pricing: {
					GBP: 88.99,
				},
				taxMode: 'TaxInclusive',
			},
			Saturday: {
				billingPeriod: 'Month',
				charges: {
					Saturday: {
						id: '2c92c0f961f9cf300161fc4d2e773666',
					},
				},
				id: '2c92c0f961f9cf300161fc4d2e3e3664',
				pricing: {
					GBP: 20.99,
				},
				taxMode: 'TaxExclusive',
			},
			SaturdayPlus: {
				billingPeriod: 'Month',
				charges: {
					DigitalPack: {
						id: '2c92c0f961f9cf300161fc4f716e3a3e',
					},
					Saturday: {
						id: '2c92c0f961f9cf300161fc4f71553a36',
					},
				},
				id: '2c92c0f961f9cf300161fc4f71473a34',
				pricing: {
					GBP: 21.99,
				},
				taxMode: 'TaxExclusive',
			},
			Sixday: {
				billingPeriod: 'Month',
				charges: {
					Friday: {
						id: '2c92c0f955c3cf0f0155c5d9de103bc7',
					},
					Monday: {
						id: '2c92c0f955c3cf0f0155c5d9df0a3bef',
					},
					Saturday: {
						id: '2c92c0f955c3cf0f0155c5d9de463bcf',
					},
					Thursday: {
						id: '2c92c0f955c3cf0f0155c5d9de783bd7',
					},
					Tuesday: {
						id: '2c92c0f955c3cf0f0155c5d9ded23be7',
					},
					Wednesday: {
						id: '2c92c0f955c3cf0f0155c5d9dea63bdf',
					},
				},
				id: '2c92c0f955c3cf0f0155c5d9ddf13bc5',
				pricing: {
					GBP: 73.99,
				},
				taxMode: 'TaxExclusive',
			},
			SixdayPlus: {
				billingPeriod: 'Month',
				charges: {
					DigitalPack: {
						id: '2c92c0f95aff3b54015b1043d1222634',
					},
					Friday: {
						id: '2c92c0f85aff33ff015b1042d4cf0a08',
					},
					Monday: {
						id: '2c92c0f85aff33ff015b1042d5a90a30',
					},
					Saturday: {
						id: '2c92c0f85aff33ff015b1042d4f90a10',
					},
					Thursday: {
						id: '2c92c0f85aff33ff015b1042d5220a18',
					},
					Tuesday: {
						id: '2c92c0f85aff33ff015b1042d5790a28',
					},
					Wednesday: {
						id: '2c92c0f85aff33ff015b1042d54d0a20',
					},
				},
				id: '2c92c0f85aff33ff015b1042d4ba0a05',
				pricing: {
					GBP: 77.99,
				},
				taxMode: 'TaxInclusive',
			},
			Sunday: {
				billingPeriod: 'Month',
				charges: {
					Sunday: {
						id: '2c92c0f85aff3453015b1041dfea3181',
					},
				},
				id: '2c92c0f85aff3453015b1041dfd2317f',
				pricing: {
					GBP: 23,
				},
				taxMode: 'TaxExclusive',
			},
			SundayPlus: {
				billingPeriod: 'Month',
				charges: {
					DigitalPack: {
						id: '2c92c0f955c3cf0f0155c5d9e8f83cc1',
					},
					Sunday: {
						id: '2c92c0f955c3cf0f0155c5d9e87e3cb9',
					},
				},
				id: '2c92c0f955c3cf0f0155c5d9e83a3cb7',
				pricing: {
					GBP: 23,
				},
				taxMode: 'TaxExclusive',
			},
			Weekend: {
				billingPeriod: 'Month',
				charges: {
					Saturday: {
						id: '2c92c0f955c3cf0f0155c5d9df5c3bf9',
					},
					Sunday: {
						id: '2c92c0f955c3cf0f0155c5d9df963c01',
					},
				},
				id: '2c92c0f955c3cf0f0155c5d9df433bf7',
				pricing: {
					GBP: 33.99,
				},
				taxMode: 'TaxExclusive',
			},
			WeekendPlus: {
				billingPeriod: 'Month',
				charges: {
					DigitalPack: {
						id: '2c92c0f95aff3b54015b104bc6d5334d',
					},
					Saturday: {
						id: '2c92c0f95aff3b56015b104aa9b73ea7',
					},
					Sunday: {
						id: '2c92c0f95aff3b56015b104aa9de3eaf',
					},
				},
				id: '2c92c0f95aff3b56015b104aa9a13ea5',
				pricing: {
					GBP: 36.99,
				},
				taxMode: 'TaxInclusive',
			},
		},
	},
	NationalDelivery: {
		ratePlans: {
			Discount: {
				billingPeriod: 'Month',
				charges: {
					Percentage: {
						id: '2c92c0f957220b5d0157299c97a60bbd',
					},
				},
				id: '2c92c0f85721ff7c01572942235b6d7a',
				pricing: {},
				taxMode: 'TaxExclusive',
			},
			Everyday: {
				billingPeriod: 'Month',
				charges: {
					Friday: {
						id: '8ad096ca8992481d018992a3640b17c4',
					},
					Monday: {
						id: '8ad096ca8992481d018992a3674c18da',
					},
					Saturday: {
						id: '8ad096ca8992481d018992a364a517f7',
					},
					Sunday: {
						id: '8ad096ca8992481d018992a367c518e3',
					},
					Thursday: {
						id: '8ad096ca8992481d018992a365741862',
					},
					Tuesday: {
						id: '8ad096ca8992481d018992a366c018bb',
					},
					Wednesday: {
						id: '8ad096ca8992481d018992a366281896',
					},
				},
				id: '8ad096ca8992481d018992a363bd17ad',
				pricing: {
					GBP: 83.99,
				},
				taxMode: 'TaxInclusive',
			},
			EverydayPlus: {
				billingPeriod: 'Month',
				charges: {
					DigitalPack: {
						id: 'd845a95586544246810eb5e88f3f4505',
					},
					Friday: {
						id: '71a116628be96ab11606b51ec66e0556',
					},
					Monday: {
						id: '71a116628be96ab11606b51ec7f80579',
					},
					Saturday: {
						id: '71a116628be96ab11606b51ec6ba055d',
					},
					Sunday: {
						id: '71a116628be96ab11606b51ec8490580',
					},
					Thursday: {
						id: '71a116628be96ab11606b51ec7070564',
					},
					Tuesday: {
						id: '71a116628be96ab11606b51ec7a80572',
					},
					Wednesday: {
						id: '71a116628be96ab11606b51ec759056b',
					},
				},
				id: '71a116628be96ab11606b51ec6060555',
				pricing: {
					GBP: 88.99,
				},
				taxMode: 'TaxInclusive',
			},
			Sixday: {
				billingPeriod: 'Month',
				charges: {
					Friday: {
						id: '8ad096ca8992481d018992a35fa9171e',
					},
					Monday: {
						id: '8ad096ca8992481d018992a361da1756',
					},
					Saturday: {
						id: '8ad096ca8992481d018992a3601a1729',
					},
					Thursday: {
						id: '8ad096ca8992481d018992a360911731',
					},
					Tuesday: {
						id: '8ad096ca8992481d018992a3616a174a',
					},
					Wednesday: {
						id: '8ad096ca8992481d018992a360ff1739',
					},
				},
				id: '8ad096ca8992481d018992a35f60171b',
				pricing: {
					GBP: 73.99,
				},
				taxMode: 'TaxInclusive',
			},
			SixdayPlus: {
				billingPeriod: 'Month',
				charges: {
					DigitalPack: {
						id: '7d95e707b33f4704b3f813275b480bc0',
					},
					Friday: {
						id: '71a1383e2a796aafcb16b527846101cb',
					},
					Monday: {
						id: '71a1383e2a796aafcb16b527855201ee',
					},
					Saturday: {
						id: '71a1383e2a796aafcb16b527849401d2',
					},
					Thursday: {
						id: '71a1383e2a796aafcb16b52784c501d9',
					},
					Tuesday: {
						id: '71a1383e2a796aafcb16b527852101e7',
					},
					Wednesday: {
						id: '71a1383e2a796aafcb16b52784f201e0',
					},
				},
				id: '71a1383e2a796aafcb16b527842001ca',
				pricing: {
					GBP: 77.99,
				},
				taxMode: 'TaxInclusive',
			},
			Weekend: {
				billingPeriod: 'Month',
				charges: {
					Saturday: {
						id: '8ad096ca8992481d018992a362931760',
					},
					Sunday: {
						id: '8ad096ca8992481d018992a36308176c',
					},
				},
				id: '8ad096ca8992481d018992a36256175e',
				pricing: {
					GBP: 33.99,
				},
				taxMode: 'TaxInclusive',
			},
			WeekendPlus: {
				billingPeriod: 'Month',
				charges: {
					DigitalPack: {
						id: '236ce7ea9cac449bb850567600c94dac',
					},
					Saturday: {
						id: '71a1166283a96ab11606b50ebc300382',
					},
					Sunday: {
						id: '71a1166283a96ab11606b50ebc780389',
					},
				},
				id: '71a1166283a96ab11606b50ebbb50381',
				pricing: {
					GBP: 36.99,
				},
				taxMode: 'TaxInclusive',
			},
		},
	},
	NewspaperVoucher: {
		ratePlans: {
			Discount: {
				billingPeriod: 'Month',
				charges: {
					Percentage: {
						id: '2c92c0f957220b5d0157299c97a60bbd',
					},
				},
				id: '2c92c0f85721ff7c01572942235b6d7a',
				pricing: {},
				taxMode: 'TaxExclusive',
			},
			Everyday: {
				billingPeriod: 'Month',
				charges: {
					Friday: {
						id: '2c92c0f9555cf10501556e84a71b40e4',
					},
					Monday: {
						id: '2c92c0f9555cf10501556e84a7eb410c',
					},
					Saturday: {
						id: '2c92c0f9555cf10501556e84a74440ec',
					},
					Sunday: {
						id: '2c92c0f9555cf11d01556e851a1c0cb0',
					},
					Thursday: {
						id: '2c92c0f9555cf10501556e84a76e40f4',
					},
					Tuesday: {
						id: '2c92c0f9555cf10501556e84a7c44104',
					},
					Wednesday: {
						id: '2c92c0f9555cf10501556e84a79e40fc',
					},
				},
				id: '2c92c0f9555cf10501556e84a70440e2',
				pricing: {
					GBP: 69.99,
				},
				taxMode: 'TaxExclusive',
			},
			EverydayPlus: {
				billingPeriod: 'Month',
				charges: {
					DigitalPack: {
						id: '2c92c0f85aff33ff015b10477d36137b',
					},
					Friday: {
						id: '2c92c0f95aff3b53015b10469bd45f61',
					},
					Monday: {
						id: '2c92c0f95aff3b53015b10469ca15f89',
					},
					Saturday: {
						id: '2c92c0f95aff3b53015b10469bfa5f69',
					},
					Sunday: {
						id: '2c92c0f95aff3b53015b10469cd15f91',
					},
					Thursday: {
						id: '2c92c0f95aff3b53015b10469c1f5f71',
					},
					Tuesday: {
						id: '2c92c0f95aff3b53015b10469c735f81',
					},
					Wednesday: {
						id: '2c92c0f95aff3b53015b10469c455f79',
					},
				},
				id: '2c92c0f95aff3b53015b10469bbf5f5f',
				pricing: {
					GBP: 72.99,
				},
				taxMode: 'TaxInclusive',
			},
			Saturday: {
				billingPeriod: 'Month',
				charges: {
					Saturday: {
						id: '2c92c0f861f9c26d0161fc434c1d0051',
					},
				},
				id: '2c92c0f861f9c26d0161fc434bfe004c',
				pricing: {
					GBP: 15.99,
				},
				taxMode: 'TaxExclusive',
			},
			SaturdayPlus: {
				billingPeriod: 'Month',
				charges: {
					DigitalPack: {
						id: '2c92c0f961f9cf300161fc44f2901262',
					},
					Saturday: {
						id: '2c92c0f961f9cf300161fc44f274125a',
					},
				},
				id: '2c92c0f961f9cf300161fc44f2661258',
				pricing: {
					GBP: 16.99,
				},
				taxMode: 'TaxInclusive',
			},
			Sixday: {
				billingPeriod: 'Month',
				charges: {
					Friday: {
						id: '2c92c0f8555ce5cc01556e827ac323d8',
					},
					Monday: {
						id: '2c92c0f8555ce63a01556e8479096440',
					},
					Saturday: {
						id: '2c92c0f8555ce5cf01556e7f018c1b8c',
					},
					Thursday: {
						id: '2c92c0f8555ce5cf01556e82d0b6217b',
					},
					Tuesday: {
						id: '2c92c0f8555ce63a01556e842d7a63e8',
					},
					Wednesday: {
						id: '2c92c0f8555ce63a01556e83ecd863c0',
					},
				},
				id: '2c92c0f8555ce5cf01556e7f01771b8a',
				pricing: {
					GBP: 61.99,
				},
				taxMode: 'TaxExclusive',
			},
			SixdayPlus: {
				billingPeriod: 'Month',
				charges: {
					DigitalPack: {
						id: '2c92c0f85721ffeb01572d7d63400fd2',
					},
					Friday: {
						id: '2c92c0f855c3b8190155c585a97f6f5d',
					},
					Monday: {
						id: '2c92c0f855c3b8190155c585aa936f9e',
					},
					Saturday: {
						id: '2c92c0f855c3b8190155c585a9bf6f6e',
					},
					Thursday: {
						id: '2c92c0f855c3b8190155c585a9f06f7c',
					},
					Tuesday: {
						id: '2c92c0f855c3b8190155c585aa586f91',
					},
					Wednesday: {
						id: '2c92c0f855c3b8190155c585aa226f85',
					},
				},
				id: '2c92c0f855c3b8190155c585a95e6f5a',
				pricing: {
					GBP: 64.99,
				},
				taxMode: 'TaxExclusive',
			},
			Sunday: {
				billingPeriod: 'Month',
				charges: {
					Sunday: {
						id: '2c92c0f95aff3b56015b1045fba832d4',
					},
				},
				id: '2c92c0f95aff3b56015b1045fb9332d2',
				pricing: {
					GBP: 18,
				},
				taxMode: 'TaxExclusive',
			},
			SundayPlus: {
				billingPeriod: 'Month',
				charges: {
					DigitalPack: {
						id: '2c92c0f955a0b5bf0155b62623c66fd2',
					},
					Sunday: {
						id: '2c92c0f955a0b5bf0155b626239c6fca',
					},
				},
				id: '2c92c0f955a0b5bf0155b62623846fc8',
				pricing: {
					GBP: 18,
				},
				taxMode: 'TaxInclusive',
			},
			Weekend: {
				billingPeriod: 'Month',
				charges: {
					Saturday: {
						id: '2c92c0f8555ce5cf01556e7f01cb1b96',
					},
					Sunday: {
						id: '2c92c0f8555ce63a01556e81e4a86077',
					},
				},
				id: '2c92c0f8555ce5cf01556e7f01b81b94',
				pricing: {
					GBP: 26.99,
				},
				taxMode: 'TaxExclusive',
			},
			WeekendPlus: {
				billingPeriod: 'Month',
				charges: {
					DigitalPack: {
						id: '2c92c0f95aff3b56015b1048e4d53b66',
					},
					Saturday: {
						id: '2c92c0f95aff3b54015b1047efbb2ac5',
					},
					Sunday: {
						id: '2c92c0f95aff3b54015b1047efe02acd',
					},
				},
				id: '2c92c0f95aff3b54015b1047efaa2ac3',
				pricing: {
					GBP: 29.99,
				},
				taxMode: 'TaxInclusive',
			},
		},
	},
	OneTimeContribution: {
		ratePlans: {
			OneTime: {
				billingPeriod: 'OneTime',
				charges: {
					Contribution: {
						id: 'single_contribution',
					},
				},
				id: 'single_contribution',
				pricing: {},
				taxMode: 'TaxInclusive',
			},
		},
	},
	PartnerMembership: {
		ratePlans: {
			Annual: {
				billingPeriod: 'Annual',
				charges: {
					Subscription: {
						id: '2c92c0f84c510081014c569a18c44e86',
					},
				},
				id: '2c92c0f84c510081014c569a18b04e84',
				pricing: {
					GBP: 149,
				},
				taxMode: 'TaxInclusive',
			},
			Discount: {
				billingPeriod: 'Month',
				charges: {
					Percentage: {
						id: '2c92c0f957220b5d0157299c97a60bbd',
					},
				},
				id: '2c92c0f85721ff7c01572942235b6d7a',
				pricing: {},
				taxMode: 'TaxExclusive',
			},
			Monthly: {
				billingPeriod: 'Month',
				charges: {
					Subscription: {
						id: '2c92c0f94c510a0d014c569a93344577',
					},
				},
				id: '2c92c0f94c510a0d014c569a93194575',
				pricing: {
					GBP: 15,
				},
				taxMode: 'TaxInclusive',
			},
			V1DeprecatedAnnual: {
				billingPeriod: 'Annual',
				charges: {
					Subscription: {
						id: '2c92c0f8471e22bb01471ffe9643366e',
					},
				},
				id: '2c92c0f8471e22bb01471ffe9596366c',
				pricing: {
					GBP: 135,
				},
				taxMode: 'TaxInclusive',
			},
			V1DeprecatedMonthly: {
				billingPeriod: 'Month',
				charges: {
					Subscription: {
						id: '2c92c0f945fee1c9014605749e55096b',
					},
				},
				id: '2c92c0f945fee1c9014605749e450969',
				pricing: {
					GBP: 15,
				},
				taxMode: 'TaxInclusive',
			},
		},
	},
	PatronMembership: {
		ratePlans: {
			Annual: {
				billingPeriod: 'Annual',
				charges: {
					Subscription: {
						id: '2c92c0f94c510a04014c568d64a5097f',
					},
				},
				id: '2c92c0f94c510a04014c568d648d097d',
				pricing: {
					GBP: 599,
				},
				taxMode: 'TaxInclusive',
			},
			Discount: {
				billingPeriod: 'Month',
				charges: {
					Percentage: {
						id: '2c92c0f957220b5d0157299c97a60bbd',
					},
				},
				id: '2c92c0f85721ff7c01572942235b6d7a',
				pricing: {},
				taxMode: 'TaxExclusive',
			},
			Monthly: {
				billingPeriod: 'Month',
				charges: {
					Subscription: {
						id: '2c92c0f84c5100b6014c56908a79216f',
					},
				},
				id: '2c92c0f84c5100b6014c56908a63216d',
				pricing: {
					GBP: 60,
				},
				taxMode: 'TaxInclusive',
			},
			V1DeprecatedAnnual: {
				billingPeriod: 'Annual',
				charges: {
					Subscription: {
						id: '2c92c0f9471e145d01471ffd7c3d4dfb',
					},
				},
				id: '2c92c0f9471e145d01471ffd7c304df9',
				pricing: {
					GBP: 540,
				},
				taxMode: 'TaxInclusive',
			},
			V1DeprecatedMonthly: {
				billingPeriod: 'Month',
				charges: {
					Subscription: {
						id: '2c92c0f845fed48301460578277c67c5',
					},
				},
				id: '2c92c0f845fed48301460578277167c3',
				pricing: {
					GBP: 60,
				},
				taxMode: 'TaxInclusive',
			},
		},
	},
	SubscriptionCard: {
		ratePlans: {
			Discount: {
				billingPeriod: 'Month',
				charges: {
					Percentage: {
						id: '2c92c0f957220b5d0157299c97a60bbd',
					},
				},
				id: '2c92c0f85721ff7c01572942235b6d7a',
				pricing: {},
				taxMode: 'TaxExclusive',
			},
			Everyday: {
				billingPeriod: 'Month',
				charges: {
					Friday: {
						id: '2c92c0f86fa49142016fa49ea599293a',
					},
					Monday: {
						id: '2c92c0f86fa49142016fa49ea84e2965',
					},
					Saturday: {
						id: '2c92c0f86fa49142016fa49ea5f12942',
					},
					Sunday: {
						id: '2c92c0f86fa49142016fa49ea8a8296e',
					},
					Thursday: {
						id: '2c92c0f86fa49142016fa49ea644294a',
					},
					Tuesday: {
						id: '2c92c0f86fa49142016fa49ea7f2295d',
					},
					Wednesday: {
						id: '2c92c0f86fa49142016fa49ea7782955',
					},
				},
				id: '2c92c0f86fa49142016fa49ea56a2938',
				pricing: {
					GBP: 69.99,
				},
				taxMode: 'TaxExclusive',
			},
			EverydayPlus: {
				billingPeriod: 'Month',
				charges: {
					DigitalPack: {
						id: '2c92c0f86fa49142016fa49eaa84298a',
					},
					Friday: {
						id: '2c92c0f86fa49142016fa49eaaf12995',
					},
					Monday: {
						id: '2c92c0f86fa49142016fa49ead1429c0',
					},
					Saturday: {
						id: '2c92c0f86fa49142016fa49eab5c29a0',
					},
					Sunday: {
						id: '2c92c0f86fa49142016fa49ead7f29c8',
					},
					Thursday: {
						id: '2c92c0f86fa49142016fa49eabcf29a8',
					},
					Tuesday: {
						id: '2c92c0f86fa49142016fa49eaca929b8',
					},
					Wednesday: {
						id: '2c92c0f86fa49142016fa49eac3529b0',
					},
				},
				id: '2c92c0f86fa49142016fa49eaa492988',
				pricing: {
					GBP: 73.99,
				},
				taxMode: 'TaxInclusive',
			},
			Saturday: {
				billingPeriod: 'Month',
				charges: {
					Saturday: {
						id: '2c92c0f86fa49142016fa49ea4da2921',
					},
				},
				id: '2c92c0f86fa49142016fa49ea442291b',
				pricing: {
					GBP: 15.99,
				},
				taxMode: 'TaxExclusive',
			},
			SaturdayPlus: {
				billingPeriod: 'Month',
				charges: {
					DigitalPack: {
						id: '2c92c0f86fa49142016fa49eb23d2a5c',
					},
					Saturday: {
						id: '2c92c0f86fa49142016fa49eb1b32a47',
					},
				},
				id: '2c92c0f86fa49142016fa49eb1732a39',
				pricing: {
					GBP: 16.99,
				},
				taxMode: 'TaxInclusive',
			},
			Sixday: {
				billingPeriod: 'Month',
				charges: {
					Friday: {
						id: '2c92c0f86fa49142016fa49e9e472877',
					},
					Monday: {
						id: '2c92c0f86fa49142016fa49ea07828ae',
					},
					Saturday: {
						id: '2c92c0f86fa49142016fa49e9eaf287f',
					},
					Thursday: {
						id: '2c92c0f86fa49142016fa49e9ee72887',
					},
					Tuesday: {
						id: '2c92c0f86fa49142016fa49ea03d28a4',
					},
					Wednesday: {
						id: '2c92c0f86fa49142016fa49ea0072896',
					},
				},
				id: '2c92c0f86fa49142016fa49e9b9a286f',
				pricing: {
					GBP: 61.99,
				},
				taxMode: 'TaxExclusive',
			},
			SixdayPlus: {
				billingPeriod: 'Month',
				charges: {
					DigitalPack: {
						id: '2c92c0f86fa49142016fa49ea3ee290b',
					},
					Friday: {
						id: '2c92c0f86fa49142016fa49ea1ce28ca',
					},
					Monday: {
						id: '2c92c0f86fa49142016fa49ea34528f2',
					},
					Saturday: {
						id: '2c92c0f86fa49142016fa49ea21028d2',
					},
					Thursday: {
						id: '2c92c0f86fa49142016fa49ea25928da',
					},
					Tuesday: {
						id: '2c92c0f86fa49142016fa49ea2f528ea',
					},
					Wednesday: {
						id: '2c92c0f86fa49142016fa49ea2a528e2',
					},
				},
				id: '2c92c0f86fa49142016fa49ea1af28c8',
				pricing: {
					GBP: 64.99,
				},
				taxMode: null,
			},
			Sunday: {
				billingPeriod: 'Month',
				charges: {
					Sunday: {
						id: '2c92c0f86fa49142016fa49eb0f42a15',
					},
				},
				id: '2c92c0f86fa49142016fa49eb0a42a01',
				pricing: {
					GBP: 18,
				},
				taxMode: 'TaxExclusive',
			},
			SundayPlus: {
				billingPeriod: 'Month',
				charges: {
					DigitalPack: {
						id: '2c92c0f86fa49142016fa49ea9a62980',
					},
					Sunday: {
						id: '2c92c0f86fa49142016fa49ea93b2978',
					},
				},
				id: '2c92c0f86fa49142016fa49ea90e2976',
				pricing: {
					GBP: 18,
				},
				taxMode: 'TaxInclusive',
			},
			Weekend: {
				billingPeriod: 'Month',
				charges: {
					Saturday: {
						id: '2c92c0f86fa49142016fa49ea0ec28b8',
					},
					Sunday: {
						id: '2c92c0f86fa49142016fa49ea12a28c0',
					},
				},
				id: '2c92c0f86fa49142016fa49ea0d028b6',
				pricing: {
					GBP: 26.99,
				},
				taxMode: 'TaxExclusive',
			},
			WeekendPlus: {
				billingPeriod: 'Month',
				charges: {
					DigitalPack: {
						id: '2c92c0f86fa49142016fa49eb01829f1',
					},
					Saturday: {
						id: '2c92c0f86fa49142016fa49eaf0b29e1',
					},
					Sunday: {
						id: '2c92c0f86fa49142016fa49eaf8e29e9',
					},
				},
				id: '2c92c0f86fa49142016fa49eaecb29dd',
				pricing: {
					GBP: 29.99,
				},
				taxMode: 'TaxInclusive',
			},
		},
	},
	SupporterMembership: {
		ratePlans: {
			Annual: {
				billingPeriod: 'Annual',
				charges: {
					Subscription: {
						id: '8ad08c8487755a49018779f99a4b0277',
					},
				},
				id: '8ad08c8487755a49018779f999f00270',
				pricing: {
					AUD: 160,
					CAD: 120,
					EUR: 95,
					GBP: 75,
					USD: 120,
				},
				taxMode: 'TaxInclusive',
			},
			Discount: {
				billingPeriod: 'Month',
				charges: {
					Percentage: {
						id: '2c92c0f957220b5d0157299c97a60bbd',
					},
				},
				id: '2c92c0f85721ff7c01572942235b6d7a',
				pricing: {},
				taxMode: 'TaxExclusive',
			},
			Monthly: {
				billingPeriod: 'Month',
				charges: {
					Subscription: {
						id: '8ad09ea087756cc4018779f9a7ca6c6e',
					},
				},
				id: '8ad09ea087756cc4018779f9a76f6c65',
				pricing: {
					AUD: 14.99,
					CAD: 12.99,
					EUR: 9.99,
					GBP: 7,
					USD: 9.99,
				},
				taxMode: 'TaxInclusive',
			},
			V1DeprecatedAnnual: {
				billingPeriod: 'Annual',
				charges: {
					Subscription: {
						id: '2c92c0f84b079582014b2754bfe50f6f',
					},
				},
				id: '2c92c0f84b079582014b2754bfd70f6d',
				pricing: {
					GBP: 60,
				},
				taxMode: 'TaxInclusive',
			},
			V1DeprecatedMonthly: {
				billingPeriod: 'Month',
				charges: {
					Subscription: {
						id: '2c92c0f84b079582014b2754c0900f7f',
					},
				},
				id: '2c92c0f84b079582014b2754c07c0f7d',
				pricing: {
					GBP: 5,
				},
				taxMode: 'TaxInclusive',
			},
			V2DeprecatedAnnual: {
				billingPeriod: 'Annual',
				charges: {
					Subscription: {
						id: '2c92c0f94c510a01014c569e2de37cff',
					},
				},
				id: '2c92c0f94c510a01014c569e2d857cfd',
				pricing: {
					AUD: 100,
					CAD: 69,
					EUR: 99.99,
					GBP: 51,
					USD: 89.99,
				},
				taxMode: 'TaxInclusive',
			},
			V2DeprecatedMonthly: {
				billingPeriod: 'Month',
				charges: {
					Subscription: {
						id: '2c92c0f94c510a0d014c569baa654600',
					},
				},
				id: '2c92c0f94c510a0d014c569ba8eb45f7',
				pricing: {
					AUD: 10,
					CAD: 6.99,
					EUR: 10,
					GBP: 9,
					USD: 7.99,
				},
				taxMode: 'TaxInclusive',
			},
		},
	},
	SupporterPlus: {
		ratePlans: {
			Annual: {
				billingPeriod: 'Annual',
				charges: {
					Contribution: {
						id: '8ad096ca858682bb0185881568385d73',
					},
					Subscription: {
						id: '8ad08e1a858672180185880566606fad',
					},
				},
				id: '8ad08e1a8586721801858805663f6fab',
				pricing: {
					AUD: 200,
					CAD: 150,
					EUR: 120,
					GBP: 120,
					NZD: 200,
					USD: 150,
				},
				taxMode: 'TaxInclusive',
			},
			AnnualTaxExclusive: {
				billingPeriod: 'Annual',
				charges: {
					Contribution: {
						id: '0582f3109d24425b843c890eaae5b595',
					},
					Subscription: {
						id: 'c632489d85ab4e5284fddd38e82b8ae4',
					},
				},
				id: 'f59be1a754254cf7bff266358fa14e7b',
				pricing: {
					CAD: 150,
					GBP: 120,
				},
				taxMode: 'TaxExclusive',
			},
			Discount: {
				billingPeriod: 'Month',
				charges: {
					Percentage: {
						id: '2c92c0f957220b5d0157299c97a60bbd',
					},
				},
				id: '2c92c0f85721ff7c01572942235b6d7a',
				pricing: {},
				taxMode: 'TaxExclusive',
			},
			Monthly: {
				billingPeriod: 'Month',
				charges: {
					Contribution: {
						id: '8ad09ea0858682bb0185880ac57f4c4c',
					},
					Subscription: {
						id: '8ad08cbd8586721c01858804e3715378',
					},
				},
				id: '8ad08cbd8586721c01858804e3275376',
				pricing: {
					AUD: 20,
					CAD: 15,
					EUR: 12,
					GBP: 12,
					NZD: 20,
					USD: 15,
				},
				taxMode: 'TaxInclusive',
			},
			MonthlyTaxExclusive: {
				billingPeriod: 'Month',
				charges: {
					Contribution: {
						id: 'e277d53d8b624e919ff60877725c5f01',
					},
					Subscription: {
						id: '9f2e630322be485286a27bbdac41f71a',
					},
				},
				id: '7a825d4a79bb49ec9a36883cad075fde',
				pricing: {
					CAD: 15,
					GBP: 12,
				},
				taxMode: 'TaxExclusive',
			},
			OneYearStudent: {
				billingPeriod: 'Annual',
				charges: {
					Subscription: {
						id: '71a10c6269b981784c9817e188d60001',
					},
				},
				id: '71a10c6269b981784c9817e1887c0000',
				pricing: {
					AUD: 15,
					CAD: 10,
					EUR: 10,
					GBP: 9,
					NZD: 15,
					USD: 10,
				},
				taxMode: 'TaxInclusive',
			},
			V1DeprecatedAnnual: {
				billingPeriod: 'Annual',
				charges: {
					Subscription: {
						id: '8ad09fc281de1ce70181de3b29223787',
					},
				},
				id: '8ad09fc281de1ce70181de3b28ee3783',
				pricing: {
					AUD: 160,
					CAD: 120,
					EUR: 95,
					GBP: 95,
					NZD: 160,
					USD: 120,
				},
				taxMode: 'TaxInclusive',
			},
			V1DeprecatedMonthly: {
				billingPeriod: 'Month',
				charges: {
					Subscription: {
						id: '8ad09fc281de1ce70181de3b253e36a6',
					},
				},
				id: '8ad09fc281de1ce70181de3b251736a4',
				pricing: {
					AUD: 17,
					CAD: 13,
					EUR: 10,
					GBP: 10,
					NZD: 17,
					USD: 13,
				},
				taxMode: 'TaxInclusive',
			},
		},
	},
	TierThree: {
		ratePlans: {
			Discount: {
				billingPeriod: 'Month',
				charges: {
					Percentage: {
						id: '2c92c0f957220b5d0157299c97a60bbd',
					},
				},
				id: '2c92c0f85721ff7c01572942235b6d7a',
				pricing: {},
				taxMode: 'TaxExclusive',
			},
			DomesticAnnual: {
				billingPeriod: 'Annual',
				charges: {
					GuardianWeekly: {
						id: '8ad081dd8ff24a9a019001dbc55635e8',
					},
					SupporterPlus: {
						id: '8ad097b48ff26452019001ddd8a226ed',
					},
				},
				id: '8ad081dd8ff24a9a019001d95e4e3574',
				pricing: {
					AUD: 680,
					CAD: 546,
					EUR: 438,
					GBP: 300,
					NZD: 800,
					USD: 510,
				},
				taxMode: 'TaxInclusive',
			},
			DomesticAnnualV2: {
				billingPeriod: 'Annual',
				charges: {
					GuardianWeekly: {
						id: '71a1889a1569c2d805ec2e67c4cd0056',
					},
					NewspaperArchive: {
						id: '71a1889a1569c2d805ec2e67c54a0064',
					},
					SupporterPlus: {
						id: '71a1889a1569c2d805ec2e67c50c005d',
					},
				},
				id: '71a1889a1569c2d805ec2e67c45b0055',
				pricing: {
					AUD: 62,
					CAD: 50,
					EUR: 40.5,
					GBP: 29,
					NZD: 72,
					USD: 47,
				},
				taxMode: 'TaxInclusive',
			},
			DomesticMonthly: {
				billingPeriod: 'Month',
				charges: {
					GuardianWeekly: {
						id: '8ad097b48ff26452019001d46f8824e2',
					},
					SupporterPlus: {
						id: '8ad097b48ff26452019001d78ee325d1',
					},
				},
				id: '8ad097b48ff26452019001cebac92376',
				pricing: {
					AUD: 60,
					CAD: 48,
					EUR: 38.5,
					GBP: 27,
					NZD: 70,
					USD: 45,
				},
				taxMode: 'TaxInclusive',
			},
			DomesticMonthlyV2: {
				billingPeriod: 'Month',
				charges: {
					GuardianWeekly: {
						id: '8ad081dd91dae1d30191e0ce086718d5',
					},
					NewspaperArchive: {
						id: '8ad097b491e54f780191eb3c36606552',
					},
					SupporterPlus: {
						id: '8ad081dd91dae1d30191e0ce089818dd',
					},
				},
				id: '8ad081dd91dae1d30191e0ce082d18d3',
				pricing: {
					AUD: 62,
					CAD: 50,
					EUR: 40.5,
					GBP: 29,
					NZD: 72,
					USD: 47,
				},
				taxMode: 'TaxInclusive',
			},
			RestOfWorldAnnual: {
				billingPeriod: 'Annual',
				charges: {
					GuardianWeekly: {
						id: '8ad097b48ff26452019001e65be32caa',
					},
					SupporterPlus: {
						id: '8ad097b48ff26452019001e65c262cb2',
					},
				},
				id: '8ad097b48ff26452019001e65bbf2ca8',
				pricing: {
					GBP: 417.6,
					USD: 546,
				},
				taxMode: 'TaxInclusive',
			},
			RestOfWorldAnnualV2: {
				billingPeriod: 'Annual',
				charges: {
					GuardianWeekly: {
						id: '71a17af0ed59c2d908ac2e73ebeb0147',
					},
					NewspaperArchive: {
						id: '71a17af0ed59c2d908ac2e73eca20155',
					},
					SupporterPlus: {
						id: '71a17af0ed59c2d908ac2e73ec4a014e',
					},
				},
				id: '71a17af0ed59c2d908ac2e73eb810146',
				pricing: {
					GBP: 29,
					USD: 47,
				},
				taxMode: 'TaxInclusive',
			},
			RestOfWorldMonthly: {
				billingPeriod: 'Month',
				charges: {
					GuardianWeekly: {
						id: '8ad097b48ff26452019001e2cedb27b9',
					},
					SupporterPlus: {
						id: '8ad097b48ff26452019001e632f82c99',
					},
				},
				id: '8ad081dd8ff24a9a019001df2ce83657',
				pricing: {
					GBP: 36.8,
					USD: 48,
				},
				taxMode: 'TaxInclusive',
			},
			RestOfWorldMonthlyV2: {
				billingPeriod: 'Month',
				charges: {
					GuardianWeekly: {
						id: '71a1b1d5a299c2d908cc2e67bc330071',
					},
					NewspaperArchive: {
						id: '71a1b1d5a299c2d908cc2e67bcdf007f',
					},
					SupporterPlus: {
						id: '71a1b1d5a299c2d908cc2e67bc8f0078',
					},
				},
				id: '71a1b1d5a299c2d908cc2e67bb7b0070',
				pricing: {
					GBP: 29,
					USD: 47,
				},
				taxMode: 'TaxInclusive',
			},
		},
	},
};
