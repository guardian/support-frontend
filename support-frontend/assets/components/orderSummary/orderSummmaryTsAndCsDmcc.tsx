import { css } from '@emotion/react';
import { space } from '@guardian/source/foundations';
import {
	type ActiveProductKey,
	type ActiveRatePlanKey,
} from 'helpers/productCatalog';
import type { ActivePaperProductOptions } from 'helpers/productCatalogToProductOption';
import { formatUserDate } from 'helpers/utilities/dateConversions';
import { getProductFirstDeliveryDate } from 'pages/[countryGroupId]/checkout/helpers/deliveryDays';
import {
	isGuardianWeeklyGiftProduct,
	isPrintProduct,
} from 'pages/supporter-plus-thank-you/components/thankYouHeader/utils/productMatchers';

const rowSpacing = css`
	margin-top: ${space[1]}px;
`;

const weekly = (startDate: Date): string => {
	return `Your first issue of Guardian Weekly will be ${formatUserDate(
		startDate,
	)}. Please allow 1 to 7 days after your start date for your magazine to arrive, depending on national post services.`;
};
const weeklyGift = (startDate: Date): string => {
	return `Your Guardian Weekly gift subscription will start on ${formatUserDate(
		startDate,
	)}. The recipient should receive their first magazine 1 - 7 days after this issue date, depending on national post services.`;
};
const paperDeliveryMonthly = (productName: string, startDate: Date): string => {
	return `You will receive your first newspaper delivery on ${formatUserDate(
		startDate,
	)} as part of your ${productName} subscription.`;
};
const paperSubscriptionMonthly = (
	productName: string,
	startDate: Date,
): string =>
	`Your physical subscription card will be delivered to your door by ${formatUserDate(
		startDate,
	)}, for you to collect in store the first newspaper edition you are entitled to in your ${productName} subscription.`;

type SummaryTsAndCs = Partial<
	Record<ActiveProductKey, Partial<Record<ActiveRatePlanKey, string>>>
>;

function getSummaryTsAndCs(
	ratePlanKey: ActiveRatePlanKey,
	startDate: Date,
	ratePlanDescription?: string,
): SummaryTsAndCs {
	const ratePlanName = ratePlanDescription ?? ratePlanKey;
	return {
		GuardianWeeklyDomestic: {
			MonthlyPlus: weekly(startDate),
			QuarterlyPlus: weekly(startDate),
			AnnualPlus: weekly(startDate),
			OneYearGift: weeklyGift(startDate),
			ThreeMonthGift: weeklyGift(startDate),
		},
		SubscriptionCard: {
			EverydayPlus: paperSubscriptionMonthly(ratePlanName, startDate),
			SixdayPlus: paperSubscriptionMonthly(ratePlanName, startDate),
			WeekendPlus: paperSubscriptionMonthly(ratePlanName, startDate),
			SaturdayPlus: paperSubscriptionMonthly(ratePlanName, startDate),
			Sunday: paperSubscriptionMonthly(ratePlanName, startDate),
		},
		HomeDelivery: {
			EverydayPlus: paperDeliveryMonthly(ratePlanName, startDate),
			SixdayPlus: paperDeliveryMonthly(ratePlanName, startDate),
			WeekendPlus: paperDeliveryMonthly(ratePlanName, startDate),
			SaturdayPlus: paperDeliveryMonthly(ratePlanName, startDate),
			Sunday: paperDeliveryMonthly(ratePlanName, startDate),
		},
	};
}

interface OrderSummaryTsAndCsDmccaProps {
	productKey: ActiveProductKey;
	ratePlanKey: ActiveRatePlanKey;
	ratePlanDescription?: string;
	weeklyGiftDeliveryDate?: Date;
}
export function OrderSummaryTsAndCsDmcca({
	productKey,
	ratePlanKey,
	ratePlanDescription,
	weeklyGiftDeliveryDate,
}: OrderSummaryTsAndCsDmccaProps): JSX.Element | null {
	const deliveryStart = isGuardianWeeklyGiftProduct(productKey, ratePlanKey)
		? weeklyGiftDeliveryDate
		: getProductFirstDeliveryDate(
				productKey,
				ratePlanKey as ActivePaperProductOptions,
		  );
	const summaryTsAndCs = deliveryStart
		? getSummaryTsAndCs(ratePlanKey, deliveryStart, ratePlanDescription)[
				productKey
		  ]?.[ratePlanKey]
		: undefined;
	const digitalBenefits =
		isPrintProduct(productKey) &&
		!isGuardianWeeklyGiftProduct(productKey, ratePlanKey) ? (
			<p css={rowSpacing}>Your digital benefits will start today.</p>
		) : null;
	return summaryTsAndCs ? (
		<>
			<p>{summaryTsAndCs}</p>
			{digitalBenefits}
		</>
	) : null;
}
