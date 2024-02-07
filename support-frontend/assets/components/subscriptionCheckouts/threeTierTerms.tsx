import { css } from '@emotion/react';
import { textSans } from '@guardian/source-foundations';
import { FormSection } from 'components/checkoutForm/checkoutForm';
import DirectDebitTerms from 'components/subscriptionCheckouts/directDebit/directDebitTerms';
import type { PaymentMethod } from 'helpers/forms/paymentMethods';
import { DirectDebit } from 'helpers/forms/paymentMethods';
import { privacyLink, subscriptionsTermsLinks } from 'helpers/legal';

const threeTierTerms = css`
	${textSans.xxsmall()};
	color: #606060;
	:visited {
		color: #606060;
	}
	p {
		margin-top: 10px;
	}
`;

export default function ThreeTierTerms(props: {
	paymentFrequency: 'month' | 'year';
	paymentMethod?: PaymentMethod;
}): JSX.Element {
	const supporterPlusTermsLinks =
		'https://www.theguardian.com/info/2022/oct/28/the-guardian-supporter-plus-terms-and-conditions';
	const paymentFrequencyName =
		props.paymentFrequency === 'year' ? 'annual' : 'monthly';
	return (
		<>
			<FormSection>
				<div css={threeTierTerms}>
					<p>
						By signing up, you are taking out separate subscriptions for
						Guardian Weekly and All Access Digital. The Guardian Weekly and All
						Access Digital subscriptions will auto-renew each&nbsp;
						{props.paymentFrequency} unless cancelled. The first payment for
						Guardian Weekly will be taken on the date of your first publication
						and the first payment for the All Access Digital subscription will
						be taken today. Subsequent&nbsp;
						{paymentFrequencyName} payments will be taken at these intervals
						unless you cancel. Payment will be taken using your chosen payment
						method. Both subscriptions must be cancelled separately and you can
						cancel the subscriptions at any time before your next renewal date.
						If you cancel either or both subscriptions within 14 days of signing
						up, you&apos;ll receive a full refund for the cancelled subscription
						and the cancelled subscription will stop immediately. Cancellation
						of either or both subscriptions after 14 days will take effect at
						the end of your current&nbsp;
						{paymentFrequencyName} payment period, and you'll receive a full
						refund for any Guardian Weekly issues not sent to you. If you cancel
						one subscription, the other subscription will continue and
						auto-renew each&nbsp;
						{props.paymentFrequency} at its applicable price unless cancelled.
						To cancel your Guardian Weekly subscription, see our Guardian Weekly{' '}
						<a
							target="_blank"
							rel="noopener noreferrer"
							href={subscriptionsTermsLinks.GuardianWeekly}
						>
							Terms
						</a>
						. To cancel your All Access Digital subscription go to{' '}
						<a
							target="_blank"
							rel="noopener noreferrer"
							href="https://profile.theguardian.com/signin"
						>
							Manage My Account
						</a>{' '}
						or see our All Access Digital and All-Access Digital{' '}
						<a
							target="_blank"
							rel="noopener noreferrer"
							href={supporterPlusTermsLinks}
						>
							Terms
						</a>
						.
					</p>
					<p>
						By proceeding, you are agreeing to the Guardian Weekly{' '}
						<a
							target="_blank"
							rel="noopener noreferrer"
							href={subscriptionsTermsLinks.GuardianWeekly}
						>
							Terms and Conditions
						</a>{' '}
						and All-Access Digital{' '}
						<a
							target="_blank"
							rel="noopener noreferrer"
							href={supporterPlusTermsLinks}
						>
							Terms and Conditions
						</a>
						.
					</p>
					<p>
						To find out what personal data we collect and how we use it, please
						visit our{' '}
						<a target="_blank" rel="noopener noreferrer" href={privacyLink}>
							Privacy Policy.
						</a>
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
