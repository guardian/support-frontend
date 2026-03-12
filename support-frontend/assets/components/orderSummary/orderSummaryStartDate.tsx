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
	const digitalBenefitsCopy = `Your digital benefits will start today.`;
	const postalCopy = `Please allow 1 to 7 days after your start date for your magazine to arrive, depending on national post services.`;
	const weeklyTierThreeCopy = `Your Guardian Weekly subscription will start on ${startDate}. ${postalCopy}`;
	const weeklyDigitalCopy = `Your first issue of Guardian Weekly will be ${startDate}. ${postalCopy} ${digitalBenefitsCopy}`;
	if (
		isGuardianWeeklyOrTierThreeProduct(productKey) &&
		!isGuardianWeeklyGiftProduct(productKey, ratePlanKey)
	) {
		return (
			<ul css={listStartDate}>
				<li>{enableWeeklyDigital ? weeklyDigitalCopy : weeklyTierThreeCopy}</li>
			</ul>
		);
	}
	return null;
}
