import { SupportRegionId } from '@modules/internationalisation/countryGroup';
import {
	getTodaysPaymentWithTaxExclusion,
	withCanadaDigitalPlusTaxCopy,
} from './summaryHelpers';

describe('getTodaysPaymentWithTaxExclusion', () => {
	it('returns undefined when taxConfig is undefined', () => {
		expect(
			getTodaysPaymentWithTaxExclusion(
				{ originalAmount: 100, finalAmount: 100 },
				'CAD',
				undefined,
			),
		).toBeUndefined();
	});

	it('returns undefined when type is not tax_exclusive', () => {
		expect(
			getTodaysPaymentWithTaxExclusion(
				{ originalAmount: 100, finalAmount: 100 },
				'CAD',
				{
					type: 'tax_inclusive',
				},
			),
		).toBeUndefined();
	});

	it('formats integer amounts correctly', () => {
		expect(
			getTodaysPaymentWithTaxExclusion(
				{ originalAmount: 100, finalAmount: 100 },
				'CAD',
				{
					type: 'tax_exclusive',
					rate: 0.13,
				},
			),
		).toBe('$100 + $13 estimated tax');
	});

	it('formats decimal tax amounts correctly', () => {
		expect(
			getTodaysPaymentWithTaxExclusion(
				{ originalAmount: 10, finalAmount: 10 },
				'CAD',
				{
					type: 'tax_exclusive',
					rate: 0.05,
				},
			),
		).toBe('$10 + $0.50 estimated tax');
	});

	it('handles discounts correctly', () => {
		expect(
			getTodaysPaymentWithTaxExclusion(
				{ originalAmount: 15, finalAmount: 12 },
				'CAD',
				{
					type: 'tax_exclusive',
					rate: 0.14975,
				},
			),
		).toBe('$12 + $1.80 estimated tax');
	});
});

describe('withCanadaDigitalPlusTaxCopy', () => {
	it('appends the tax notice for Canada Digital plus', () => {
		expect(
			withCanadaDigitalPlusTaxCopy(
				'$30/month',
				'DigitalSubscription',
				SupportRegionId.CA,
			),
		).toBe('$30/month. Taxes may apply.');
	});

	it('appends the tax notice to a promo price for Canada Digital plus', () => {
		expect(
			withCanadaDigitalPlusTaxCopy(
				'$12/month for 3 months, then $30/month thereafter',
				'DigitalSubscription',
				SupportRegionId.CA,
			),
		).toBe(
			'$12/month for 3 months, then $30/month thereafter. Taxes may apply.',
		);
	});

	it('leaves All-access digital prices unchanged in Canada', () => {
		expect(
			withCanadaDigitalPlusTaxCopy(
				'$10/month',
				'SupporterPlus',
				SupportRegionId.CA,
			),
		).toBe('$10/month');
	});

	it('leaves Digital plus prices unchanged outside Canada', () => {
		expect(
			withCanadaDigitalPlusTaxCopy(
				'£12/month',
				'DigitalSubscription',
				SupportRegionId.UK,
			),
		).toBe('£12/month');
	});

	it('leaves the price unchanged when the product is missing', () => {
		expect(
			withCanadaDigitalPlusTaxCopy('$30/month', undefined, SupportRegionId.CA),
		).toBe('$30/month');
	});
});
