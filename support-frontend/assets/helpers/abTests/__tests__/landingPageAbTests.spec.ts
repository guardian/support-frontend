import type { LandingPageTest } from '../../globalsAndSwitches/landingPageSettings';
import {
	fallBackLandingPageSelection,
	getLandingPageParticipations,
	getLandingPageVariant,
} from '../landingPageAbTests';
import { LANDING_PAGE_PARTICIPATIONS_KEY } from '../sessionStorage';

const nonUsTest: LandingPageTest = {
	name: 'LP_DEFAULT',
	status: 'Live',
	regionTargeting: {
		targetedCountryGroups: [
			'GBPCountries',
			'AUDCountries',
			'EURCountries',
			'International',
			'NZDCountries',
			'Canada',
		],
	},
	variants: [
		{
			name: 'CONTROL',
			copy: {
				heading: 'Support fearless, independent journalism!',
				subheading:
					"We're not owned by a billionaire or shareholders - our readers support us. Choose to join with one of the options below. <strong>Cancel anytime.</strong>",
			},
			products: fallBackLandingPageSelection.products,
		},
	],
};
const usTest: LandingPageTest = {
	name: 'LP_DEFAULT_US',
	status: 'Live',
	regionTargeting: { targetedCountryGroups: ['UnitedStates'] },
	variants: [
		{
			name: 'CONTROL',
			copy: {
				heading: 'Support fearless, independent journalism!',
				subheading:
					"We're not owned by a billionaire or profit-driven corporation: our fiercely independent journalism is funded by our readers. Monthly giving makes the most impact (and you can cancel anytime). Thank you.",
			},
			products: fallBackLandingPageSelection.products,
		},
	],
};
const tests = [usTest, nonUsTest];

const mvtId = 0;

describe('getLandingPageParticipations', () => {
	afterEach(() => {
		window.sessionStorage.clear();
	});

	it('assigns a user to the UK test on UK landing page', () => {
		const result = getLandingPageParticipations(
			'GBPCountries',
			'/uk/contribute',
			tests,
			mvtId,
		);
		expect(result).toEqual({
			variant: nonUsTest.variants[0],
			participations: { [nonUsTest.name]: 'CONTROL' },
		});
	});

	it('assigns a user to the US test on US landing page', () => {
		const result = getLandingPageParticipations(
			'UnitedStates',
			'/us/contribute',
			tests,
			mvtId,
		);
		expect(result).toEqual({
			variant: usTest.variants[0],
			participations: { [usTest.name]: 'CONTROL' },
		});
	});

	it('assigns a user to the UK test on a checkout page if it is in session storage', () => {
		window.sessionStorage.setItem(
			LANDING_PAGE_PARTICIPATIONS_KEY,
			JSON.stringify({ [nonUsTest.name]: 'CONTROL' }),
		);

		const result = getLandingPageParticipations(
			'GBPCountries',
			'/uk/one-time-checkout',
			tests,
			mvtId,
		);
		expect(result).toEqual({
			variant: nonUsTest.variants[0],
			participations: { [nonUsTest.name]: 'CONTROL' },
		});
	});

	it('does not assign a user to the UK test on a checkout page if it is *not* in session storage', () => {
		const result = getLandingPageParticipations(
			'GBPCountries',
			'/uk/one-time-checkout',
			tests,
			mvtId,
		);
		expect(result.participations).toEqual({});
	});
});

describe('getLandingPageVariant', () => {
	it('finds variant for participation', () => {
		const participations = {
			TEST_A: 'V1',
			TEST_B: 'V2',
			[nonUsTest.name]: 'CONTROL',
		};
		const result = getLandingPageVariant(participations, tests);
		expect(result).toEqual(nonUsTest.variants[0]);
	});

	it('falls back on default settings if no landing page test matches', () => {
		const participations = {
			TEST_A: 'V1',
			TEST_B: 'V2',
		};
		const result = getLandingPageVariant(participations, tests);
		expect(result).toEqual(fallBackLandingPageSelection);
	});
});
