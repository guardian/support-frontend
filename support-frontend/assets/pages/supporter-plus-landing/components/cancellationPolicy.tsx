import { css } from '@emotion/react';
import { space } from '@guardian/source/foundations';
import type {
	ActiveProductKey,
	ActiveRatePlanKey,
} from 'helpers/productCatalog';
import { getCancellationCopy } from 'helpers/productPrice/cancellationPolicyCopy';
import type { Promotion } from 'helpers/productPrice/promotions';
import { isGuardianWeeklyGiftProduct } from 'pages/supporter-plus-thank-you/components/thankYouHeader/utils/productMatchers';

const marginTop = css`
	margin-top: ${space[2]}px;
`;

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
	return display ? (
		<p css={marginTop}>
			{getCancellationCopy(productKey, ratePlanKey, promotion)}
		</p>
	) : null;
}
