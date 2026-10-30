import { SupportRegionId } from '@modules/internationalisation/countryGroup';
import { getDigitalRatePlanKey } from './getDigitalRatePlanKey';

describe('getDigitalRatePlanKey', () => {
	it('returns the billing period key for non-Canada regions with SupporterPlus product', () => {
		const result = getDigitalRatePlanKey(
			SupportRegionId.UK,
			'SupporterPlus',
			'MONTHLY',
		);

		expect(result).toEqual('Monthly');
	});

	it('appends TaxExclusive for Canada with DigitalPlus product', () => {
		const result = getDigitalRatePlanKey(
			SupportRegionId.CA,
			'DigitalSubscription',
			'ANNUAL',
		);
		expect(result).toEqual('AnnualTaxExclusive');
	});

	it('returns the billing period key for Canada with Contribution product', () => {
		const result = getDigitalRatePlanKey(
			SupportRegionId.CA,
			'Contribution',
			'ANNUAL',
		);
		expect(result).toEqual('Annual');
	});
});
