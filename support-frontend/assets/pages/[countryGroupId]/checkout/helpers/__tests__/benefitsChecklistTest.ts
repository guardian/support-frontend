import type { CountryGroupId } from '@modules/internationalisation/countryGroup';
import { getBenefitsChecklistFromLandingPageTool } from '../benefitsChecklist';
import { expectedDefaultBenefits } from './__fixtures__/expectedDefaultBenefits';

describe('getBenefitsChecklistFromLandingPageTool', () => {
	const landingPageSettings = {
		name: 'TierThree',
		copy: {
			heading: 'TierThree heading',
			subheading: 'TierThree subheading',
		},
		products: {
			DigitalSubscription: {
				title: 'DigitalSubscription title',
				benefits: [
					{
						copy: 'DigitalSubscription benefit 1',
					},
					{
						copy: 'DigitalSubscription benefit 2',
					},
				],
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
	it('should return the correct benefits checklist for DigitalSubscription', () => {
		expect(
			getBenefitsChecklistFromLandingPageTool(
				'DigitalSubscription',
				landingPageSettings,
				GBP,
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
				text: 'SupporterPlus benefit 1',
			},
			{
				isChecked: true,
				text: 'SupporterPlus benefit 2',
			},
		]);
	});
	it('should return the correct benefits checklist for Contribution', () => {
		expect(
			getBenefitsChecklistFromLandingPageTool(
				'Contribution',
				landingPageSettings,
				GBP,
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
			getBenefitsChecklistFromLandingPageTool(
				'SupporterPlus',
				landingPageSettings,
				GBP,
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
	it('should return undefined for products other than T3, S+ & RC', () => {
		expect(
			getBenefitsChecklistFromLandingPageTool(
				'GuardianAdLite',
				landingPageSettings,
				GBP,
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
					const result = getBenefitsChecklistFromLandingPageTool(
						product as 'Contribution' | 'SupporterPlus' | 'DigitalSubscription',
						landingPageSettingsWithoutProducts,
						countryGroup as CountryGroupId,
					);
					expect(result).toEqual(
						expectedDefaultBenefits[product]?.[countryGroup],
					);
				});
			});
		});
	});
});
