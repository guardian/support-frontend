import { SupportRegionId } from '@modules/internationalisation/countryGroup';
import { getDigitalRatePlanKey } from './getDigitalRatePlanKey';

describe('getDigitalRatePlanKey', () => {
	it('returns the billing period key for non-Canada regions with SupporterPlus product', () => {
		const result = getDigitalRatePlanKey(
			'MONTHLY',
			SupportRegionId.UK,
			'SupporterPlus',
		);

		expect(result).toEqual('Monthly');
	});

	it('appends TaxExclusive for Canada with DigitalPlus product', () => {
		const result = getDigitalRatePlanKey(
			'ANNUAL',
			SupportRegionId.CA,
			'DigitalSubscription',
		);
		expect(result).toEqual('AnnualTaxExclusive');
	});

	it('returns the billing period key for Canada with Contribution product', () => {
		const result = getDigitalRatePlanKey(
			'ANNUAL',
			SupportRegionId.CA,
			'Contribution',
		);
		expect(result).toEqual('Annual');
	});
});
