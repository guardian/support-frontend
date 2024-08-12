import { css } from '@emotion/react';
import { neutral, space, textSans } from '@guardian/source/foundations';
import Tier3Terms, {
	productNameUSTierThree,
} from 'components/subscriptionCheckouts/threeTierTerms';
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
	productCatalogDescription,
	type ProductKey,
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
	${textSans.xxsmall()};
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
	${textSans.xsmall()};
	color: ${neutral[7]};
	& a {
		color: ${neutral[7]};
	}
`;

interface PaymentTsAndCsProps {
	mobileTheme?: FinePrintTheme;
	contributionType: ContributionType;
	countryGroupId: CountryGroupId;
	currency: IsoCurrency;
	amount: number;
	amountIsAboveThreshold: boolean;
	productKey: ProductKey;
	promotion?: Promotion;
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
	mobileTheme = 'dark',
	contributionType,
	countryGroupId,
	currency,
	amount,
	amountIsAboveThreshold,
	productKey,
	promotion,
}: PaymentTsAndCsProps): JSX.Element {
	const inSupporterPlus =
		productKey === 'SupporterPlus' && amountIsAboveThreshold;
	const inTier3 = productKey === 'TierThree' && amountIsAboveThreshold;
	const inSupport =
		productKey === 'Contribution' || !(inSupporterPlus || inTier3);

	const amountCopy = ` of ${formatAmount(
		currencies[currency],
		spokenCurrencies[currency],
		amount,
		false,
	)}`;

	const frequencyPlural = (contributionType: ContributionType) =>
		contributionType === 'MONTHLY' ? 'monthly' : 'annual';

	const copyAboveThreshold = (
		contributionType: RegularContributionType,
		product: ProductKey,
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

	const copyBelowThreshold = (
		contributionType: ContributionType,
		countryGroupId: CountryGroupId,
	) => {
		return (
			<>
				{countryGroupId !== 'UnitedStates' && (
					<div>
						We will attempt to take payment{amountCopy},{' '}
						<TsAndCsRenewal contributionType={contributionType} />, from now
						until you cancel your payment. Payments may take up to 6 days to be
						recorded in your bank account. You can change how much you give or
						cancel your payment at any time.
					</div>
				)}
				<TsAndCsFooterLinks
					countryGroupId={countryGroupId}
					amountIsAboveThreshold={amountIsAboveThreshold}
				/>
			</>
		);
	};

	return (
		<div css={container}>
			<FinePrint mobileTheme={mobileTheme}>
				{inTier3 && (
					<Tier3Terms
						paymentFrequency={contributionType === 'ANNUAL' ? 'year' : 'month'}
						countryGroupId={countryGroupId}
					/>
				)}
				{inSupporterPlus &&
					copyAboveThreshold(contributionType, productKey, promotion)}
				{inSupport && copyBelowThreshold(contributionType, countryGroupId)}
			</FinePrint>
		</div>
	);
}

export function SummaryTsAndCs({
	contributionType,
	countryGroupId,
	currency,
	amount,
	amountIsAboveThreshold,
	productKey,
}: PaymentTsAndCsProps): JSX.Element {
	const inTier3 = productKey === 'TierThree' && amountIsAboveThreshold;
	const inTier2 = productKey === 'SupporterPlus' && amountIsAboveThreshold;
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
		productKey: ProductKey,
	) => {
		const productLabel = productCatalogDescription[productKey].label;
		return (
			<>
				<div>
					The {productLabel} subscription and any contribution will auto-renew
					each {frequencySingular(contributionType)}. You will be charged the
					subscription and contribution amounts using your chosen payment method
					at each renewal, at the rate then in effect, unless you cancel.
				</div>
			</>
		);
	};

	const copyTier3 = (
		contributionType: ContributionType,
		productLabel: string,
	) => {
		return (
			<>
				<div>
					The {productLabel} subscriptions will auto-renew each{' '}
					{frequencySingular(contributionType)}. You will be charged the
					subscription amount using your chosen payment method at each renewal,
					at the rate then in effect, unless you cancel.
				</div>
			</>
		);
	};

	return (
		<>
			{countryGroupId === 'UnitedStates' && (
				<div css={containerSummaryTsCs}>
					{inTier1 && copyTier1(contributionType)}
					{inTier2 && copyTier2(contributionType, productKey)}
					{inTier3 && copyTier3(contributionType, productNameUSTierThree)}
				</div>
			)}
		</>
	);
}
