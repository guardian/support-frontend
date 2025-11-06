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
import {
	type ActiveProductKey,
	type ActiveRatePlanKey,
	observerLabelSuffix,
} from 'helpers/productCatalog';
import type { ActivePaperProductOptions } from 'helpers/productCatalogToProductOption';
import {
	getBillingPeriodNoun,
	ratePlanToBillingPeriod,
} from 'helpers/productPrice/billingPeriods';
import type { Promotion } from 'helpers/productPrice/promotions';
import { formatUserDate } from 'helpers/utilities/dateConversions';
import { getProductFirstDeliveryDate } from 'pages/[countryGroupId]/checkout/helpers/deliveryDays';
import {
	isPaperPlusSub,
	isSundayOnlyNewspaperSub,
} from 'pages/[countryGroupId]/helpers/isSundayOnlyNewspaperSub';
import {
	isGuardianWeeklyGiftProduct,
	isGuardianWeeklyOrTierThreeProduct,
} from 'pages/supporter-plus-thank-you/components/thankYouHeader/utils/productMatchers';

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

interface OrderSummaryStartDateProps {
	productKey: ActiveProductKey;
	ratePlanKey: ActiveRatePlanKey;
	startDate: string;
}
export function OrderSummaryStartDate({
	productKey,
	ratePlanKey,
	startDate,
}: OrderSummaryStartDateProps): JSX.Element | null {
	if (
		isGuardianWeeklyOrTierThreeProduct(productKey) &&
		!isGuardianWeeklyGiftProduct(productKey, ratePlanKey)
	) {
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
	ratePlanDescription?: string;
	countryGroupId: CountryGroupId;
	promotion?: Promotion;
	thresholdAmount?: number;
	deliveryDate?: Date;
}
export function OrderSummaryTsAndCs({
	productKey,
	ratePlanKey,
	ratePlanDescription,
	countryGroupId,
	promotion,
	thresholdAmount = 0,
	deliveryDate,
}: OrderSummaryTsAndCsProps): JSX.Element | null {
	const billingPeriod = ratePlanToBillingPeriod(ratePlanKey);
	const periodNoun = getBillingPeriodNoun(billingPeriod);
	// Display for AUS Students who are on a subscription basis
	const isStudentOneYearRatePlan = ratePlanKey === 'OneYearStudent';
	const isPaperPlus = isPaperPlusSub(productKey, ratePlanKey);
	const isPaperSundayOrPlus =
		isPaperPlus || isSundayOnlyNewspaperSub(productKey, ratePlanKey);
	const promoMessage = productLegal(
		countryGroupId,
		billingPeriod,
		'/',
		thresholdAmount,
		promotion,
	); // promoMessage expected to be a string like: "£10.49/month for the first 6 months, then £20.99/month"
	const deliveryStart =
		deliveryDate ??
		getProductFirstDeliveryDate(
			productKey,
			ratePlanKey as ActivePaperProductOptions,
		);
	const deliveryStartDate = deliveryStart ? formatUserDate(deliveryStart) : '';
	const rateDescriptor = ratePlanDescription
		? ratePlanDescription
				.replace(/^The\s+/i, '') // Remove "The" at the start, case-insensitive, with following space
				.replace(observerLabelSuffix, '') // Remove Observer ", digital & print" at the end, case-insensitive, with preceding space
				.replace(/\s*package$/i, '') // Remove "package" at the end, case-insensitive, with preceding space
				.trim()
		: ratePlanKey;

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
					{isStudentOneYearRatePlan ? (
						<p>
							If you cancel within the first 14 days, you will receive a full
							refund.
						</p>
					) : (
						<>
							<p>Auto renews every {periodNoun} until you cancel.</p>
							<p>
								Cancel or change your support anytime. If you cancel within the
								first 14 days, you will receive a full refund.
							</p>
						</>
					)}
				</>
			)}
			{isGuardianWeeklyOrTierThreeProduct(productKey) && (
				<p>
					{isGuardianWeeklyGiftProduct(productKey, ratePlanKey) ? (
						<>
							Your Guardian Weekly gift subscription will start on{' '}
							{deliveryStartDate}. The recipient should receive their first
							magazine 1 - 7 days after this issue date, depending on national
							post services.
						</>
					) : (
						<>Auto renews every {periodNoun}. Cancel anytime.</>
					)}
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
	const paperSundayOrPlusCopy: Partial<Record<ActiveProductKey, JSX.Element>> =
		{
			HomeDelivery: (
				<p>
					You will receive your first newspaper delivery on {deliveryStartDate}{' '}
					as part of your {rateDescriptor} subscription.
				</p>
			),
			SubscriptionCard: (
				<p>
					Your physical subscription card will be delivered to your door by{' '}
					{deliveryStartDate}, for you to collect in store the first newspaper
					edition you are entitled to in your {rateDescriptor} subscription.
				</p>
			),
		};
	const paperPlusTsAndCs = (
		<>
			<div css={containerSummaryTsCs}>
				{promotion && <p>You’ll pay {promoMessage}.</p>}
				<p>Auto renews every {periodNoun} until you cancel. Cancel anytime.</p>
			</div>
			<div css={containerSummaryTsCs}>
				{isPaperSundayOrPlus && (
					<>
						{paperSundayOrPlusCopy[productKey]}
						{isPaperPlus && <p>Your digital benefits will start today.</p>}
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
		SubscriptionCard: paperPlusTsAndCs,
		HomeDelivery: paperPlusTsAndCs,
	};
	return orderSummaryTsAndCs[productKey] ?? defaultOrderSummaryTsAndCs;
}
