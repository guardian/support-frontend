import type {
	ActiveProductKey,
	ActiveRatePlanKey,
} from 'helpers/productCatalog';
import { getCancellationPolicy } from 'helpers/productPrice/cancellationPolicies';
import type { Promotion } from 'helpers/productPrice/promotions';
import { isGuardianWeeklyGiftProduct } from 'pages/supporter-plus-thank-you/components/thankYouHeader/utils/productMatchers';

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
	const isContribution = productKey === 'Contribution';
	const isWeeklyGift = isGuardianWeeklyGiftProduct(productKey, ratePlanKey);
	const display = !isContribution && !isWeeklyGift;
	return display
		? getCancellationPolicy(productKey, ratePlanKey, promotion)[productKey]?.[
				ratePlanKey
		  ] ?? null
		: null;
}
