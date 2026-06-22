import { SupportRegionId } from '@modules/internationalisation/countryGroup';
import { buildCheckoutUrl } from './checkoutUrl';

describe('buildCheckoutUrl', () => {
	describe('Contribution', () => {
		it('builds the correct URL with product, ratePlan and contribution amount', () => {
			const url = buildCheckoutUrl(SupportRegionId.UK, {
				product: 'Contribution',
				ratePlan: 'Monthly',
				contribution: 5,
			});
			expect(url).toBe(
				'/uk/checkout?product=Contribution&ratePlan=Monthly&contribution=5',
			);
		});

		it('encodes the contribution amount as a string', () => {
			const url = buildCheckoutUrl(SupportRegionId.UK, {
				product: 'Contribution',
				ratePlan: 'Annual',
				contribution: 120,
			});
			expect(url).toContain('contribution=120');
		});
	});

	describe('SupporterPlus', () => {
		it('builds the correct URL without a promo code', () => {
			const url = buildCheckoutUrl(SupportRegionId.US, {
				product: 'SupporterPlus',
				ratePlan: 'Monthly',
			});
			expect(url).toBe('/us/checkout?product=SupporterPlus&ratePlan=Monthly');
		});

		it('includes promoCode when provided', () => {
			const url = buildCheckoutUrl(SupportRegionId.US, {
				product: 'SupporterPlus',
				ratePlan: 'Annual',
				promoCode: 'SPROMO',
			});
			expect(url).toBe(
				'/us/checkout?product=SupporterPlus&ratePlan=Annual&promoCode=SPROMO',
			);
		});

		it('omits promoCode when undefined', () => {
			const url = buildCheckoutUrl(SupportRegionId.US, {
				product: 'SupporterPlus',
				ratePlan: 'Monthly',
				promoCode: undefined,
			});
			expect(url).not.toContain('promoCode');
		});
	});

	describe('DigitalSubscription', () => {
		it('builds the correct URL without a promo code', () => {
			const url = buildCheckoutUrl(SupportRegionId.CA, {
				product: 'DigitalSubscription',
				ratePlan: 'Monthly',
			});
			expect(url).toBe(
				'/ca/checkout?product=DigitalSubscription&ratePlan=Monthly',
			);
		});

		it('includes promoCode when provided', () => {
			const url = buildCheckoutUrl(SupportRegionId.CA, {
				product: 'DigitalSubscription',
				ratePlan: 'Annual',
				promoCode: 'DIGISUB20',
			});
			expect(url).toBe(
				'/ca/checkout?product=DigitalSubscription&ratePlan=Annual&promoCode=DIGISUB20',
			);
		});
	});

	describe('URL format', () => {
		it('always starts with support Region Id?', () => {
			const url = buildCheckoutUrl(SupportRegionId.EU, {
				product: 'Contribution',
				ratePlan: 'Monthly',
				contribution: 5,
			});
			expect(url).toMatch(/^\/eu\/checkout\?/);
		});

		it('does not include contribution for SupporterPlus', () => {
			const url = buildCheckoutUrl(SupportRegionId.EU, {
				product: 'SupporterPlus',
				ratePlan: 'Monthly',
				promoCode: 'TEST',
			});
			expect(url).not.toContain('contribution');
		});

		it('does not include contribution for DigitalSubscription', () => {
			const url = buildCheckoutUrl(SupportRegionId.UK, {
				product: 'DigitalSubscription',
				ratePlan: 'Annual',
			});
			expect(url).not.toContain('contribution');
		});
	});
});
