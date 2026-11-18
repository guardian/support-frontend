import type { PromoWithCatalogInformation } from '@modules/promotions/v2/schema';
import type {
	ActiveProductKey,
	ActiveRatePlanKey,
} from 'helpers/productCatalog';
import { getCancellationPolicy } from 'helpers/productPrice/cancellationPolicies';

interface CancellationPolicyProps {
	productKey: ActiveProductKey;
	ratePlanKey: ActiveRatePlanKey;
	promotion?: PromoWithCatalogInformation;
}
export function CancellationPolicy({
	productKey,
	ratePlanKey,
	promotion,
}: CancellationPolicyProps): JSX.Element | null {
	return (
		getCancellationPolicy(productKey, ratePlanKey, promotion)[productKey]?.[
			ratePlanKey
		] ?? null
	);
}
