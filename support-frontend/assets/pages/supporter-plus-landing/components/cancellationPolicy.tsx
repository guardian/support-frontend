import type { PromoWithCatalogInformation } from '@modules/promotions/v2/schema';
import type {
	ActiveProductKey,
	ActiveRatePlanKey,
} from 'helpers/productCatalog';
import { getCancellationPolicy } from 'helpers/productPrice/cancellationPolicies';

interface CancellationPolicyProps {
	productKey: ActiveProductKey;
	ratePlanKey: ActiveRatePlanKey;
	amount: number;
	contribution?: number;
	promotion?: PromoWithCatalogInformation;
}
export function CancellationPolicy({
	productKey,
	ratePlanKey,
	amount,
	promotion,
	contribution,
}: CancellationPolicyProps): JSX.Element | null {
	return (
		getCancellationPolicy(
			productKey,
			ratePlanKey,
			amount,
			promotion,
			contribution,
		)[productKey]?.[ratePlanKey] ?? null
	);
}
