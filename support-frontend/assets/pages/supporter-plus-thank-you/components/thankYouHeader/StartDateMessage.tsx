import { css } from '@emotion/react';
import { space } from '@guardian/source/foundations';
import type {
	ActiveProductKey,
	ActiveRatePlanKey,
} from 'helpers/productCatalog';
import { isGuardianWeeklyProduct } from './utils/productMatchers';

const startDateStyle = css`
	margin-bottom: ${space[2]}px;
	strong {
		font-weight: bold;
	}
`;

export default function StartDateMessage({
	productKey,
	ratePlanKey,
	startDate,
}: {
	startDate?: string;
	ratePlanKey: ActiveRatePlanKey;
	productKey: ActiveProductKey;
}) {
	if (!startDate) {
		return null;
	}

	const weeklyMessage = ['OneYearGift', 'ThreeMonthGift'].includes(ratePlanKey)
		? `The gift recipient's first issue will be published on`
		: 'Your first issue will be published on';
	const deliveryMessage = isGuardianWeeklyProduct(productKey)
		? weeklyMessage
		: 'You will receive your newspapers from';

	return (
		<p css={startDateStyle}>
			{deliveryMessage} <strong>{startDate}</strong>.
		</p>
	);
}
