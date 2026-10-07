import type {
	ProductKey,
	ProductRatePlanKey,
} from '@modules/product-catalog/productCatalog';
import { useMemo } from 'react';
import { useSearchParams } from 'react-router';
import { productCatalog } from 'helpers/productCatalog';

type ThreeTierUrlSelection = {
	productKey?: ProductKey;
	ratePlanKey?: ProductRatePlanKey<ProductKey>;
	selectedAmount: string | null;
	forceWeeklyPricing: boolean;
};

const productKeys = Object.keys(productCatalog) as ProductKey[];

// Query params are matched case-insensitively (e.g. `?product=supporterplus`).
function toProductKey(raw: string | null): ProductKey | undefined {
	if (!raw) {
		return undefined;
	}
	const lowerRaw = raw.toLowerCase();
	return productKeys.find((key) => key.toLowerCase() === lowerRaw);
}

// ratePlanKey values differ per product, so it's only valid alongside the
// product it belongs to. Defaults to Contribution when no product param is
// given, since that's the implicit tier for a bare `?ratePlan=` link.
function toRatePlanKey<P extends ProductKey>(
	productKey: P | undefined,
	raw: string | null,
): ProductRatePlanKey<P> | undefined {
	if (!raw) {
		return undefined;
	}
	const resolvedProductKey = productKey ?? ('Contribution' as P);
	const ratePlanKeys = Object.keys(
		productCatalog[resolvedProductKey]?.ratePlans ?? {},
	) as Array<ProductRatePlanKey<P>>;
	const lowerRaw = raw.trim().toLowerCase();
	return ratePlanKeys.find((key) => key.toLowerCase() === lowerRaw);
}

// Reads the query params that drive tier/product/pricing selection once per render.
export function useThreeTierUrlSelection(): ThreeTierUrlSelection {
	const [params] = useSearchParams();

	return useMemo(() => {
		const productKey = toProductKey(params.get('product'));

		return {
			productKey,
			ratePlanKey: toRatePlanKey(productKey, params.get('ratePlan')),
			selectedAmount: params.get('selected-amount'),
			forceWeeklyPricing: params.get('force-weekly') === 'true',
		};
	}, [params]);
}
