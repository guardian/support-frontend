import { css } from '@emotion/react';
import { textSans } from '@guardian/source/foundations';
import { FormSection } from 'components/checkoutForm/checkoutForm';
import { StripeDisclaimer } from 'components/stripe/stripeDisclaimer';
import DirectDebitTerms from 'components/subscriptionCheckouts/directDebit/directDebitTerms';
import type { PaymentMethod } from 'helpers/forms/paymentMethods';
import { DirectDebit } from 'helpers/forms/paymentMethods';
import { privacyLink, tierThreeTermsLink } from 'helpers/legal';
import { ManageMyAccountLink } from '../../pages/supporter-plus-landing/components/manageMyAccountLink';

const tierThreeTerms = css`
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

const termsLink = (linkText: string, url: string) => (
	<a target="_blank" rel="noopener noreferrer" href={url}>
		{linkText}
	</a>
);

export default function TierThreeTerms(props: {
	paymentFrequency: 'month' | 'year';
	paymentMethod?: PaymentMethod;
}): JSX.Element {
	const paymentFrequencyName =
		props.paymentFrequency === 'year' ? 'annual' : 'monthly';
	const productName = 'Digital + print';

	return (
		<>
			<FormSection>
				<div css={tierThreeTerms}>
					<p>
						By signing up, you are taking out a {productName} subscription. Your{' '}
						{productName} subscription will auto-renew each{' '}
						{props.paymentFrequency} unless cancelled. Your first payment will
						be taken on the publication date of your first Guardian Weekly
						magazine (as shown in the checkout) but you will start to receive
						your digital benefits when you sign up. Unless you cancel,
						subsequent {paymentFrequencyName} payments will be taken on this
						date using your chosen payment method. You can cancel your Digital +
						print subscription at any time before your next renewal date. If you
						cancel your {productName} subscription within 14 days of signing up,
						your subscription will stop immediately and we will not take the
						first payment from you. Cancellation of your subscription after 14
						days will take effect at the end of your current{' '}
						{paymentFrequencyName} payment period. To cancel go to&nbsp;
						{ManageMyAccountLink} or see our {productName}{' '}
						{termsLink('Terms', tierThreeTermsLink)}.
					</p>
					<p>
						By proceeding, you are agreeing to the {productName}{' '}
						{termsLink('Terms', tierThreeTermsLink)}.
					</p>
					<p>
						To find out what personal data we collect and how we use it, please
						visit our {termsLink('Privacy Policy', privacyLink)}.
					</p>
					<p>
						<StripeDisclaimer />
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
