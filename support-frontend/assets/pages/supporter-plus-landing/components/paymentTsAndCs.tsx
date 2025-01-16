import type { SerializedStyles } from '@emotion/react';
import { css } from '@emotion/react';
import {
	neutral,
	space,
	textSans12,
	textSans17,
} from '@guardian/source/foundations';
import { StripeDisclaimer } from 'components/stripe/stripeDisclaimer';
import TierThreeTerms from 'components/subscriptionCheckouts/tierThreeTerms';
import type {
	ContributionType,
	RegularContributionType,
} from 'helpers/contributions';
import { formatAmount } from 'helpers/forms/checkouts';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import type { IsoCurrency } from 'helpers/internationalisation/currency';
import {
	currencies,
	spokenCurrencies,
} from 'helpers/internationalisation/currency';
import {
	contributionsTermsLinks,
	privacyLink,
	supporterPlusTermsLink,
} from 'helpers/legal';
import { productLegal } from 'helpers/legalCopy';
import {
	type ActiveProductKey,
	productCatalogDescription,
} from 'helpers/productCatalog';
import type { Promotion } from 'helpers/productPrice/promotions';
import {
	getDateWithOrdinal,
	getLongMonth,
} from 'helpers/utilities/dateFormatting';
import type { FinePrintTheme } from './finePrint';
import { FinePrint } from './finePrint';
import { ManageMyAccountLink } from './manageMyAccountLink';

const marginTop = css`
	margin-top: 4px;
`;

const container = css`
	${textSans12};
	color: ${neutral[20]};

	& a {
		color: ${neutral[20]};
	}
`;

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

interface PaymentTsAndCsProps extends SummaryTsAndCsProps {
	amountIsAboveThreshold: boolean;
	countryGroupId: CountryGroupId;
}

interface SummaryTsAndCsProps {
	mobileTheme?: FinePrintTheme;
	contributionType: ContributionType;
	currency: IsoCurrency;
	amount: number;
	productKey: ActiveProductKey;
	promotion?: Promotion;
	cssOverrides?: SerializedStyles;
}

export const termsSupporterPlus = (linkText: string) => (
	<a href={supporterPlusTermsLink}>{linkText}</a>
);

const frequencySingular = (contributionType: ContributionType) =>
	contributionType === 'MONTHLY' ? 'month' : 'year';

function TsAndCsRenewal({
	contributionType,
}: {
	contributionType: ContributionType;
}): JSX.Element {
	const today = new Date();
	if (contributionType === 'ANNUAL') {
		return (
			<>
				on the {getDateWithOrdinal(today)} day of {getLongMonth(today)} every{' '}
				year
			</>
		);
	}
	return <>on the {getDateWithOrdinal(today)} day of every month</>;
}

export function TsAndCsFooterLinks({
	countryGroupId,
	amountIsAboveThreshold,
}: {
	countryGroupId: CountryGroupId;
	amountIsAboveThreshold?: boolean;
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
			<p css={marginTop}>
				<StripeDisclaimer />
			</p>
		</div>
	);
}

