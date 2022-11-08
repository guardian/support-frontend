import { css } from '@emotion/react';
import { neutral, space, textSans } from '@guardian/source-foundations';
import type { ContributionType } from 'helpers/contributions';
import { formatAmount } from 'helpers/forms/checkouts';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import type { IsoCurrency } from 'helpers/internationalisation/currency';
import {
	currencies,
	detect,
	glyph,
	spokenCurrencies,
} from 'helpers/internationalisation/currency';
import { contributionsTermsLinks, privacyLink } from 'helpers/legal';
import { getDateWithOrdinal } from 'helpers/utilities/dateFormatting';
import { getThresholdPrice } from 'pages/contributions-landing/components/DigiSubBenefits/helpers';

interface PaymentTsAndCsProps {
	contributionType: ContributionType;
	countryGroupId: CountryGroupId;
	currency: IsoCurrency;
	amount: number;
	amountIsAboveThreshold: boolean;
}

function TsAndCsFooterLinks({
	countryGroupId,
	amountIsAboveThreshold,
}: {
	countryGroupId: CountryGroupId;
	amountIsAboveThreshold: boolean;
}) {
	const privacy = <a href={privacyLink}>Privacy Policy</a>;

	const termsContributions = (
		<a href={contributionsTermsLinks[countryGroupId]}>Terms and Conditions</a>
	);
	const termsSupporterPlus = (
		<a href="https://www.theguardian.com/info/2022/oct/28/the-guardian-supporter-plus-terms-and-conditions">
			Terms and Conditions
		</a>
	);

	const terms = amountIsAboveThreshold
		? termsSupporterPlus
		: termsContributions;

	return (
		<div
			css={css`
				margin-top: ${space[2]}px;
			`}
		>
			By proceeding, you are agreeing to our {terms}.{' '}
			<p
				css={css`
					margin-top: 6px;
				`}
			>
				To find out what personal data we collect and how we use it, please
				visit our {privacy}.
			</p>
		</div>
	);
}

export function PaymentTsAndCs({
	contributionType,
	countryGroupId,
	currency,
	amount,
	amountIsAboveThreshold,
}: PaymentTsAndCsProps): JSX.Element {
	const amountCopy = isNaN(amount)
		? null
		: ` of ${formatAmount(
				currencies[currency],
				spokenCurrencies[currency],
				amount,
				false,
		  )}`;

	const currencyGlyph = glyph(detect(countryGroupId));
	const thresholdPrice =
		getThresholdPrice(countryGroupId, contributionType) ?? 1;

	const frequencySingular = (contributionType: ContributionType) =>
		contributionType === 'MONTHLY' ? 'month' : 'year';

	const frequencyPlural = (contributionType: ContributionType) =>
		contributionType === 'MONTHLY' ? 'monthly' : 'annual';

	const container = css`
		${textSans.xsmall()};
		color: ${neutral[20]};

		& a {
			color: ${neutral[20]};
		}
	`;

	const copyBelowThreshold = (contributionType: ContributionType) => {
		return (
			<>
				<div>
					We will attempt to take payment{amountCopy}, on the{' '}
					{getDateWithOrdinal(new Date())} day of every{' '}
					{frequencySingular(contributionType)}, from now until you cancel your
					payment. Payments may take up to 6 days to be recorded in your bank
					account. You can change how much you give or cancel your payment at
					any time.
				</div>
				<TsAndCsFooterLinks
					countryGroupId={countryGroupId}
					amountIsAboveThreshold={amountIsAboveThreshold}
				/>
			</>
		);
	};

	const copyAboveThreshold = (contributionType: ContributionType) => {
		return (
			<>
				<div>
					This arrangement auto-renews and you will be charged the applicable{' '}
					{frequencyPlural(contributionType)} amount each time it renews unless
					you cancel. You can change how much you pay at any time but{' '}
					{currencyGlyph}
					{thresholdPrice} per {frequencySingular(contributionType)} is the
					minimum payment to receive these benefits. You can cancel any time
					before your next payment date and if you cancel within the first 14
					days, you’ll receive a full refund. Cancellation of your payment will
					result in the cancellation of these benefits.
				</div>
				<TsAndCsFooterLinks
					countryGroupId={countryGroupId}
					amountIsAboveThreshold={amountIsAboveThreshold}
				/>
			</>
		);
	};

	if (contributionType === 'ONE_OFF') {
		return (
			<div css={container}>
				<TsAndCsFooterLinks
					countryGroupId={countryGroupId}
					amountIsAboveThreshold={amountIsAboveThreshold}
				/>
			</div>
		);
	}

	if (contributionType === 'MONTHLY') {
		return (
			<div css={container}>
				{amountIsAboveThreshold
					? copyAboveThreshold(contributionType)
					: copyBelowThreshold(contributionType)}
			</div>
		);
	}

	return (
		<div css={container}>
			{amountIsAboveThreshold
				? copyAboveThreshold(contributionType)
				: copyBelowThreshold(contributionType)}
		</div>
	);
}
