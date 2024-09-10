import type { AppConfig } from 'helpers/globalsAndSwitches/window';
import { testGetProductFromContributionParams } from './contributionCheckoutRedirect';

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
				expected: {
					product: 'SupporterPlus',
					ratePlan: 'Monthly',
				},
			},
			{
				name: 'Should return Contribution Monthly when below SupporterPlus price in the UK',
				geoId: 'uk',
				selectedContributionType: 'monthly',
				selectedAmount: '11',
				expected: {
					product: 'Contribution',
					ratePlan: 'Monthly',
					contribution: 11,
				},
			},
			{
				name: 'Should return SupporterPlus Monthly with contribution when above SupporterPlus price in the UK',
				geoId: 'uk',
				selectedContributionType: 'monthly',
				selectedAmount: '13',
				expected: {
					product: 'SupporterPlus',
					ratePlan: 'Monthly',
					contribution: 1,
				},
			},
			{
				name: 'Should return SupporterPlus Annual when equal to SupporterPlus price in the US',
				geoId: 'us',
				selectedContributionType: 'annual',
				selectedAmount: '150',
				expected: {
					product: 'SupporterPlus',
					ratePlan: 'Annual',
				},
			},
			{
				name: 'Should return Contribution Annual when below SupporterPlus price in the US',
				geoId: 'us',
				selectedContributionType: 'annual',
				selectedAmount: '110',
				expected: {
					product: 'Contribution',
					ratePlan: 'Annual',
					contribution: 110,
				},
			},
			{
				name: 'Should return SupporterPlus Annual with contribution when above SupporterPlus price in the US',
				geoId: 'us',
				selectedContributionType: 'annual',
				selectedAmount: '160',
				expected: {
					product: 'SupporterPlus',
					ratePlan: 'Annual',
					contribution: 10,
				},
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
