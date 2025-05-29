import { css } from '@emotion/react';
import { space } from '@guardian/source/foundations';
import type { ActiveProductKey } from 'helpers/productCatalog';
import { isGuardianWeeklyProduct } from './utils/productMatchers';

const startDateStyle = css`
	margin-bottom: ${space[2]}px;
`;

export default function StartDateMessage({
	productKey,
	startDate,
}: {
	startDate?: string;
	productKey: ActiveProductKey;
}) {
	if (!startDate) {
		return null;
	}

	const deliveryMessage = isGuardianWeeklyProduct(productKey)
		? 'Your first issue will be published on'
		: 'You will receive your newspapers from';

	return (
		<p css={startDateStyle}>
			{deliveryMessage} {startDate}.
		</p>
	);
}
