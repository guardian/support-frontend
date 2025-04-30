import { css } from '@emotion/react';
import {
	from,
	neutral,
	palette,
	space,
	textSans14,
} from '@guardian/source/foundations';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { productLegal } from 'helpers/legalCopy';
import type { ActiveProductKey } from 'helpers/productCatalog';
import {
	type BillingPeriod,
	billingPeriodNoun,
} from 'helpers/productPrice/billingPeriods';
import type { Promotion } from 'helpers/productPrice/promotions';

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
	billingPeriod: BillingPeriod;
	countryGroupId: CountryGroupId;
	promotion?: Promotion;
	thresholdAmount?: number;
}
export function OrderSummaryTsAndCs({
	productKey,
	billingPeriod,
	countryGroupId,
	promotion,
	thresholdAmount = 0,
}: OrderSummaryTsAndCsProps): JSX.Element | null {
	const billingPeriodSingular = billingPeriodNoun(billingPeriod).toLowerCase();
	const tierThreeSupporterPlusTsAndCs = (
		<div css={containerSummaryTsCs}>
			{promotion && (
				<p>
					You’ll pay{' '}
					{productLegal(
						countryGroupId,
						billingPeriod,
						'/',
						thresholdAmount,
						promotion,
					)}{' '}
					afterwards unless you cancel. Offer only available to new subscribers
					who do not have an existing subscription with the Guardian.
				</p>
			)}
			{productKey === 'SupporterPlus' && (
				<>
					<p>Auto renews every {billingPeriodSingular} until you cancel.</p>
					<p>
						Cancel or change your support anytime. If you cancel within the
						first 14 days, you will receive a full refund.
					</p>
				</>
			)}
			{guardianWeeklyOrTierThreeProduct(productKey) && (
				<p>Auto renews every {billingPeriodSingular}. Cancel anytime.</p>
			)}
		</div>
	);
	const defaultOrderSummaryTsAndCs = (
		<div css={containerSummaryTsCs}>
			<p>Auto renews every {billingPeriodSingular} until you cancel.</p>
			<p>
				{['Contribution', 'OneTimeContribution'].includes(productKey)
					? 'Cancel or change your support anytime.'
					: 'Cancel anytime.'}
			</p>
		</div>
	);
	const orderSummaryTsAndCs: Partial<Record<ActiveProductKey, JSX.Element>> = {
		SupporterPlus: tierThreeSupporterPlusTsAndCs,
		TierThree: tierThreeSupporterPlusTsAndCs,
		GuardianWeeklyDomestic: tierThreeSupporterPlusTsAndCs,
		GuardianWeeklyRestOfWorld: tierThreeSupporterPlusTsAndCs,
	};
	return orderSummaryTsAndCs[productKey] ?? defaultOrderSummaryTsAndCs;
}
