import { useMemo } from 'react';

type ThreeTierUrlSelection = {
	product?: string;
	ratePlan?: string;
	selectedAmount: string | null;
	forceWeeklyPricing: boolean;
};

// Reads the query params that drive tier/product/pricing selection once per render.
export function useThreeTierUrlSelection(): ThreeTierUrlSelection {
	return useMemo(() => {
		const params = new URLSearchParams(window.location.search);

		return {
			product: params.get('product')?.toLowerCase(),
			ratePlan: params.get('ratePlan')?.trim().toLowerCase(),
			selectedAmount: params.get('selected-amount'),
			forceWeeklyPricing: params.get('force-weekly') === 'true',
		};
	}, [window.location.search]);
}
