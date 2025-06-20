import type { CountryGroupId } from '@modules/internationalisation/countryGroup';
import type {
	AmountsTest,
	AmountsVariant,
	SelectedAmountsVariant,
} from 'helpers/contributions';

type AmountsTestWithVariants = AmountsTest & {
	variants: [AmountsVariant, ...AmountsVariant[]];
};

type NonEmptyAmountsTestArray = [
	AmountsTestWithVariants,
	...AmountsTestWithVariants[],
];

const FALLBACK_AMOUNTS: NonEmptyAmountsTestArray = [
	{
		testName: 'FALLBACK_AMOUNTS__GBPCountries',
		liveTestName: '',
		isLive: false,
		targeting: {
			targetingType: 'Region',
			region: 'GBPCountries',
		},
		order: 0,
		seed: 0,
		variants: [
			{
				variantName: 'CONTROL',
				defaultContributionType: 'MONTHLY',
				displayContributionType: ['ONE_OFF', 'MONTHLY', 'ANNUAL'],
				amountsCardData: {
					ONE_OFF: {
						amounts: [30, 60, 120, 240],
						defaultAmount: 60,
						hideChooseYourAmount: false,
					},
					MONTHLY: {
						amounts: [3, 7, 12],
						defaultAmount: 7,
						hideChooseYourAmount: false,
					},
					ANNUAL: {
						amounts: [60, 120, 240, 480],
						defaultAmount: 120,
						hideChooseYourAmount: false,
					},
				},
			},
		],
	},
	{
		testName: 'FALLBACK_AMOUNTS__UnitedStates',
		liveTestName: '',
		isLive: false,
		targeting: {
			targetingType: 'Region',
			region: 'UnitedStates',
		},
		order: 0,
		seed: 0,
		variants: [
			{
				variantName: 'CONTROL',
				defaultContributionType: 'MONTHLY',
				displayContributionType: ['ONE_OFF', 'MONTHLY', 'ANNUAL'],
				amountsCardData: {
					ONE_OFF: {
						amounts: [25, 50, 100, 250],
						defaultAmount: 50,
						hideChooseYourAmount: false,
					},
					MONTHLY: {
						amounts: [7, 15, 30],
						defaultAmount: 15,
						hideChooseYourAmount: false,
					},
					ANNUAL: {
						amounts: [50, 100, 250, 500],
						defaultAmount: 50,
						hideChooseYourAmount: false,
					},
				},
			},
		],
	},
	{
		testName: 'FALLBACK_AMOUNTS__EURCountries',
		liveTestName: '',
		isLive: false,
		targeting: {
			targetingType: 'Region',
			region: 'EURCountries',
		},
		order: 0,
		seed: 0,
		variants: [
			{
				variantName: 'CONTROL',
				defaultContributionType: 'MONTHLY',
				displayContributionType: ['ONE_OFF', 'MONTHLY', 'ANNUAL'],
				amountsCardData: {
					ONE_OFF: {
						amounts: [25, 50, 100, 250],
						defaultAmount: 50,
						hideChooseYourAmount: false,
					},
					MONTHLY: {
						amounts: [6, 10, 20],
						defaultAmount: 10,
						hideChooseYourAmount: false,
					},
					ANNUAL: {
						amounts: [50, 100, 250, 500],
						defaultAmount: 50,
						hideChooseYourAmount: false,
					},
				},
			},
		],
	},
	{
		testName: 'FALLBACK_AMOUNTS__International',
		liveTestName: '',
		isLive: false,
		targeting: {
			targetingType: 'Region',
			region: 'International',
		},
		order: 0,
		seed: 0,
		variants: [
			{
				variantName: 'CONTROL',
				defaultContributionType: 'MONTHLY',
				displayContributionType: ['ONE_OFF', 'MONTHLY', 'ANNUAL'],
				amountsCardData: {
					ONE_OFF: {
						amounts: [25, 50, 100, 250],
						defaultAmount: 50,
						hideChooseYourAmount: false,
					},
					MONTHLY: {
						amounts: [5, 10, 20],
						defaultAmount: 10,
						hideChooseYourAmount: false,
					},
					ANNUAL: {
						amounts: [60, 100, 250, 500],
						defaultAmount: 60,
						hideChooseYourAmount: false,
					},
				},
			},
		],
	},
	{
		testName: 'FALLBACK_AMOUNTS__Canada',
		liveTestName: '',
		isLive: false,
		targeting: {
			targetingType: 'Region',
			region: 'Canada',
		},
		order: 0,
		seed: 0,
		variants: [
			{
				variantName: 'CONTROL',
				defaultContributionType: 'MONTHLY',
				displayContributionType: ['ONE_OFF', 'MONTHLY', 'ANNUAL'],
				amountsCardData: {
					ONE_OFF: {
						amounts: [25, 50, 100, 250],
						defaultAmount: 50,
						hideChooseYourAmount: false,
					},
					MONTHLY: {
						amounts: [5, 10, 20],
						defaultAmount: 10,
						hideChooseYourAmount: false,
					},
					ANNUAL: {
						amounts: [60, 100, 250, 500],
						defaultAmount: 60,
						hideChooseYourAmount: false,
					},
				},
			},
		],
	},
	{
		testName: 'FALLBACK_AMOUNTS__AUDCountries',
		liveTestName: '',
		isLive: false,
		targeting: {
			targetingType: 'Region',
			region: 'AUDCountries',
		},
		order: 0,
		seed: 0,
		variants: [
			{
				variantName: 'CONTROL',
				defaultContributionType: 'MONTHLY',
				displayContributionType: ['ONE_OFF', 'MONTHLY', 'ANNUAL'],
				amountsCardData: {
					ONE_OFF: {
						amounts: [60, 100, 250, 500],
						defaultAmount: 100,
						hideChooseYourAmount: false,
					},
					MONTHLY: {
						amounts: [10, 20, 40],
						defaultAmount: 20,
						hideChooseYourAmount: false,
					},
					ANNUAL: {
						amounts: [80, 250, 500, 750],
						defaultAmount: 80,
						hideChooseYourAmount: false,
					},
				},
			},
		],
	},
	{
		testName: 'FALLBACK_AMOUNTS__NZDCountries',
		liveTestName: '',
		isLive: false,
		targeting: {
			targetingType: 'Region',
			region: 'NZDCountries',
		},
		order: 0,
		seed: 0,
		variants: [
			{
				variantName: 'CONTROL',
				defaultContributionType: 'MONTHLY',
				displayContributionType: ['ONE_OFF', 'MONTHLY', 'ANNUAL'],
				amountsCardData: {
					ONE_OFF: {
						amounts: [50, 100, 250, 500],
						defaultAmount: 100,
						hideChooseYourAmount: false,
					},
					MONTHLY: {
						amounts: [10, 20, 50],
						defaultAmount: 20,
						hideChooseYourAmount: false,
					},
					ANNUAL: {
						amounts: [50, 100, 250, 500],
						defaultAmount: 50,
						hideChooseYourAmount: false,
					},
				},
			},
		],
	},
];

export function getFallbackAmounts(
	countryGroupId: CountryGroupId,
): SelectedAmountsVariant {
	// Create fallback data - the amounts card must always have data to dsplay
	const fallbackTest = FALLBACK_AMOUNTS.find(
		(t) =>
			t.targeting.targetingType === 'Region' &&
			t.targeting.region === countryGroupId,
	);
	if (fallbackTest) {
		return {
			...fallbackTest.variants[0],
			testName: fallbackTest.testName,
		};
	} else {
		return {
			...FALLBACK_AMOUNTS[0].variants[0],
			testName: FALLBACK_AMOUNTS[0].testName,
		};
	}
}
