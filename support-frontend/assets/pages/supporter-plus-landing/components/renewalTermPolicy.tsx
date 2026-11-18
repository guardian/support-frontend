import type { PromoWithCatalogInformation } from '@modules/promotions/v2/schema';
import type {
	ActiveProductKey,
	ActiveRatePlanKey,
} from 'helpers/productCatalog';
import { getRenewalTermPolicy } from 'helpers/productPrice/renewalTermPolicies';

interface RenewalTermPolicyProps {
	productKey: ActiveProductKey;
	ratePlanKey: ActiveRatePlanKey;
	amount: number;
	promotion?: PromoWithCatalogInformation;
}
export function RenewalTermPolicy({
	productKey,
	ratePlanKey,
	amount,
	promotion,
}: RenewalTermPolicyProps): JSX.Element | null {
	const policy = getRenewalTermPolicy(
		productKey,
		ratePlanKey,
		amount,
		promotion,
	);
	return policy ? <p>{policy}</p> : null;
}
