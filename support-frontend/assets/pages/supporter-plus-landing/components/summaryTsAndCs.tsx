import { css } from '@emotion/react';
import { neutral, space, textSans17 } from '@guardian/source/foundations';
import {
	config,
	type RegularContributionTypeQuarterly,
} from 'helpers/contributions';
import { formatAmount } from 'helpers/forms/checkouts';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import type { IsoCurrency } from 'helpers/internationalisation/currency';
import {
	currencies,
	spokenCurrencies,
} from 'helpers/internationalisation/currency';
import type { ActiveProductKey } from 'helpers/productCatalog';
import { productCatalogDescription } from 'helpers/productCatalog';
import type { BillingPeriod } from 'helpers/productPrice/billingPeriods';
import {
	getDateWithOrdinal,
	getLongMonth,
} from 'helpers/utilities/dateFormatting';
import { isSundayOnlyNewspaperSub } from 'pages/[countryGroupId]/helpers/isSundayOnlyNewspaperSub';

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
	ratePlanKey: string;
	billingPeriod: BillingPeriod;
	countryGroupId: CountryGroupId;
	currency: IsoCurrency;
	amount: number;
}
export function SummaryTsAndCs({
	productKey,
	ratePlanKey,
	billingPeriod,
	countryGroupId,
	currency,
	amount,
}: SummaryTsAndCsProps): JSX.Element | null {
	const frequencySingular =
		config[countryGroupId][
			billingPeriod.toUpperCase() as RegularContributionTypeQuarterly
		].frequencySingular;

	const today = new Date();
	const renewalDateStart = `on the ${getDateWithOrdinal(today)} day of`;
	const renewalDateEnd = ` every ${frequencySingular}`;
	const renewalFrequency = `${renewalDateStart} ${
		billingPeriod === 'Annual' ? getLongMonth(today) : ''
	} ${renewalDateEnd}`;

	const isSundayOnlynewsletterSubscription = isSundayOnlyNewspaperSub(
		productKey,
		ratePlanKey,
	);

	if (isSundayOnlynewsletterSubscription) {
		return (
			<div css={containerSummaryTsCs}>
				The Observer subscription will auto renew each month. You will be
				charged the subscription amounts using your chosen payment method at
				each renewal, at the rate then in effect, unless you cancel.
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
			The {productCatalogDescription[productKey].label} subscription
			{productKey === 'TierThree' ? 's' : ''} will auto-renew each{' '}
			{frequencySingular}. You will be charged the subscription amount using
			your chosen payment method at each renewal, at the rate then in effect,
			unless you cancel.
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
			<div css={containerSummaryTsCs}>
				The {productCatalogDescription[productKey].label} subscription and any
				contribution will auto-renew each {frequencySingular}. You will be
				charged the subscription and contribution amounts using your chosen
				payment method at each renewal, at the rate then in effect, unless you
				cancel.
			</div>
		),
		TierThree: summaryTsAndCsTierThreeGuardianAdLite,
		GuardianAdLite: summaryTsAndCsTierThreeGuardianAdLite,
	};
	return summaryTsAndCs[productKey] ?? null;
}
