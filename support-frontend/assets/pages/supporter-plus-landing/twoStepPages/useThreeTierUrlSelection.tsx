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
		const rawProduct = params.get('product');

		return {
			product: rawProduct ? rawProduct.toLowerCase() : undefined,
			ratePlan: params.get('ratePlan')?.trim().toLowerCase(),
			selectedAmount: params.get('selected-amount'),
			forceWeeklyPricing: params.get('force-weekly') === 'true',
		};
	}, []);
}
