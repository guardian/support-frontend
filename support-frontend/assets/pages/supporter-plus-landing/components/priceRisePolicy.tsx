import type {
	ActiveProductKey,
	ActiveRatePlanKey,
} from 'helpers/productCatalog';
import { isGuardianWeeklyGiftProduct } from 'pages/supporter-plus-thank-you/components/thankYouHeader/utils/productMatchers';

interface PriceRisePolicyProps {
	productKey: ActiveProductKey;
	ratePlanKey: ActiveRatePlanKey;
}
export function PriceRisePolicy({
	productKey,
	ratePlanKey,
}: PriceRisePolicyProps): JSX.Element | null {
	const isContribution = productKey === 'Contribution';
	const isStudentOneYearRatePlan = ratePlanKey === 'OneYearStudent'; // TODO: UTS Students
	const isWeeklyGift = isGuardianWeeklyGiftProduct(productKey, ratePlanKey);

	if (isStudentOneYearRatePlan || isContribution || isWeeklyGift) {
		return null;
	}
	return (
		<p>
			We may increase the price of your subscription in the future. If this
			happens, we'll email you at least 30 days before it takes effect.
		</p>
	);
}
