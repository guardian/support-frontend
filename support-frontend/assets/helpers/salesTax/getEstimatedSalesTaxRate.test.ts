import { SupportRegionId } from '@modules/internationalisation/countryGroup';
import { getEstimatedSalesTaxRate } from './getEstimatedSalesTaxRate';

describe('getEstimatedSalesTaxRate', () => {
	describe('when not in the CA region', () => {
		it('returns a not_applicable result', () => {
			const result = getEstimatedSalesTaxRate(
				'SupporterPlus',
				'Monthly',
				null,
				undefined,
				SupportRegionId.UK,
			);

			expect(result).toEqual({ type: 'not_applicable' });
		});
	});
});
