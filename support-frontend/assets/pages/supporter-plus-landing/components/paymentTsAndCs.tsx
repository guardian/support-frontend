import type { SerializedStyles } from '@emotion/react';
import { css } from '@emotion/react';
import { neutral, textSans12 } from '@guardian/source/foundations';
import { StripeDisclaimer } from 'components/stripe/stripeDisclaimer';
import TierThreeTerms from 'components/subscriptionCheckouts/tierThreeTerms';
import type {
	ContributionType,
	RegularContributionType,
} from 'helpers/contributions';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import {
	contributionsTermsLinks,
	guardianAdLiteTermsLink,
	privacyLink,
	supporterPlusTermsLink,
} from 'helpers/legal';
import { productLegal } from 'helpers/legalCopy';
import {
	type ActiveProductKey,
	productCatalogDescription,
} from 'helpers/productCatalog';
import type { Promotion } from 'helpers/productPrice/promotions';
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

export interface PaymentTsAndCsProps {
	productKey: ActiveProductKey;
	contributionType: ContributionType;
	countryGroupId: CountryGroupId;
	promotion?: Promotion;
	thresholdAmount?: number;
	mobileTheme?: FinePrintTheme;
	cssOverrides?: SerializedStyles;
}

const termsSupporterPlus = (linkText: string) => (
	<a href={supporterPlusTermsLink}>{linkText}</a>
);
const termsGuardianAdLite = (linkText: string) => (
	<a href={guardianAdLiteTermsLink}>{linkText}</a>
);

const frequencySingular = (contributionType: ContributionType) =>
	contributionType === 'MONTHLY' ? 'month' : 'year';

export function TsAndCsFooterLinks({
	countryGroupId,
	productKey,
}: {
	countryGroupId: CountryGroupId;
	productKey: ActiveProductKey;
}) {
	const inAdLite = productKey === 'GuardianAdLite';
	const inSupporterPlusOrTierThree =
		productKey === 'SupporterPlus' || productKey === 'TierThree';
	const privacy = <a href={privacyLink}>Privacy Policy</a>;

	const termsContributions = (
		<a href={contributionsTermsLinks[countryGroupId]}>Terms and Conditions</a>
	);

	const terms = inSupporterPlusOrTierThree
		? termsSupporterPlus('Terms and Conditions')
		: inAdLite
		? termsGuardianAdLite('Terms')
		: termsContributions;
	const productNameSummary = inAdLite ? 'the Guardian Ad-Lite' : 'our';

	return (
		<div css={marginTop}>
			By proceeding, you are agreeing to {productNameSummary} {terms}.{' '}
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
	productKey,
	contributionType,
	countryGroupId,
	promotion,
	thresholdAmount = 0,
	mobileTheme = 'dark',
}: PaymentTsAndCsProps): JSX.Element {
	const inDigitalEdition = productKey === 'DigitalSubscription';
	const inAdLite = productKey === 'GuardianAdLite';
	const inAllAccessDigital = productKey === 'SupporterPlus';
	const inDigitalPlusPrint = productKey === 'TierThree';
	const inSupport =
		productKey === 'Contribution' ||
		!(inAllAccessDigital || inDigitalPlusPrint || inAdLite || inDigitalEdition);

	const frequencyPlural = (contributionType: ContributionType) =>
		contributionType === 'MONTHLY' ? 'monthly' : 'annual';

	const copyAboveThreshold = (
		contributionType: RegularContributionType,
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
						thresholdAmount,
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
					productKey={productKey}
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
						productKey={productKey}
					/>
				</FinePrint>
			</div>
		);
	}

	const copyBelowThreshold = (
		countryGroupId: CountryGroupId,
		productKey: ActiveProductKey,
	) => {
		return (
			<TsAndCsFooterLinks
				countryGroupId={countryGroupId}
				productKey={productKey}
			/>
		);
	};

	const copyAdLite = (contributionType: RegularContributionType) => {
		return (
			<div>
				Your Guardian Ad-Lite subscription will auto-renew each{' '}
				{frequencySingular(contributionType)} unless cancelled. Your first
				payment will be taken on day 15 after signing up but you will start to
				receive your Guardian Ad-Lite benefits when you sign up. Unless you
				cancel, subsequent monthly payments will be taken on this date using
				your chosen payment method. You can cancel your subscription at any time
				before your next renewal date. If you cancel your Guardian Ad-Lite
				subscription within 14 days of signing up, your subscription will stop
				immediately and we will not take the first payment from you.
				Cancellation of your subscription after 14 days will take effect at the
				end of your current monthly payment period. To cancel, go to{' '}
				{ManageMyAccountLink} or see our Guardian Ad-Lite{' '}
				{termsGuardianAdLite('Terms')}.
			</div>
		);
	};

	const copyDigitalEdition = () => {
		return (
			<>
				<div>
					Payment taken after the first 14 day free trial. At the end of the
					free trial period your subscription will auto-renew, and you will be
					charged, each month at the full price of £14.99 per month or £149 per
					year unless you cancel. You can cancel at any time before your next
					renewal date. Cancellation will take effect at the end of your current
					subscription month. To cancel, go to{' '}
					<a href={'http://manage.theguardian.com/'}>Manage My Account</a> or
					see our{' '}
					<a href="https://www.theguardian.com/info/2014/aug/06/guardian-observer-digital-subscriptions-terms-conditions">
						Terms
					</a>
					.
				</div>
				<TsAndCsFooterLinks
					countryGroupId={countryGroupId}
					productKey={productKey}
				/>
			</>
		);
	};

	return (
		<div css={container}>
			<FinePrint mobileTheme={mobileTheme}>
				{inDigitalPlusPrint && (
					<TierThreeTerms
						paymentFrequency={contributionType === 'ANNUAL' ? 'year' : 'month'}
					/>
				)}
				{inAllAccessDigital && copyAboveThreshold(contributionType, promotion)}
				{inAdLite && copyAdLite(contributionType)}
				{(inSupport || inAdLite) &&
					copyBelowThreshold(countryGroupId, productKey)}
				{inDigitalEdition && copyDigitalEdition()}
			</FinePrint>
		</div>
	);
}
