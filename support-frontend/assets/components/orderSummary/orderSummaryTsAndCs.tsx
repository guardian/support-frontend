import { css } from '@emotion/react';
import {
	from,
	neutral,
	palette,
	space,
	textSans14,
} from '@guardian/source/foundations';
import type { CountryGroupId } from '@modules/internationalisation/countryGroup';
import { productLegal } from 'helpers/legalCopy';
import type {
	ActiveProductKey,
	ActiveRatePlanKey,
} from 'helpers/productCatalog';
import type { ActivePaperProductOptions } from 'helpers/productCatalogToProductOption';
import {
	getBillingPeriodNoun,
	ratePlanToBillingPeriod,
} from 'helpers/productPrice/billingPeriods';
import type { Promotion } from 'helpers/productPrice/promotions';
import { formatUserDate } from 'helpers/utilities/dateConversions';
import {
	isPaperPlusSub,
	isSundayOnlyNewspaperSub,
} from 'pages/[countryGroupId]/helpers/isSundayOnlyNewspaperSub';
import { isGuardianWeeklyGiftProduct } from 'pages/supporter-plus-thank-you/components/thankYouHeader/utils/productMatchers';
import { productDeliveryOrStartDate } from 'pages/weekly-subscription-checkout/helpers/deliveryDays';

const containerSummaryTsCs = css`
	border-radius: ${space[2]}px;
	background-color: ${neutral[97]};
	padding: ${space[3]}px;
`;
const productStartDate = css`
	display: block;
	${textSans14};
	color: #606060;
	background-color: ${palette.neutral[97]};
	border-radius: ${space[3]}px;
	padding: ${space[3]}px;
	margin-top: ${space[2]}px;
	${from.desktop} {
		margin-top: ${space[4]}px;
	}
	li + li {
		margin-top: ${space[2]}px;
	}
`;

const guardianWeeklyOrTierThreeProduct = (productKey: ActiveProductKey) => {
	return [
		'GuardianWeeklyDomestic',
		'GuardianWeeklyRestOfWorld',
		'TierThree',
	].includes(productKey);
};

interface OrderSummaryStartDateProps {
	startDate: string;
	productKey: ActiveProductKey;
}
export function OrderSummaryStartDate({
	startDate,
	productKey,
}: OrderSummaryStartDateProps): JSX.Element | null {
	if (guardianWeeklyOrTierThreeProduct(productKey)) {
		return (
			<ul css={productStartDate}>
				{productKey === 'TierThree' && (
					<li>Your digital benefits will start today.</li>
				)}
				<li>
					Your Guardian Weekly subscription will start on {startDate}. Please
					allow 1 to 7 days after your start date for your magazine to arrive,
					depending on national post services.
				</li>
			</ul>
		);
	}
	return null;
}

export interface OrderSummaryTsAndCsProps {
	productKey: ActiveProductKey;
	ratePlanKey: ActiveRatePlanKey;
	countryGroupId: CountryGroupId;
	promotion?: Promotion;
	thresholdAmount?: number;
}
export function OrderSummaryTsAndCs({
	productKey,
	ratePlanKey,
	countryGroupId,
	promotion,
	thresholdAmount = 0,
}: OrderSummaryTsAndCsProps): JSX.Element | null {
	const billingPeriod = ratePlanToBillingPeriod(ratePlanKey);
	const periodNoun = getBillingPeriodNoun(billingPeriod);
	// Display for AUS Students who are on a subscription basis
	const isStudentOneYearRatePlan = ratePlanKey === 'OneYearStudent';
	const isPaperPlus = isPaperPlusSub(productKey, ratePlanKey);
	const isPaperSunday = isSundayOnlyNewspaperSub(productKey, ratePlanKey);
	const isPaperSundayOrPlus = isPaperPlus || isPaperSunday;
	const promoMessage = productLegal(
		countryGroupId,
		billingPeriod,
		'/',
		thresholdAmount,
		promotion,
	); // promoMessage expected to be a string like: "£10.49/month for the first 6 months, then £20.99/month"
	const homeDeliveryDate = productDeliveryOrStartDate(
		'HomeDelivery',
		ratePlanKey as ActivePaperProductOptions,
	);
	const homeDeliveryStartDate = homeDeliveryDate
		? formatUserDate(homeDeliveryDate)
		: '';

	const tierThreeSupporterPlusTsAndCs = (
		<div css={containerSummaryTsCs}>
			{promotion && (
				<p>
					You’ll pay {promoMessage} afterwards unless you cancel. Offer only
					available to new subscribers who do not have an existing subscription
					with the Guardian.
				</p>
			)}
			{productKey === 'SupporterPlus' && (
				<>
					{!isStudentOneYearRatePlan && (
						<p>Auto renews every {periodNoun} until you cancel.</p>
					)}
					<p>
						Cancel or change your support anytime. If you cancel within the
						first 14 days, you will receive a full refund.
					</p>
				</>
			)}
			{guardianWeeklyOrTierThreeProduct(productKey) && (
				<p>
					{!isGuardianWeeklyGiftProduct(productKey, ratePlanKey)
						? `Auto renews every ${periodNoun}. `
						: ``}
					Cancel anytime.
				</p>
			)}
		</div>
	);
	const defaultOrderSummaryTsAndCs = (
		<div css={containerSummaryTsCs}>
			{promotion && <p>You’ll pay {promoMessage}.</p>}
			<p>Auto renews every {periodNoun} until you cancel.</p>
			<p>
				{['Contribution', 'OneTimeContribution'].includes(productKey)
					? 'Cancel or change your support anytime.'
					: 'Cancel anytime.'}
			</p>
		</div>
	);
	const paperPlusCopy: Partial<Record<ActiveProductKey, JSX.Element>> = {
		HomeDelivery: (
			<p>
				You will receive your first newspaper delivery on{' '}
				{homeDeliveryStartDate} as part of your {ratePlanKey} subscription.
			</p>
		),
		SubscriptionCard: (
			<p>
				Your virtual subscription card barcode will be emailed to you shortly,
				and activated from tomorrow to pick up the first newspaper edition you
				are entitled to in your {ratePlanKey} subscription. Your physical
				subscription card will be delivered to your door in 1-2 weeks.
			</p>
		),
	};
	const sundayPaperCopy = paperPlusCopy['HomeDelivery'];
	const paperPlusTsAndCs = (
		<>
			<div css={containerSummaryTsCs}>
				{promotion && <p>You’ll pay {promoMessage}.</p>}
				<p>Auto renews every {periodNoun} until you cancel. Cancel anytime.</p>
			</div>
			<div css={containerSummaryTsCs}>
				{isPaperSunday && sundayPaperCopy}
				{isPaperPlus && (
					<>
						{paperPlusCopy[productKey]}
						<p>Your digital benefits will start today.</p>
					</>
				)}
			</div>
		</>
	);
	const orderSummaryTsAndCs: Partial<Record<ActiveProductKey, JSX.Element>> = {
		SupporterPlus: tierThreeSupporterPlusTsAndCs,
		TierThree: tierThreeSupporterPlusTsAndCs,
		GuardianWeeklyDomestic: tierThreeSupporterPlusTsAndCs,
		GuardianWeeklyRestOfWorld: tierThreeSupporterPlusTsAndCs,
		SubscriptionCard: isPaperSundayOrPlus
			? paperPlusTsAndCs
			: defaultOrderSummaryTsAndCs,
		HomeDelivery: isPaperSundayOrPlus
			? paperPlusTsAndCs
			: defaultOrderSummaryTsAndCs,
	};
	return orderSummaryTsAndCs[productKey] ?? defaultOrderSummaryTsAndCs;
}
