import type { SupportRegionId } from '@modules/internationalisation/supportRegion';
import { renderHook, waitFor } from '@testing-library/react';
import { useFeatureSwitches } from 'contexts/FeatureSwitchesContext';
import type { ContributionType } from 'helpers/contributions';
import { useRatePlanKey } from './useRatePlanKey';

jest.mock('contexts/FeatureSwitchesContext', () => ({
	useFeatureSwitches: jest.fn(),
}));

const mockedUseFeatureSwitches = useFeatureSwitches as jest.MockedFunction<
	typeof useFeatureSwitches
>;

type HookProbeProps = {
	contributionType: ContributionType;
	supportRegionId: SupportRegionId;
};

const setCanadaTaxExclusionFlag = (enableCanadaTaxExclusion: boolean) => {
	mockedUseFeatureSwitches.mockReturnValue({
		enableCanadaTaxExclusion,
	} as ReturnType<typeof useFeatureSwitches>);
};

describe('useRatePlanKey', () => {
	beforeEach(() => {
		jest.clearAllMocks();
		setCanadaTaxExclusionFlag(false);
	});

	it('returns the billing period key for non-Canada regions', () => {
		const { result } = renderHook(() => useRatePlanKey('MONTHLY', 'uk'));

		expect(result.current).toEqual({
			ratePlanKey: 'Monthly',
			taxExclusionEnabled: false,
		});
	});

	it('appends TaxExclusive for Canada when the switch is enabled', () => {
		setCanadaTaxExclusionFlag(true);

		const { result } = renderHook(() => useRatePlanKey('ANNUAL', 'ca'));

		expect(result.current).toEqual({
			ratePlanKey: 'AnnualTaxExclusive',
			taxExclusionEnabled: true,
		});
	});

	it('does not append TaxExclusive for Canada when the switch is disabled', () => {
		const { result } = renderHook(() => useRatePlanKey('ANNUAL', 'ca'));

		expect(result.current).toEqual({
			ratePlanKey: 'Annual',
			taxExclusionEnabled: false,
		});
	});

	it('updates the key when contribution type changes', async () => {
		setCanadaTaxExclusionFlag(true);

		const { result, rerender } = renderHook(
			({ contributionType, supportRegionId }: HookProbeProps) =>
				useRatePlanKey(contributionType, supportRegionId),
			{
				initialProps: {
					contributionType: 'MONTHLY',
					supportRegionId: 'ca',
				},
			},
		);

		expect(result.current).toEqual({
			ratePlanKey: 'MonthlyTaxExclusive',
			taxExclusionEnabled: true,
		});

		rerender({
			contributionType: 'ANNUAL',
			supportRegionId: 'ca',
		});

		await waitFor(() => {
			expect(result.current).toEqual({
				ratePlanKey: 'AnnualTaxExclusive',
				taxExclusionEnabled: true,
			});
		});
	});
});
