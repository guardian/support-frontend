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
	const policy = getCancellationPolicy(productKey, ratePlanKey, promotion);
	return policy ? <p>{policy}</p> : null;
}
