import type {
	ActiveProductKey,
	ActiveRatePlanKey,
} from 'helpers/productCatalog';
import { messageBold, messageMargin } from './MessageStyles';
import {
	isGuardianWeeklyGiftProduct,
	isGuardianWeeklyProduct,
} from './utils/productMatchers';

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

	const weeklyMessage = isGuardianWeeklyGiftProduct(productKey, ratePlanKey)
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
