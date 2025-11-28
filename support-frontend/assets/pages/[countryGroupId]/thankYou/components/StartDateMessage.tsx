import type {
	ActiveProductKey,
	ActiveRatePlanKey,
} from 'helpers/productCatalog';
import {
	isGuardianWeeklyGiftProduct,
	isGuardianWeeklyProduct,
} from '../../../../helpers/productMatchers';
import { messageBold, messageMargin } from './MessageStyles';

export default function StartDateMessage({
	productKey,
	ratePlanKey,
	startDate,
}: {
	productKey: ActiveProductKey;
	ratePlanKey: ActiveRatePlanKey;
	startDate?: string;
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
