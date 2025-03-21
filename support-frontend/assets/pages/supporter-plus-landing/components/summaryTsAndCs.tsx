import { css } from '@emotion/react';
import { neutral, space, textSans17 } from '@guardian/source/foundations';
import type { ContributionType } from 'helpers/contributions';
import { formatAmount } from 'helpers/forms/checkouts';
import type { IsoCurrency } from 'helpers/internationalisation/currency';
import {
	currencies,
	spokenCurrencies,
} from 'helpers/internationalisation/currency';
import type { ActiveProductKey } from 'helpers/productCatalog';
import { productCatalogDescription } from 'helpers/productCatalog';
import {
	getDateWithOrdinal,
	getLongMonth,
} from 'helpers/utilities/dateFormatting';

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

const frequencySingular = (contributionType: ContributionType) =>
	contributionType === 'MONTHLY' ? 'month' : 'year';

const getRenewalFrequency = (contributionType: ContributionType) => {
	const today = new Date();
	return contributionType === 'ANNUAL'
		? `on the ${getDateWithOrdinal(today)} day of ${getLongMonth(
				today,
		  )} every year`
		: `on the ${getDateWithOrdinal(today)} day of every month`;
};

export interface SummaryTsAndCsProps {
	productKey: ActiveProductKey;
	contributionType: ContributionType;
	currency: IsoCurrency;
	amount: number;
}
export function SummaryTsAndCs({
	productKey,
	contributionType,
	currency,
	amount,
}: SummaryTsAndCsProps): JSX.Element | null {
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
			{frequencySingular(contributionType)}. You will be charged the
			subscription amount using your chosen payment method at each renewal, at
			the rate then in effect, unless you cancel.
		</div>
	);
	const summaryTsAndCs: Partial<Record<ActiveProductKey, JSX.Element>> = {
		Contribution: (
			<div css={containerSummaryTsCs}>
				We will attempt to take payment of {amountWithCurrency},{' '}
				{getRenewalFrequency(contributionType)}, from now until you cancel your
				payment. Payments may take up to 6 days to be recorded in your bank
				account. You can change how much you give or cancel your payment at any
				time.
			</div>
		),
		SupporterPlus: (
			<div css={containerSummaryTsCs}>
				The {productCatalogDescription[productKey].label} subscription and any
				contribution will auto-renew each {frequencySingular(contributionType)}.
				You will be charged the subscription and contribution amounts using your
				chosen payment method at each renewal, at the rate then in effect,
				unless you cancel.
			</div>
		),
		TierThree: summaryTsAndCsTierThreeGuardianAdLite,
		GuardianAdLite: summaryTsAndCsTierThreeGuardianAdLite,
	};
	return summaryTsAndCs[productKey] ?? null;
}
