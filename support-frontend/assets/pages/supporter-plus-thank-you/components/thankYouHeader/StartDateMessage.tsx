import type { ActiveProductKey } from 'helpers/productCatalog';
import { messageBold, messageMargin } from './MessageStyles';
import { isGuardianWeeklyProduct } from './utils/productMatchers';

export default function StartDateMessage({
	productKey,
	isWeeklyGift,
	startDate,
}: {
	productKey: ActiveProductKey;
	isWeeklyGift: boolean;
	startDate?: string;
}) {
	if (!startDate) {
		return null;
	}

	const weeklyMessage = isWeeklyGift
		? `The gift recipient's first issue will be published on`
		: 'Your first issue will be published on';
	const deliveryMessage = isGuardianWeeklyProduct(productKey)
		? weeklyMessage
		: 'You will receive your newspapers from';

	return (
		<p css={messageMargin}>
			{deliveryMessage} <strong css={messageBold}>{startDate}</strong>.
		</p>
	);
}
