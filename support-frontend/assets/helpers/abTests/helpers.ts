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
		region: 'GBPCountries',
		country: [],
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
		region: 'UnitedStates',
		country: [],
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
		region: 'EURCountries',
		country: [],
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
		region: 'International',
		country: [],
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
		region: 'Canada',
		country: [],
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
		region: 'AUDCountries',
		country: [],
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
		region: 'NZDCountries',
		country: [],
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
		(t) => t.region === countryGroupId,
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

	const amounts = settings.amounts;

	// Has user arrived at landing page with an URL detailing a specific amounts test variant?
	if (Object.keys(abParticipations).length) {
		for (const [test, variant] of Object.entries(abParticipations)) {
			const candidate = amounts.find((t) => {
				if (t.isLive) {
					return t.liveTestName === test;
				} else {
					return t.testName === test;
				}
			});
			if (candidate) {
				const variants = candidate.variants;
				if (variants.length) {
					if (variant === 'CONTROL' || variants.length === 1) {
						return {
							testName: test,
							...variants[0],
						};
					} else {
						for (let i = 0; i < variants.length; i++) {
							const v = variants[i];
							if (v.variantName === variant) {
								return {
									testName: test,
									...v,
								};
							}
						}
					}
				}
			}
		}
	}

	/* 
		For country-level tests, the isLive boolean tells us whether the test is live (true: show the test) or draft (false: show the region-level test instead)

		Countries can appear in more than one country-level test; we sort the filtered tests according to their order attribute and select the test with the lowest order.

		For region-level tests, the isLive boolean tells us whether there is an AB test running (true: select a test variant from all avaliable) or not (false: select the control variant)
	*/
	let targetTestArray: AmountsTest[] = [];
	if (countryCode) {
		targetTestArray = amounts.filter(
			(t) => t.isLive && t.country.includes(countryCode),
		);
	}
	let targetTest;
	if (targetTestArray.length) {
		targetTestArray.sort((a, b) => a.order - b.order);
		targetTest = targetTestArray[0];
	}
	if (!targetTest) {
		targetTest = amounts.find((t) => t.region === countryGroupId);
	}

	// Unable to locate a test which maps to the argument data supplied
	if (!targetTest) {
		return getFallbackAmounts(countryGroupId);
	}

	const { testName, liveTestName, isLive, variants } = targetTest;

	// No control or variants in data
	if (!variants.length) {
		return getFallbackAmounts(countryGroupId);
	}

	/* 
		We return the control variant (which is always the first variant in the array) if there's no live AB test running (for a regional test) or just a single variant in the test
	*/
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
