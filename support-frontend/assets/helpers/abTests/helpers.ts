import type { Participations } from 'helpers/abTests/abtest';
import type {
	AmountsTest,
	SelectedAmountsVariant,
} from 'helpers/contributions';
import type { Settings } from 'helpers/globalsAndSwitches/settings';
import type { IsoCountry } from 'helpers/internationalisation/country';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';

export const FALLBACK_AMOUNTS: AmountsTest[] = [
	{
		testName: 'FALLBACK_AMOUNTS__GBPCountries',
		liveTestName: '',
		isLive: false,
		target: 'GBPCountries',
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
		target: 'UnitedStates',
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
		target: 'EURCountries',
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
		target: 'International',
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
		target: 'Canada',
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
		target: 'AUDCountries',
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
		target: 'NZDCountries',
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
	const fallbackTest = FALLBACK_AMOUNTS.filter(
		(t) => t.target === countryGroupId,
	)[0];
	return {
		...fallbackTest.variants[0],
		testName: fallbackTest.testName,
	};
}

export function getAmounts(
	settings: Settings,
	abParticipations: Participations,
	countryGroupId: CountryGroupId,
	countryCode?: IsoCountry,
): SelectedAmountsVariant {
	// Unable to locate amounts test data from settings object
	if (!settings.amounts) {
		return getFallbackAmounts(countryGroupId);
	}

	const AMOUNTS = settings.amounts;

	let testArray = AMOUNTS.filter((t) => t.target === countryCode);
	if (!testArray.length) {
		testArray = AMOUNTS.filter((t) => t.target === countryGroupId);
	}

	// Unable to locate a test which maps to the argument data supplied
	if (!testArray.length) {
		return getFallbackAmounts(countryGroupId);
	}

	const targetTest = testArray[0];
	const { testName, liveTestName, isLive, variants } = targetTest;

	// No control or variants in data
	if (!variants.length) {
		return getFallbackAmounts(countryGroupId);
	}

	// Return the control variant (which is always the first variant in the array) if there's no test or just a single variant
	if (!isLive || variants.length === 1) {
		return {
			testName,
			...variants[0],
		};
	}

	// Find relevant variant name
	const currentTestName = liveTestName ?? testName;
	const variantName = abParticipations[currentTestName];
	const variant = variants.find((v) => v.variantName === variantName);

	// If unable to locate required variant, return control variant
	if (!variant) {
		return {
			testName: currentTestName,
			...variants[0],
		};
	}

	// Return the required test variant
	return {
		testName: currentTestName,
		...variant,
	};
}
