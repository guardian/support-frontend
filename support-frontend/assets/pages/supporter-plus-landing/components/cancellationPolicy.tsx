import type {
	ActiveProductKey,
	ActiveRatePlanKey,
} from 'helpers/productCatalog';
import { getCancellationPolicy } from 'helpers/productPrice/cancellationPolicies';
import type { Promotion } from 'helpers/productPrice/promotions';

interface CancellationPolicyProps {
	productKey: ActiveProductKey;
	ratePlanKey: ActiveRatePlanKey;
	promotion?: Promotion;
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
