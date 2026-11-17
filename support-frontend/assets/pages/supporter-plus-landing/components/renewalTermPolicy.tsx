import type {
	ActiveProductKey,
	ActiveRatePlanKey,
} from 'helpers/productCatalog';
import type { Promotion } from 'helpers/productPrice/promotions';
import { getRenewalTermPolicy } from 'helpers/productPrice/renewalTermPolicies';

interface RenewalTermPolicyProps {
	productKey: ActiveProductKey;
	ratePlanKey: ActiveRatePlanKey;
	amount: number;
	promotion?: Promotion;
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
