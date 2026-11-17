import { css } from '@emotion/react';
import { space } from '@guardian/source/foundations';
import type {
	ActiveProductKey,
	ActiveRatePlanKey,
} from 'helpers/productCatalog';
import type { Promotion } from 'helpers/productPrice/promotions';
import { getRenewalTermPolicy } from 'helpers/productPrice/renewalTermPolicies';

const marginTop = css`
	margin-top: ${space[2]}px;
`;

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
	const isOneTimeContribution =
		productKey === 'Contribution' && ratePlanKey === 'OneTime';
	const isWeeklyGift =
		ratePlanKey === 'ThreeMonthGift' || ratePlanKey === 'OneYearGift';
	const isStudentOneYearRatePlan = ratePlanKey === 'OneYearStudent'; // TODO: UTS Students

	const display =
		!isOneTimeContribution && !isWeeklyGift && !isStudentOneYearRatePlan;

	return display ? (
		<p css={marginTop}>
			{getRenewalTermPolicy(productKey, ratePlanKey, amount, promotion)}
		</p>
	) : null;
}
