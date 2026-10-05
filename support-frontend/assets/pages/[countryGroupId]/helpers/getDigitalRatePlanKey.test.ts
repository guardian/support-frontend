import { SupportRegionId } from '@modules/internationalisation/countryGroup';
import type { ProductKey } from '@modules/product-catalog/productCatalog';
import { renderHook, waitFor } from '@testing-library/react';
import type { ContributionType } from 'helpers/contributions';
import { getDigitalRatePlanKey } from './getDigitalRatePlanKey';

type DigitalRatePlanProps = {
	contributionType: ContributionType;
	supportRegionId: SupportRegionId;
	productKey: ProductKey;
};

describe('getDigitalRatePlanKey', () => {
	it('returns the billing period key for non-Canada regions with SupporterPlus product', () => {
		const { result } = renderHook(() =>
			getDigitalRatePlanKey('MONTHLY', SupportRegionId.UK, 'SupporterPlus'),
		);
		expect(result.current).toEqual('Monthly');
	});

	it('appends TaxExclusive for Canada with DigitalPlus product', () => {
		const { result } = renderHook(() =>
			getDigitalRatePlanKey(
				'ANNUAL',
				SupportRegionId.CA,
				'DigitalSubscription',
			),
		);
		expect(result.current).toEqual('AnnualTaxExclusive');
	});

	it('returns the billing period key for Canada with Contribution product', () => {
		const { result } = renderHook(() =>
			getDigitalRatePlanKey('ANNUAL', SupportRegionId.CA, 'Contribution'),
		);
		expect(result.current).toEqual('Annual');
	});

	it('updates the key when contribution type changes', async () => {
		const { result, rerender } = renderHook(
			({
				contributionType,
				supportRegionId,
				productKey,
			}: DigitalRatePlanProps) =>
				getDigitalRatePlanKey(contributionType, supportRegionId, productKey),
			{
				initialProps: {
					contributionType: 'MONTHLY',
					supportRegionId: SupportRegionId.CA,
					productKey: 'SupporterPlus',
				},
			},
		);

		expect(result.current).toEqual('MonthlyTaxExclusive');

		rerender({
			contributionType: 'ANNUAL',
			supportRegionId: SupportRegionId.CA,
			productKey: 'SupporterPlus',
		});

		await waitFor(() => {
			expect(result.current).toEqual('AnnualTaxExclusive');
		});
	});
});
