import type { LandingPageVariant } from 'helpers/globalsAndSwitches/landingPageSettings';
import { getOnboardingProductCopy } from './onboardingProductCopy';

const liveControlVariant: LandingPageVariant = {
	name: 'CONTROL',
	copy: {
		heading: 'Support fearless, independent journalism',
		subheading: 'Choose to join with one of the options below.',
	},
	products: {
		Contribution: {
			title: 'Support',
			benefits: [{ copy: 'Give to the Guardian every month with Support' }],
			cta: { copy: 'Support' },
		},
		SupporterPlus: {
			title: 'All-access digital',
			benefits: [{ copy: 'Ad-free reading on all your devices' }],
			cta: { copy: 'Support' },
		},
	},
};

describe('getOnboardingProductCopy', () => {
	it('uses the CMS title when SupporterPlus is present', () => {
		const settings: LandingPageVariant = {
			...liveControlVariant,
			products: {
				...liveControlVariant.products,
				SupporterPlus: {
					title: 'CMS All-access',
					benefits: [{ copy: 'CMS benefit' }],
					cta: { copy: 'Support' },
				},
			},
		};

		expect(
			getOnboardingProductCopy('SupporterPlus', settings, 'GBPCountries').title,
		).toBe('CMS All-access');
	});

	it('falls back to the catalog label when DigitalSubscription is missing from CMS', () => {
		expect(
			getOnboardingProductCopy(
				'DigitalSubscription',
				liveControlVariant,
				'GBPCountries',
			).title,
		).toBe('Digital plus');
	});

	it('falls back to the catalog label when SupporterPlus is missing from CMS', () => {
		const settings: LandingPageVariant = {
			...liveControlVariant,
			products: {
				Contribution: liveControlVariant.products.Contribution,
			},
		};

		expect(
			getOnboardingProductCopy('SupporterPlus', settings, 'GBPCountries').title,
		).toBe('All-access digital');
	});

	it('returns an empty title and no benefits when productKey is missing', () => {
		expect(
			getOnboardingProductCopy(undefined, liveControlVariant, 'GBPCountries'),
		).toEqual({
			title: '',
			benefits: [],
		});
	});

	it('still returns Digital plus benefits when that product is missing from CMS', () => {
		const { benefits } = getOnboardingProductCopy(
			'DigitalSubscription',
			liveControlVariant,
			'GBPCountries',
		);

		expect(benefits.length).toBeGreaterThan(0);
		expect(benefits.map((benefit) => benefit.text)).toContain(
			'Guardian Weekly e-magazine',
		);
	});
});
