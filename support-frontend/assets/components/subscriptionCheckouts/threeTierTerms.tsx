import { css } from '@emotion/react';
import { textSans } from '@guardian/source/foundations';
import { FormSection } from 'components/checkoutForm/checkoutForm';
import DirectDebitTerms from 'components/subscriptionCheckouts/directDebit/directDebitTerms';
import type { PaymentMethod } from 'helpers/forms/paymentMethods';
import { DirectDebit } from 'helpers/forms/paymentMethods';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import {
	privacyLink,
	subscriptionsTermsLinks,
	supporterPlusTermsLink,
	tier3TermsLink,
} from 'helpers/legal';
import { ManageMyAccountLink } from '../../pages/supporter-plus-landing/components/manageMyAccountLink';

const termsTier3 = css`
	${textSans.xxsmall()};
	color: #606060;
	p {
		margin-top: 10px;
		a {
			:visited {
				color: #606060;
			}
		}
	}
`;

export const productNameUSTier3 = 'Guardian Weekly and All-Access Digital';

const termsLink = (linkText: string, url: string) => (
	<a target="_blank" rel="noopener noreferrer" href={url}>
		{linkText}
	</a>
);

export default function Tier3Terms(props: {
	paymentFrequency: 'month' | 'year';
	paymentMethod?: PaymentMethod;
	countryGroupId?: CountryGroupId;
}): JSX.Element {
	const paymentFrequencyName =
		props.paymentFrequency === 'year' ? 'annual' : 'monthly';
	const productName =
		props.countryGroupId === 'UnitedStates'
			? productNameUSTier3
			: 'Digital + Print';

	const tier3Copy = () => {
		return (
			<>
				<p>
					By signing up, you are taking out a {productName} subscription. Your{' '}
					{productName} subscription will auto-renew each{' '}
					{props.paymentFrequency} unless cancelled. Your first payment will be
					taken on the publication date of your first Guardian Weekly magazine
					(as shown in the checkout) but you will start to receive your digital
					benefits when you sign up. Unless you cancel, subsequent{' '}
					{paymentFrequencyName} payments will be taken on this date using your
					chosen payment method. You can cancel your Digital + print
					subscription at any time before your next renewal date. If you cancel
					your {productName} subscription within 14 days of signing up, your
					subscription will stop immediately and we will not take the first
					payment from you. Cancellation of your subscription after 14 days will
					take effect at the end of your current {paymentFrequencyName} payment
					period. To cancel go to&nbsp;
					{ManageMyAccountLink} or see our {productName}{' '}
					{termsLink('Terms', tier3TermsLink)}.
				</p>
				<p>
					By proceeding, you are agreeing to the {productName}{' '}
					{termsLink('Terms', tier3TermsLink)}.
				</p>
			</>
		);
	};

	const tier3USCopy = () => {
		return (
			<>
				<p>
					By signing up, you are taking out separate subscriptions for{' '}
					{productName}. The {productName} subscriptions will auto-renew each{' '}
					{props.paymentFrequency} unless cancelled. The first payment for
					Guardian Weekly will be taken on the date of your first publication
					and the first payment for the All-Access Digital subscription will be
					taken today. Subsequent {paymentFrequencyName} payments will be taken
					at these intervals unless you cancel. Payment will be taken using your
					chosen payment method. Both subscriptions must be cancelled separately
					and you can cancel the subscriptions at any time before your next
					renewal date. If you cancel your All-Access Digital subscription
					within 14 days of signing up, you'll receive a full refund and your
					All-Access Digital subscription will stop immediately. If you would
					like to cancel your Guardian Weekly subscription within 14 days of
					signing up, contact us by phone for a full refund. Cancellation of
					either or both subscriptions after 14 days will take effect at the end
					of your current {paymentFrequencyName} payment period, and you'll
					receive a full refund for any Guardian Weekly issues not sent to you.
					If you cancel one subscription, the other subscription will continue
					and auto-renew each {props.paymentFrequency} at its applicable price
					unless cancelled. To cancel your Guardian Weekly subscription, see our
					Guardian Weekly{' '}
					{termsLink('Terms', subscriptionsTermsLinks['GuardianWeekly'])}. To
					cancel your All-Access Digital subscription go to{' '}
					{ManageMyAccountLink} or see our All-Access Digital{' '}
					{termsLink('Terms', supporterPlusTermsLink)}.
				</p>
				<p>
					By proceeding, you are agreeing to the Guardian Weekly{' '}
					{termsLink(
						'Terms and Conditions',
						subscriptionsTermsLinks['GuardianWeekly'],
					)}{' '}
					and All-Access Digital{' '}
					{termsLink('Terms and Conditions', supporterPlusTermsLink)}.
				</p>
			</>
		);
	};

	return (
		<>
			<FormSection>
				<div css={termsTier3}>
					{props.countryGroupId === 'UnitedStates'
						? tier3USCopy()
						: tier3Copy()}

					<p>
						To find out what personal data we collect and how we use it, please
						visit our {termsLink('Privacy Policy', privacyLink)}.
					</p>
				</div>
			</FormSection>
			{props.paymentMethod === DirectDebit && (
				<FormSection>
					<DirectDebitTerms isThreeTier />
				</FormSection>
			)}
		</>
	);
}
