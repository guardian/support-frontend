import { css } from '@emotion/react';
import { neutral, textSans12 } from '@guardian/source/foundations';
import { StripeDisclaimer } from 'components/stripe/stripeDisclaimer';
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
	tierThreeTermsLink,
} from 'helpers/legal';
import { productLegal } from 'helpers/legalCopy';
import {
	type ActiveProductKey,
	productCatalogDescription,
} from 'helpers/productCatalog';
import type { Promotion } from 'helpers/productPrice/promotions';
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
		:visited {
			color: ${neutral[20]};
		}
	}
`;

const termsLink = (linkText: string, url: string) => (
	<a target="_blank" rel="noopener noreferrer" href={url}>
		{linkText}
	</a>
);

const frequencySingular = (contributionType: ContributionType) =>
	contributionType === 'MONTHLY' ? 'month' : 'year';
const frequencyPlural = (contributionType: ContributionType) =>
	contributionType === 'MONTHLY' ? 'monthly' : 'annual';

export function FooterTsAndCs({
	productKey,
	countryGroupId,
}: {
	productKey: ActiveProductKey;
	countryGroupId: CountryGroupId;
}) {
	const privacy = <a href={privacyLink}>Privacy Policy</a>;
	const getProductNameSummary = (): string => {
		switch (productKey) {
			case 'GuardianAdLite':
				return 'the Guardian Ad-Lite';
			case 'TierThree':
				return 'Digital + print';
			default:
				return 'our';
		}
	};
	const getProductTerms = (): JSX.Element => {
		switch (productKey) {
			case 'GuardianAdLite':
				return termsLink('Terms', guardianAdLiteTermsLink);
			case 'SupporterPlus':
				return termsLink('Terms and Conditions', supporterPlusTermsLink);
			case 'TierThree':
				return termsLink('Terms', tierThreeTermsLink);
			default:
				return termsLink(
					'Terms and Conditions',
					contributionsTermsLinks[countryGroupId],
				);
		}
	};
	return (
		<div css={marginTop}>
			By proceeding, you are agreeing to {getProductNameSummary()}{' '}
			{getProductTerms()}.{' '}
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

export interface PaymentTsAndCsProps {
	productKey: ActiveProductKey;
	contributionType: ContributionType;
	countryGroupId: CountryGroupId;
	promotion?: Promotion;
	thresholdAmount?: number;
}
export function PaymentTsAndCs({
	productKey,
	contributionType,
	countryGroupId,
	promotion,
	thresholdAmount = 0,
}: PaymentTsAndCsProps): JSX.Element {
	const productLabel = productCatalogDescription[productKey].label;
	const paymentTsAndCs: Partial<Record<ActiveProductKey, JSX.Element>> = {
		DigitalSubscription: (
			<div>
				Payment taken after the first 14 day free trial. At the end of the free
				trial period your subscription will auto-renew, and you will be charged,
				each month at the full price of £14.99 per month or £149 per year unless
				you cancel. You can cancel at any time before your next renewal date.
				Cancellation will take effect at the end of your current subscription
				month. To cancel, go to{' '}
				<a href={'http://manage.theguardian.com/'}>Manage My Account</a> or see
				our{' '}
				<a href="https://www.theguardian.com/info/2014/aug/06/guardian-observer-digital-subscriptions-terms-conditions">
					Terms
				</a>
				.
			</div>
		),
		GuardianAdLite: (
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
				{termsLink('Terms', guardianAdLiteTermsLink)}.
			</div>
		),
		SupporterPlus: (
			<div>
				If you pay at least{' '}
				{productLegal(
					countryGroupId,
					contributionType as RegularContributionType,
					' per ',
					thresholdAmount,
					promotion,
				)}
				, you will receive the {productLabel} benefits on a subscription basis.
				If you increase your payments per {frequencySingular(contributionType)},
				these additional amounts will be separate{' '}
				{frequencyPlural(contributionType)} voluntary financial contributions to
				the Guardian. The {productLabel} subscription and any contributions will
				auto-renew each {frequencySingular(contributionType)}. You will be
				charged the subscription and contribution amounts using your chosen
				payment method at each renewal unless you cancel. You can cancel your
				subscription or change your contributions at any time before your next
				renewal date. If you cancel within 14 days of taking out a{' '}
				{productLabel} subscription, you’ll receive a full refund (including of
				any contributions) and your subscription and any contribution will stop
				immediately. Cancellation of your subscription (which will also cancel
				any contribution) or cancellation of your contribution made after 14
				days will take effect at the end of your current{' '}
				{frequencyPlural(contributionType)} payment period. To cancel, go to{' '}
				{ManageMyAccountLink} or see our{' '}
				{termsLink('Terms', supporterPlusTermsLink)}.
			</div>
		),
		TierThree: (
			<div>
				<p>
					By signing up, you are taking out a Digital + print subscription. Your
					Digital + print subscription will auto-renew each{' '}
					{frequencySingular(contributionType)} unless cancelled. Your first
					payment will be taken on the publication date of your first Guardian
					Weekly magazine (as shown in the checkout) but you will start to
					receive your digital benefits when you sign up. Unless you cancel,
					subsequent {frequencyPlural(contributionType)} payments will be taken
					on this date using your chosen payment method. You can cancel your
					Digital + print subscription at any time before your next renewal
					date. If you cancel your Digital + print subscription within 14 days
					of signing up, your subscription will stop immediately and we will not
					take the first payment from you. Cancellation of your subscription
					after 14 days will take effect at the end of your current{' '}
					{frequencyPlural(contributionType)} payment period. To cancel go
					to&nbsp;
					{ManageMyAccountLink} or see our Digital + print{' '}
					{termsLink('Terms', tierThreeTermsLink)}.
				</p>
			</div>
		),
	};
	return (
		<div css={container}>
			<FinePrint mobileTheme={'dark'}>
				{paymentTsAndCs[productKey]}
				<FooterTsAndCs
					productKey={productKey}
					countryGroupId={countryGroupId}
				/>
			</FinePrint>
		</div>
	);
}
