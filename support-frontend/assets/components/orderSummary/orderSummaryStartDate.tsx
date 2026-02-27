import { css } from '@emotion/react';
import { space } from '@guardian/source/foundations';
import {
	type ActiveProductKey,
	type ActiveRatePlanKey,
} from 'helpers/productCatalog';
import {
	isGuardianWeeklyGiftProduct,
	isGuardianWeeklyOrTierThreeProduct,
} from 'pages/supporter-plus-thank-you/components/thankYouHeader/utils/productMatchers';

const listStartDate = css`
	li + li {
		margin-top: ${space[2]}px;
	}
`;

interface OrderSummaryStartDateProps {
	productKey: ActiveProductKey;
	ratePlanKey: ActiveRatePlanKey;
	startDate: string;
	enableWeeklyDigital?: boolean;
}
export function OrderSummaryStartDate({
	productKey,
	ratePlanKey,
	startDate,
	enableWeeklyDigital,
}: OrderSummaryStartDateProps): JSX.Element | null {
	const weeklyTierThreeStartCopy = `Your Guardian Weekly subscription will start on ${startDate}. Please allow 1 to 7 days after your start date for your magazine to arrive, depending on national post services.`;
	const weeklyDigitalStartCopy = `Your first issue of Guardian Weekly will be ${startDate}. Please allow 1 to 7 days after this date for your magazine to arrive, depending on national post services. Your digital benefits will start today.`;
	const weeklyStartCopy = enableWeeklyDigital
		? weeklyDigitalStartCopy
		: weeklyTierThreeStartCopy;
	if (
		isGuardianWeeklyOrTierThreeProduct(productKey) &&
		!isGuardianWeeklyGiftProduct(productKey, ratePlanKey)
	) {
		return (
			<ul css={listStartDate}>
				{productKey === 'TierThree' && (
					<li>Your digital benefits will start today.</li>
				)}
				<li>{weeklyStartCopy}</li>
			</ul>
		);
	}
	return null;
}
