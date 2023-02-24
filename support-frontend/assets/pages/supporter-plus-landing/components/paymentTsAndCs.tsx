import { css } from '@emotion/react';
import { neutral, textSans } from '@guardian/source-foundations';
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
import { sendTrackingEventsOnClick } from 'helpers/productPrice/subscriptions';
import { benefitsThresholdsByCountryGroup } from 'helpers/supporterPlus/benefitsThreshold';
import { manageSubsUrl } from 'helpers/urls/externalLinks';
import { getDateWithOrdinal } from 'helpers/utilities/dateFormatting';

const marginTop = css`
	margin-top: 4px;
`;

const container = css`
	${textSans.xxsmall()};
	color: ${neutral[20]};

	& a {
		color: ${neutral[20]};
	}
`;

interface PaymentTsAndCsProps {
	contributionType: ContributionType;
	countryGroupId: CountryGroupId;
	currency: IsoCurrency;
	amount: number;
	amountIsAboveThreshold: boolean;
}

const manageMyAccount = (
	<a
		href={manageSubsUrl}
		onClick={sendTrackingEventsOnClick({
			id: 'checkout_my_account',
			product: 'PremiumTier',
			componentType: 'ACQUISITIONS_BUTTON',
		})}
	>
		Manage My Account
	</a>
);

const termsSupporterPlus = (linkText: string) => (
	<a href="https://www.theguardian.com/info/2022/oct/28/the-guardian-supporter-plus-terms-and-conditions">
		{linkText}
	</a>
);

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

	const terms = amountIsAboveThreshold
		? termsSupporterPlus('Terms and Conditions')
		: termsContributions;

	return (
		<div css={marginTop}>
			By proceeding, you are agreeing to our {terms}.{' '}
			<p css={marginTop}>
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

	const frequencySingular = (contributionType: ContributionType) =>
		contributionType === 'MONTHLY' ? 'month' : 'year';

	const frequencyPlural = (contributionType: ContributionType) =>
		contributionType === 'MONTHLY' ? 'monthly' : 'annual';

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
		const supporterPlusThresholds =
			benefitsThresholdsByCountryGroup[countryGroupId];

		return (
			<>
				<div>
					This subscription auto-renews each{' '}
					{frequencySingular(contributionType)}. You will be charged the
					applicable {frequencyPlural(contributionType)} amount at each renewal
					unless you cancel. You can cancel or change how much you pay for these
					benefits at any time before your next renewal date, but{' '}
					{currencyGlyph}
					{supporterPlusThresholds['MONTHLY']} per month or {currencyGlyph}
					{supporterPlusThresholds['ANNUAL']} per year is the minimum payment to
					receive this subscription. If you cancel within 14 days of taking out
					this subscription, you’ll receive a full refund and your benefits will
					stop immediately. Changes to your payment amount or cancellation made
					after 14 days will take effect at the end of your current subscription{' '}
					{frequencySingular(contributionType)}. To cancel, go to{' '}
					{manageMyAccount} or see our {termsSupporterPlus('Terms')}.
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
