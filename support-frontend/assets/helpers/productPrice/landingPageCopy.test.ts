import type { PromoWithCatalogInformation } from '@modules/promotions/v2/schema';
import {
	getLandingPageCopy,
	getSanitisedLandingPageCopy,
} from './landingPageCopy';

const promotion = (
	promoCode: string,
	landingPage?: PromoWithCatalogInformation['landingPage'],
): PromoWithCatalogInformation => ({
	promoCode,
	name: promoCode,
	campaignCode: 'TEST_CAMPAIGN',
	appliesTo: {
		productRatePlanIds: [],
		countries: ['GB'],
		catalogRatePlans: [
			{
				productKey: 'GuardianWeeklyDomestic',
				productRatePlanKey: 'MonthlyPlus',
			},
		],
	},
	startTimestamp: '2026-01-01T00:00:00.000Z',
	landingPage,
});

describe('getLandingPageCopy', () => {
	const copy = { title: 'Promo title', description: 'Promo description' };
	const otherCopy = { title: 'Other title', roundelHtml: 'Other roundel' };
	const promoWithoutCopy = promotion('NOCOPY');
	const promoWithCopy = promotion('COPY', copy);
	const otherPromoWithCopy = promotion('OTHERCOPY', otherCopy);

	it('returns undefined when no promotion has landing page copy', () => {
		expect(getLandingPageCopy([promoWithoutCopy], 'NOCOPY')).toBeUndefined();
	});

	it('returns the copy from the first promotion which has some', () => {
		expect(
			getLandingPageCopy([promoWithoutCopy, promoWithCopy, otherPromoWithCopy]),
		).toBe(copy);
	});

	it('prefers the copy from the promotion matching the promo code', () => {
		expect(
			getLandingPageCopy([promoWithCopy, otherPromoWithCopy], 'OTHERCOPY'),
		).toBe(otherCopy);
	});

	it('ignores a promo code promotion which has no landing page copy', () => {
		expect(
			getLandingPageCopy([promoWithoutCopy, promoWithCopy], 'NOCOPY'),
		).toBe(copy);
	});
});

describe('getSanitisedLandingPageCopy', () => {
	it('returns undefined when there is no landing page copy', () => {
		expect(getSanitisedLandingPageCopy()).toBeUndefined();
	});

	it('converts markdown to html and removes disallowed html', () => {
		expect(
			getSanitisedLandingPageCopy({
				title: 'The Guardian Weekly',
				description:
					'A round-up of [the week](https://www.theguardian.com)<script>alert(1)</script>',
				roundelHtml: '**Save _25%_ for a year!**',
			}),
		).toEqual({
			title: 'The Guardian Weekly',
			description:
				'A round-up of <a href="https://www.theguardian.com">the week</a>',
			roundelHtml: '<strong>Save <em>25%</em> for a year!</strong>',
		});
	});

	it('defaults missing fields to empty strings', () => {
		expect(getSanitisedLandingPageCopy({ title: 'Title' })).toEqual({
			title: 'Title',
			description: '',
			roundelHtml: '',
		});
	});
});
