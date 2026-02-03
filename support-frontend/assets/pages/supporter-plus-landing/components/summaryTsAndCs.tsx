import { css } from '@emotion/react';
import {
	brand,
	neutral,
	space,
	textSans15,
} from '@guardian/source/foundations';
import type { CountryGroupId } from '@modules/internationalisation/countryGroup';
import type { IsoCurrency } from '@modules/internationalisation/currency';
import { getCurrencyInfo } from '@modules/internationalisation/currency';
import { BillingPeriod } from '@modules/product/billingPeriod';
import { formatAmount } from 'helpers/forms/checkouts';
import { digitalPlusTermsLink, privacyLink } from 'helpers/legal';
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
import { manageMyAccountLink, termsLink } from './paymentTsAndCs';

const containerSummaryTsCs = css`
	margin-top: ${space[6]}px;
	border-radius: ${space[3]}px;
	border: 1px solid ${neutral[46]};
	background-color: ${neutral[97]};
	padding: ${space[2]}px ${space[3]}px;
	${textSans15};
	color: ${neutral[0]};
	& a {
		color: ${neutral[7]};
	}
`;

const marginTop = css`
	margin-top: ${space[2]}px;
`;

const containerSummaryTsCsUS = css`
	border: 3px solid ${neutral[0]};
	border-radius: 0px;

	strong {
		font-weight: bold;
	}
	& a {
		color: ${brand[500]};
	}
`;

export interface SummaryTsAndCsProps {
	productKey: ActiveProductKey;
	ratePlanKey: ActiveRatePlanKey;
	countryGroupId: CountryGroupId;
	ratePlanDescription?: string;
	currency: IsoCurrency;
	amount: number;
}
export function SummaryTsAndCs({
	productKey,
	ratePlanKey,
	countryGroupId,
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
		getCurrencyInfo(currency),
		amount,
		false,
	);

	const autoRenewUtilCancelTsAndCs = (countryGroupId: CountryGroupId) => {
		return ['SupporterPlus', 'DigitalSubscription'].includes(productKey) &&
			countryGroupId === 'UnitedStates' ? (
			<div css={[containerSummaryTsCs, containerSummaryTsCsUS]}>
				<p>
					By clicking the Pay button below, you agree to enroll in your selected
					support plan and your payment method will be{' '}
					<strong>
						automatically charged the amount shown each {periodNoun}
					</strong>{' '}
					until you cancel. We will notify you if this amount changes. You may
					cancel at any time to avoid future charges in {manageMyAccountLink()}.
				</p>
				<p css={marginTop}>
					Your enrollment is subject to and governed by the Guardian{' '}
					{termsLink('Terms and Conditions', digitalPlusTermsLink)} and{' '}
					{termsLink('Privacy Policy', privacyLink)}.
				</p>
			</div>
		) : (
			<div css={containerSummaryTsCs}>
				The {productName} subscription
				{productKey === 'TierThree' ? 's' : ''}
				{productKey === 'SupporterPlus' ? ' and any contribution' : ''} will
				auto-renew each {periodNoun}. You will be charged the subscription
				{productKey === 'SupporterPlus' ? ' and contribution' : ''} amount
				{productKey === 'SupporterPlus' ? 's' : ''} using your chosen payment
				method at each renewal, at the rate then in effect, unless you cancel.
			</div>
		);
	};

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
				{!isStudentOneYearRatePlan &&
					autoRenewUtilCancelTsAndCs(countryGroupId)}
			</>
		),
		TierThree: autoRenewUtilCancelTsAndCs(countryGroupId),
		DigitalSubscription: <>{autoRenewUtilCancelTsAndCs(countryGroupId)}</>,
		GuardianAdLite: autoRenewUtilCancelTsAndCs(countryGroupId),
	};
	return summaryTsAndCs[productKey] ?? null;
}