export function PaymentTsAndCs({
	mobileTheme = 'dark',
	contributionType,
	countryGroupId,
	amountIsAboveThreshold,
	productKey,
	promotion,
}: PaymentTsAndCsProps): JSX.Element {
	const inSupporterPlus =
		productKey === 'SupporterPlus' && amountIsAboveThreshold;
	const inTier3 = productKey === 'TierThree' && amountIsAboveThreshold;
	const inSupport =
		productKey === 'Contribution' || !(inSupporterPlus || inTier3);

	const frequencyPlural = (contributionType: ContributionType) =>
		contributionType === 'MONTHLY' ? 'monthly' : 'annual';

	const copyAboveThreshold = (
		contributionType: RegularContributionType,
		product: ActiveProductKey,
		promotion?: Promotion,
	) => {
		const productLabel = productCatalogDescription[productKey].label;
		return (
			<>
				<div>
					If you pay at least{' '}
					{productLegal(
						countryGroupId,
						contributionType,
						' per ',
						product,
						promotion,
					)}
					, you will receive the {productLabel} benefits on a subscription
					basis. If you increase your payments per{' '}
					{frequencySingular(contributionType)}, these additional amounts will
					be separate {frequencyPlural(contributionType)} voluntary financial
					contributions to the Guardian. The {productLabel} subscription and any
					contributions will auto-renew each{' '}
					{frequencySingular(contributionType)}. You will be charged the
					subscription and contribution amounts using your chosen payment method
					at each renewal unless you cancel. You can cancel your subscription or
					change your contributions at any time before your next renewal date.
					If you cancel within 14 days of taking out a {productLabel}{' '}
					subscription, you’ll receive a full refund (including of any
					contributions) and your subscription and any contribution will stop
					immediately. Cancellation of your subscription (which will also cancel
					any contribution) or cancellation of your contribution made after 14
					days will take effect at the end of your current{' '}
					{frequencyPlural(contributionType)} payment period. To cancel, go to{' '}
					{ManageMyAccountLink} or see our {termsSupporterPlus('Terms')}.
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
				<FinePrint mobileTheme={mobileTheme}>
					<TsAndCsFooterLinks
						countryGroupId={countryGroupId}
						amountIsAboveThreshold={amountIsAboveThreshold}
					/>
				</FinePrint>
			</div>
		);
	}

	const copyBelowThreshold = (countryGroupId: CountryGroupId) => {
		return (
			<TsAndCsFooterLinks
				countryGroupId={countryGroupId}
				amountIsAboveThreshold={amountIsAboveThreshold}
			/>
		);
	};

	return (
		<div css={container}>
			<FinePrint mobileTheme={mobileTheme}>
				{inTier3 && (
					<TierThreeTerms
						paymentFrequency={contributionType === 'ANNUAL' ? 'year' : 'month'}
					/>
				)}
				{inSupporterPlus &&
					copyAboveThreshold(contributionType, productKey, promotion)}
				{inSupport && copyBelowThreshold(countryGroupId)}
			</FinePrint>
		</div>
	);
}

export function SummaryTsAndCs({
	contributionType,
	currency,
	amount,
	productKey,
	cssOverrides,
}: SummaryTsAndCsProps): JSX.Element {
	const inTier3 = productKey === 'TierThree';
	const inTier2 = productKey === 'SupporterPlus';
	const inTier1 = productKey === 'Contribution' || !(inTier2 || inTier3);

	const amountCopy = ` of ${formatAmount(
		currencies[currency],
		spokenCurrencies[currency],
		amount,
		false,
	)}`;

	const copyTier1 = (contributionType: ContributionType) => {
		return (
			<>
				<div>
					We will attempt to take payment{amountCopy},{' '}
					<TsAndCsRenewal contributionType={contributionType} />, from now until
					you cancel your payment. Payments may take up to 6 days to be recorded
					in your bank account. You can change how much you give or cancel your
					payment at any time.
				</div>
			</>
		);
	};

	const copyTier2 = (
		contributionType: ContributionType,
		productKey: ActiveProductKey,
	) => {
		return (
			<>
				<div>
					The {productCatalogDescription[productKey].label} subscription and any
					contribution will auto-renew each{' '}
					{frequencySingular(contributionType)}. You will be charged the
					subscription and contribution amounts using your chosen payment method
					at each renewal, at the rate then in effect, unless you cancel.
				</div>
			</>
		);
	};

	const copyTier3 = (
		contributionType: ContributionType,
		productKey: ActiveProductKey,
	) => {
		return (
			<>
				<div>
					The {productCatalogDescription[productKey].label} subscriptions will
					auto-renew each {frequencySingular(contributionType)}. You will be
					charged the subscription amount using your chosen payment method at
					each renewal, at the rate then in effect, unless you cancel.
				</div>
			</>
		);
	};

	return (
		<div css={[containerSummaryTsCs, cssOverrides]}>
			{inTier1 && copyTier1(contributionType)}
			{inTier2 && copyTier2(contributionType, productKey)}
			{inTier3 && copyTier3(contributionType, productKey)}
		</div>
	);
}
