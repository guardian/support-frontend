import type { CountryGroupId } from '@modules/internationalisation/countryGroup';
import {
	filterBenefits,
	getProductBenefitsChecklist,
} from '../benefitsChecklist';
import { expectedDefaultBenefits } from './__fixtures__/expectedDefaultBenefits';

describe('getBenefitsChecklistFromLandingPageTool', () => {
	const abParticipations = {
		multipleAccounts: 'control',
	};
	const digitalSubscriptionBaseBenefits = [
		{
			copy: 'DigitalSubscription benefit 1',
		},
		{
			copy: 'DigitalSubscription benefit 2',
		},
	];
	const digitalSubscriptionBenefits = [
		...digitalSubscriptionBaseBenefits,
		{
			copy: 'DigitalSubscription multipleAccounts control benefit 3',
			specificToAbTest: [
				{
					name: 'multipleAccounts',
					variants: ['control'],
					display: true,
				},
			],
		},
	];
	const landingPageSettings = {
		name: 'SupporterPlus',
		copy: {
			heading: 'SupporterPlus heading',
			subheading: 'SupporterPlus subheading',
		},
		products: {
			DigitalSubscription: {
				title: 'DigitalSubscription title',
				benefits: digitalSubscriptionBenefits,
				cta: {
					copy: 'DigitalSubscription cta',
				},
			},
			SupporterPlus: {
				title: 'SupporterPlus title',
				benefits: [
					{
						copy: 'SupporterPlus benefit 1',
					},
					{
						copy: 'SupporterPlus benefit 2',
					},
				],
				cta: {
					copy: 'SupporterPlus cta',
				},
			},
			Contribution: {
				title: 'Contribution title',
				benefits: [
					{
						copy: 'Contribution benefit 1',
					},
					{
						copy: 'Contribution benefit 2',
					},
				],
				cta: {
					copy: 'Contribution cta',
				},
			},
		},
	};
	const GBP = 'GBPCountries';
	it('should return UK DigitalSubscription benefits including multipleAccounts control benefit', () => {
		expect(
			getProductBenefitsChecklist(
				'DigitalSubscription',
				landingPageSettings,
				GBP,
				abParticipations,
			),
		).toEqual([
			{
				isChecked: true,
				text: 'DigitalSubscription benefit 1',
			},
			{
				isChecked: true,
				text: 'DigitalSubscription benefit 2',
			},
			{
				isChecked: true,
				text: 'DigitalSubscription multipleAccounts control benefit 3',
			},
			{
				isChecked: true,
				text: 'SupporterPlus benefit 1',
			},
			{
				isChecked: true,
				text: 'SupporterPlus benefit 2',
			},
		]);
	});
	it('filterBenefits should return UK DigitalSubscription all benefits including multipleAccounts control benefit', () => {
		expect(
			filterBenefits(
				landingPageSettings.products.DigitalSubscription.benefits,
				GBP,
				abParticipations,
			),
		).toEqual(digitalSubscriptionBenefits);
	});

	it('filterBenefits should return UK DigitalSubscription base benefits excluding multipleAccounts control benefit', () => {
		expect(
			filterBenefits(
				landingPageSettings.products.DigitalSubscription.benefits,
				GBP,
				{
					multipleAccounts: undefined,
				},
			),
		).toEqual(digitalSubscriptionBaseBenefits);
	});
	it('should return the correct benefits checklist for Contribution', () => {
		expect(
			getProductBenefitsChecklist(
				'Contribution',
				landingPageSettings,
				GBP,
				abParticipations,
			),
		).toMatchObject([
			{
				isChecked: true,
				text: 'Contribution benefit 1',
			},
			{
				isChecked: true,
				text: 'Contribution benefit 2',
			},
			{
				isChecked: false,
				maybeGreyedOut: {
					name: expect.any(String) as string,
					styles: expect.any(String) as string,
				},
				text: 'SupporterPlus benefit 1',
			},
			{
				isChecked: false,
				maybeGreyedOut: {
					name: expect.any(String) as string,
					styles: expect.any(String) as string,
				},
				text: 'SupporterPlus benefit 2',
			},
		]);
	});
	it('should return the correct benefits checklist for SupporterPlus', () => {
		expect(
			getProductBenefitsChecklist(
				'SupporterPlus',
				landingPageSettings,
				GBP,
				abParticipations,
			),
		).toEqual([
			{
				isChecked: true,
				text: 'SupporterPlus benefit 1',
			},
			{
				isChecked: true,
				text: 'SupporterPlus benefit 2',
			},
		]);
	});
	it('should return undefined for products other than DigitalSubscription, SupporterPlus & Contribution', () => {
		expect(
			getProductBenefitsChecklist(
				'GuardianAdLite',
				landingPageSettings,
				GBP,
				abParticipations,
			),
		).toBeUndefined();
	});

	describe('getBenefitsChecklistFromLandingPageTool with missing benefits in landing page tool', () => {
		const countryGroups = [
			'GBPCountries',
			'AUDCountries',
			'EURCountries',
			'UnitedStates',
			'International',
			'NZDCountries',
			'Canada',
		];
		const products = ['Contribution', 'SupporterPlus', 'DigitalSubscription'];
		const landingPageSettingsWithoutProducts = {
			...landingPageSettings,
			products: {},
		};
		products.forEach((product) => {
			countryGroups.forEach((countryGroup) => {
				it(`should return default benefits if none are defined in landing page tool for ${product} in ${countryGroup}`, () => {
					const result = getProductBenefitsChecklist(
						product as 'Contribution' | 'SupporterPlus' | 'DigitalSubscription',
						landingPageSettingsWithoutProducts,
						countryGroup as CountryGroupId,
						abParticipations,
					);
					expect(result).toEqual(
						expectedDefaultBenefits[product]?.[countryGroup],
					);
				});
			});
		});
	});
});
