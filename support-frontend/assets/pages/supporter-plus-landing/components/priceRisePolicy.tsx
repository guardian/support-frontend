import type {
	ActiveProductKey,
	ActiveRatePlanKey,
} from 'helpers/productCatalog';

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

	return !isStudentOneYearRatePlan && !isContribution ? (
		<p>
			We may increase the price of your subscription in the future. If this
			happens, we’ll email you at least 30 days before it takes effect.
		</p>
	) : null;
}
