import { SupportRegionId } from '@modules/internationalisation/countryGroup';
import { renderHook, waitFor } from '@testing-library/react';
import type { ContributionType } from 'helpers/contributions';
import { useRatePlanKey } from './useRatePlanKey';

jest.mock('contexts/FeatureSwitchesContext', () => ({
	useFeatureSwitches: jest.fn(),
}));

type HookProbeProps = {
	contributionType: ContributionType;
	supportRegionId: SupportRegionId;
};

describe('useRatePlanKey', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('returns the billing period key for non-Canada regions', () => {
		const { result } = renderHook(() =>
			useRatePlanKey('MONTHLY', SupportRegionId.UK),
		);

		expect(result.current).toEqual({
			ratePlanKey: 'Monthly',
			taxExclusionEnabled: false,
		});
	});

	it('appends TaxExclusive for Canada when the switch is enabled', () => {
		const { result } = renderHook(() =>
			useRatePlanKey('ANNUAL', SupportRegionId.CA),
		);

		expect(result.current).toEqual({
			ratePlanKey: 'AnnualTaxExclusive',
			taxExclusionEnabled: true,
		});
	});

	it('updates the key when contribution type changes', async () => {
		const { result, rerender } = renderHook(
			({ contributionType, supportRegionId }: HookProbeProps) =>
				useRatePlanKey(contributionType, supportRegionId),
			{
				initialProps: {
					contributionType: 'MONTHLY',
					supportRegionId: SupportRegionId.CA,
				},
			},
		);

		expect(result.current).toEqual({
			ratePlanKey: 'MonthlyTaxExclusive',
			taxExclusionEnabled: true,
		});

		rerender({
			contributionType: 'ANNUAL',
			supportRegionId: SupportRegionId.CA,
		});

		await waitFor(() => {
			expect(result.current).toEqual({
				ratePlanKey: 'AnnualTaxExclusive',
				taxExclusionEnabled: true,
			});
		});
	});
});
