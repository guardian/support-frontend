import type { AppConfig } from 'helpers/globalsAndSwitches/window';
import { testGetProductFromContributionParams } from './router';

describe('getProductFromContributionParams', () => {
	const productCatalogMock: AppConfig['productCatalog'] = {
		SupporterPlus: {
			ratePlans: {
				Annual: {
					id: '???',
					billingPeriod: 'Annual',
					pricing: {
						GBP: 120,
						USD: 150,
					},
					charges: {
						Subscription: { id: '???' },
					},
				},
				Monthly: {
					id: '???',
					billingPeriod: 'Month',
					pricing: {
						GBP: 12,
						USD: 15,
					},
					charges: {
						Subscription: { id: '???' },
					},
				},
			},
		},
	} as const;

	(
		[
			{
				name: 'Should return SupporterPlus Monthly when equal to SupporterPlus price in the UK',
				geoId: 'uk',
				selectedContributionType: 'monthly',
				selectedAmount: '12',
				expected: { product: 'SupporterPlus', amount: 12, ratePlan: 'Monthly' },
			},
			{
				name: 'Should return Contribution Monthly when below SupporterPlus price in the UK',
				geoId: 'uk',
				selectedContributionType: 'monthly',
				selectedAmount: '11',
				expected: { product: 'Contribution', amount: 11, ratePlan: 'Monthly' },
			},
			{
				name: 'Should return SupporterPlus Annual when equal to SupporterPlus price in the US',
				geoId: 'us',
				selectedContributionType: 'annual',
				selectedAmount: '120',
				expected: { product: 'Contribution', amount: 120, ratePlan: 'Annual' },
			},
			{
				name: 'Should return Contribution Annual when below SupporterPlus price in the US',
				geoId: 'us',
				selectedContributionType: 'annual',
				selectedAmount: '110',
				expected: { product: 'Contribution', amount: 110, ratePlan: 'Annual' },
			},
		] as const
	).forEach(
		({ name, geoId, selectedContributionType, selectedAmount, expected }) => {
			test(name, () => {
				expect(
					testGetProductFromContributionParams(
						geoId,
						productCatalogMock,
						new URLSearchParams({
							'selected-contribution-type': selectedContributionType,
							'selected-amount': selectedAmount,
						}),
					),
				).toEqual(expected);
			});
		},
	);
});
