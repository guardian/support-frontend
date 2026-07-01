import { SupportRegionId } from '@modules/internationalisation/countryGroup';
import { productCatalogFixture } from 'fixtures/productCatalogFixture';
import { taxRatesFixture } from 'fixtures/taxRatesFixture';
import { getEstimatedSalesTaxRate } from './getEstimatedSalesTaxRate';

describe('getEstimatedSalesTaxRate', () => {
	describe('when not in the CA region', () => {
		it('returns a tax_inclusive result', () => {
			const result = getEstimatedSalesTaxRate(
				productCatalogFixture,
				taxRatesFixture,
				'SupporterPlus',
				'Monthly',
				undefined,
				SupportRegionId.UK,
			);

			expect(result).toEqual({ type: 'tax_inclusive' });
		});
	});

	describe('when not a possibly tax exclusive product', () => {
		it('returns a tax_inclusive result', () => {
			const result = getEstimatedSalesTaxRate(
				productCatalogFixture,
				taxRatesFixture,
				'SupporterPlus',
				'Monthly', // This rate plan is tax inclusive
				undefined,
				SupportRegionId.CA,
			);

			expect(result).toEqual({ type: 'tax_inclusive' });
		});
	});

	describe('when the province is missing', () => {
		it('returns a not_enough_information result', () => {
			const result = getEstimatedSalesTaxRate(
				productCatalogFixture,
				taxRatesFixture,
				'SupporterPlus',
				'MonthlyTaxExclusive',
				undefined,
				SupportRegionId.CA,
			);

			expect(result).toEqual({ type: 'not_enough_information' });
		});
	});

	describe('when all data is provided and tax is exclusive', () => {
		it('returns a tax_exlcusive result with a rate', () => {
			const result = getEstimatedSalesTaxRate(
				productCatalogFixture,
				taxRatesFixture,
				'SupporterPlus',
				'MonthlyTaxExclusive',
				'AB',
				SupportRegionId.CA,
			);

			expect(result).toEqual({ type: 'tax_exclusive', rate: 0.05 });
		});
	});

	describe('when tax rate data is missing product information', () => {
		it('throws an error', () => {
			expect(() =>
				getEstimatedSalesTaxRate(
					productCatalogFixture,
					{},
					'SupporterPlus',
					'MonthlyTaxExclusive',
					'AB',
					SupportRegionId.CA,
				),
			).toThrow('Missing tax rate data for product');
		});
	});

	describe('when tax rate data is undefined', () => {
		it('throws an error', () => {
			expect(() =>
				getEstimatedSalesTaxRate(
					productCatalogFixture,
					undefined,
					'SupporterPlus',
					'MonthlyTaxExclusive',
					'AB',
					SupportRegionId.CA,
				),
			).toThrow('Missing tax rate data');
		});
	});
});
