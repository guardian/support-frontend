import type { CheckoutNudgeTest } from '../../globalsAndSwitches/checkoutNudgeSettings';
import { getCheckoutNudgeParticipations } from '../checkoutNudgeAbTests';
import { CHECKOUT_NUDGE_PARTICIPATIONS_KEY } from '../sessionStorage';

const copy = {
	heading: 'test heading',
	body: 'test body',
};

const oneTimeToRecurring__US: CheckoutNudgeTest = {
	name: 'oneTimeToRecurring__US',
	status: 'Live',
	regionTargeting: {
		targetedCountryGroups: ['UnitedStates'],
	},
	nudgeFromProduct: {
		product: 'OneTimeContribution',
		ratePlan: 'OneTime',
	},
	variants: [
		{
			name: 'control',
			nudgeToProduct: {
				product: 'Contribution',
				ratePlan: 'Monthly',
			},
			nudgeCopy: copy,
			thankyouCopy: copy,
			showBenefits: false,
		},
	],
};
const oneTimeToRecurring__NON_US: CheckoutNudgeTest = {
	name: 'oneTimeToRecurring__NON_US',
	status: 'Live',
	regionTargeting: {
		targetedCountryGroups: [
			'GBPCountries',
			'AUDCountries',
			'Canada',
			'EURCountries',
			'NZDCountries',
			'International',
		],
	},
	nudgeFromProduct: {
		product: 'OneTimeContribution',
		ratePlan: 'OneTime',
	},
	variants: [
		{
			name: 'control',
			nudgeToProduct: {
				product: 'Contribution',
				ratePlan: 'Monthly',
			},
			nudgeCopy: copy,
			thankyouCopy: copy,
			showBenefits: false,
		},
	],
};
const annualRecurringToSupporterPlus: CheckoutNudgeTest = {
	name: 'annualRecurringToSupporterPlus',
	status: 'Live',
	regionTargeting: {
		targetedCountryGroups: [],
	},
	nudgeFromProduct: {
		product: 'Contribution',
		ratePlan: 'Annual',
	},
	variants: [
		{
			name: 'control',
			nudgeToProduct: {
				product: 'SupporterPlus',
				ratePlan: 'Annual',
			},
			nudgeCopy: copy,
			thankyouCopy: copy,
			showBenefits: false,
		},
	],
};
const tests: CheckoutNudgeTest[] = [
	oneTimeToRecurring__US,
	oneTimeToRecurring__NON_US,
	annualRecurringToSupporterPlus,
];

describe('getCheckoutNudgeParticipations', () => {
	afterEach(() => {
		window.sessionStorage.clear();
	});

	it('assigns a user to oneTimeToRecurring__NON_US on UK one-time checkout', () => {
		const result = getCheckoutNudgeParticipations(
			'GBPCountries',
			'/uk/one-time-checkout',
			tests,
			0,
			'',
		);
		expect(result).toEqual({
			variant: oneTimeToRecurring__NON_US.variants[0],
			participations: { [oneTimeToRecurring__NON_US.name]: 'control' },
		});
	});

	it('assigns a user to oneTimeToRecurring__US on US one-time checkout', () => {
		const result = getCheckoutNudgeParticipations(
			'UnitedStates',
			'/us/one-time-checkout',
			tests,
			0,
			'',
		);
		expect(result).toEqual({
			variant: oneTimeToRecurring__US.variants[0],
			participations: { [oneTimeToRecurring__US.name]: 'control' },
		});
	});

	it('does not assign a user to a test if on landing page and nothing in session storage', () => {
		const result = getCheckoutNudgeParticipations(
			'GBPCountries',
			'/uk/contribute',
			tests,
			0,
			'',
		);
		expect(result).toBeUndefined();
	});

	it('assigns a user to a test if on landing page but test is in session storage', () => {
		window.sessionStorage.setItem(
			CHECKOUT_NUDGE_PARTICIPATIONS_KEY,
			JSON.stringify({ [oneTimeToRecurring__NON_US.name]: 'control' }),
		);

		const result = getCheckoutNudgeParticipations(
			'GBPCountries',
			'/uk/contribute',
			tests,
			0,
			'',
		);
		expect(result).toEqual({
			variant: oneTimeToRecurring__NON_US.variants[0],
			participations: { [oneTimeToRecurring__NON_US.name]: 'control' },
		});
	});

	it('uses the force-checkout-nudge url querystring parameter to force participation of US test', () => {
		const result = getCheckoutNudgeParticipations(
			'GBPCountries',
			'/uk/one-time-checkout',
			tests,
			0,
			`force-checkout-nudge=${oneTimeToRecurring__US.name}:control`,
		);
		expect(result).toEqual({
			variant: oneTimeToRecurring__US.variants[0],
			participations: { [oneTimeToRecurring__US.name]: 'control' },
		});
	});

	it('does not assign a user to a test if on recurring checkout with monthly ratePlan', () => {
		const result = getCheckoutNudgeParticipations(
			'GBPCountries',
			'/uk/checkout',
			tests,
			0,
			'product=Contribution&ratePlan=Monthly',
		);
		expect(result).toBeUndefined();
	});

	it('assigns a user to a test if on recurring checkout with annual ratePlan', () => {
		const result = getCheckoutNudgeParticipations(
			'GBPCountries',
			'/uk/checkout',
			tests,
			0,
			'product=Contribution&ratePlan=Annual',
		);
		expect(result).toEqual({
			variant: annualRecurringToSupporterPlus.variants[0],
			participations: { [annualRecurringToSupporterPlus.name]: 'control' },
		});
	});
});
