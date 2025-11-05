import { css } from '@emotion/react';
import { neutral, space, textSans17 } from '@guardian/source/foundations';
import type { IsoCurrency } from '@modules/internationalisation/currency';
import { BillingPeriod } from '@modules/product/billingPeriod';
import { getFeatureFlags } from 'helpers/featureFlags';
import { formatAmount } from 'helpers/forms/checkouts';
import {
	currencies,
	spokenCurrencies,
} from 'helpers/internationalisation/currency';
import type {
	ActiveProductKey,
	ActiveRatePlanKey,
} from 'helpers/productCatalog';
import { getProductDescription } from 'helpers/productCatalog';
import {
	getBillingPeriodNoun,
	ratePlanToBillingPeriod,
} from 'helpers/productPrice/billingPeriods';
import {
	getDateWithOrdinal,
	getLongMonth,
} from 'helpers/utilities/dateFormatting';
import {
	isPaperPlusSub,
	isSundayOnlyNewspaperSub,
} from 'pages/[countryGroupId]/helpers/isSundayOnlyNewspaperSub';

const containerSummaryTsCs = css`
	margin-top: ${space[6]}px;
	border-radius: ${space[2]}px;
	background-color: ${neutral[97]};
	padding: ${space[3]}px;
	${textSans17};
	color: ${neutral[0]};
	& a {
		color: ${neutral[7]};
	}
`;
export interface SummaryTsAndCsProps {
	productKey: ActiveProductKey;
	ratePlanKey: ActiveRatePlanKey;
	ratePlanDescription?: string;
	currency: IsoCurrency;
	amount: number;
}
export function SummaryTsAndCs({
	productKey,
	ratePlanKey,
	ratePlanDescription,
	currency,
	amount,
}: SummaryTsAndCsProps): JSX.Element | null {
	const billingPeriod = ratePlanToBillingPeriod(ratePlanKey);
	const periodNoun = getBillingPeriodNoun(billingPeriod);
	const today = new Date();
	const renewalDateStart = `on the ${getDateWithOrdinal(today)} day of `;
	const renewalDateEnd = `every ${periodNoun}`;
	const renewalFrequency = `${renewalDateStart}${
		billingPeriod === BillingPeriod.Annual ? getLongMonth(today) + ' ' : ''
	}${renewalDateEnd}`;
	// Display for AUS Students who are on a subscription basis
	const isStudentOneYearRatePlan = ratePlanKey === 'OneYearStudent';
	const isSundayOnlyNewsletterSubscription = isSundayOnlyNewspaperSub(
		productKey,
		ratePlanKey,
	);
	const isPaperSundayOrPlus =
		isSundayOnlyNewsletterSubscription ||
		isPaperPlusSub(productKey, ratePlanKey);

	const featureFlags = getFeatureFlags();
	const { label: productName } = getProductDescription(productKey, ratePlanKey);

	const rateDescriptor = ratePlanDescription ?? ratePlanKey;

	if (isPaperSundayOrPlus) {
		return (
			<div css={containerSummaryTsCs}>
				The {isSundayOnlyNewsletterSubscription ? 'Observer' : rateDescriptor}{' '}
				subscription will auto renew each month. You will be charged the
				subscription amounts using your chosen payment method at each renewal,
				at the rate then in effect, unless you cancel.
			</div>
		);
	}

	const amountWithCurrency = formatAmount(
		currencies[currency],
		spokenCurrencies[currency],
		amount,
		false,
	);

	const summaryTsAndCsTierThreeGuardianAdLite = (
		<div css={containerSummaryTsCs}>
			The {productName} subscription
			{productKey === 'TierThree' ? 's' : ''} will auto-renew each {periodNoun}.
			You will be charged the subscription amount using your chosen payment
			method at each renewal, at the rate then in effect, unless you cancel.
		</div>
	);
	const summaryTsAndCs: Partial<Record<ActiveProductKey, JSX.Element>> = {
		Contribution: (
			<div css={containerSummaryTsCs}>
				We will attempt to take payment of {amountWithCurrency},{' '}
				{renewalFrequency}, from now until you cancel your payment. Payments may
				take up to 6 days to be recorded in your bank account. You can change
				how much you give or cancel your payment at any time.
			</div>
		),
		SupporterPlus: (
			<>
				{!isStudentOneYearRatePlan && (
					<div css={containerSummaryTsCs}>
						The {productName} subscription and any contribution will auto-renew
						each {periodNoun}. You will be charged the subscription and
						contribution amounts using your chosen payment method at each
						renewal, at the rate then in effect, unless you cancel.
					</div>
				)}
			</>
		),
		TierThree: summaryTsAndCsTierThreeGuardianAdLite,
		DigitalSubscription: (
			<>
				{featureFlags.enablePremiumDigital &&
					summaryTsAndCsTierThreeGuardianAdLite}
			</>
		),
		GuardianAdLite: summaryTsAndCsTierThreeGuardianAdLite,
	};
	return summaryTsAndCs[productKey] ?? null;
}
