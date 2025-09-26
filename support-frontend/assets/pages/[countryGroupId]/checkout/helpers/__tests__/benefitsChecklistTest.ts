import { getBenefitsChecklistFromLandingPageTool } from '../benefitsChecklist';

describe('getBenefitsChecklistFromLandingPageTool', () => {
	const landingPageSettings = {
		name: 'TierThree',
		copy: {
			heading: 'TierThree heading',
			subheading: 'TierThree subheading',
		},
		products: {
			TierThree: {
				title: 'TierThree title',
				benefits: [
					{
						copy: 'TierThree benefit 1',
					},
					{
						copy: 'TierThree benefit 2',
					},
				],
				cta: {
					copy: 'TierThree cta',
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
	it('should return the correct benefits checklist for TierThree', () => {
		expect(
			getBenefitsChecklistFromLandingPageTool(
				'TierThree',
				landingPageSettings,
				'GBPCountries',
			),
		).toEqual([
			{
				isChecked: true,
				text: 'TierThree benefit 1',
			},
			{
				isChecked: true,
				text: 'TierThree benefit 2',
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
				'GBPCountries',
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
				'GBPCountries',
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
				'GBPCountries',
			),
		).toBeUndefined();
	});
});
