import { SupportRegionId } from '@modules/internationalisation/countryGroup';
import { renderHook, waitFor } from '@testing-library/react';
import { useFeatureSwitches } from 'contexts/FeatureSwitchesContext';
import type { ContributionType } from 'helpers/contributions';
import { useMaybeTaxExclusiveRatePlanKey } from './useRatePlanKey';

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
		const { result } = renderHook(() =>
			useMaybeTaxExclusiveRatePlanKey('MONTHLY', SupportRegionId.UK),
		);

		expect(result.current).toEqual({
			maybeTaxExclusiveRatePlanKey: 'Monthly',
			taxExclusionEnabled: false,
		});
	});

	it('appends TaxExclusive for Canada when the switch is enabled', () => {
		setCanadaTaxExclusionFlag(true);

		const { result } = renderHook(() =>
			useMaybeTaxExclusiveRatePlanKey('ANNUAL', SupportRegionId.CA),
		);

		expect(result.current).toEqual({
			maybeTaxExclusiveRatePlanKey: 'AnnualTaxExclusive',
			taxExclusionEnabled: true,
		});
	});

	it('does not append TaxExclusive for Canada when the switch is disabled', () => {
		const { result } = renderHook(() =>
			useMaybeTaxExclusiveRatePlanKey('ANNUAL', SupportRegionId.CA),
		);

		expect(result.current).toEqual({
			maybeTaxExclusiveRatePlanKey: 'Annual',
			taxExclusionEnabled: false,
		});
	});

	it('updates the key when contribution type changes', async () => {
		setCanadaTaxExclusionFlag(true);

		const { result, rerender } = renderHook(
			({ contributionType, supportRegionId }: HookProbeProps) =>
				useMaybeTaxExclusiveRatePlanKey(contributionType, supportRegionId),
			{
				initialProps: {
					contributionType: 'MONTHLY',
					supportRegionId: SupportRegionId.CA,
				},
			},
		);

		expect(result.current).toEqual({
			maybeTaxExclusiveRatePlanKey: 'MonthlyTaxExclusive',
			taxExclusionEnabled: true,
		});

		rerender({
			contributionType: 'ANNUAL',
			supportRegionId: SupportRegionId.CA,
		});

		await waitFor(() => {
			expect(result.current).toEqual({
				maybeTaxExclusiveRatePlanKey: 'AnnualTaxExclusive',
				taxExclusionEnabled: true,
			});
		});
	});
});
