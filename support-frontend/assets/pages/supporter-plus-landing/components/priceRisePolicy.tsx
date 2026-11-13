import { css } from '@emotion/react';
import { space } from '@guardian/source/foundations';
import type {
	ActiveProductKey,
	ActiveRatePlanKey,
} from 'helpers/productCatalog';

const marginTop = css`
	margin-top: ${space[2]}px;
`;

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
	const display = !isStudentOneYearRatePlan && !isContribution;

	return display ? (
		<p css={marginTop}>
			We may increase the price of your subscription in the future. If this
			happens, we’ll email you at least 30 days before it takes effect.
		</p>
	) : null;
}
