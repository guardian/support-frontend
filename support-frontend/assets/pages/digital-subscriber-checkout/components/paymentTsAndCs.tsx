import { css } from '@emotion/react';
import { neutral, textSans } from '@guardian/source-foundations';
import { privacyLink } from 'helpers/legal';

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

export function PaymentTsAndCs(): JSX.Element {
	return (
		<div css={container}>
			Payment taken after the first 14 day free trial. At the end of the free
			trial period your subscription will auto-renew, and you will be charged,
			each month at the full price of £14.99 per month or £149 per year unless
			you cancel. You can cancel at any time before your next renewal date.
			Cancellation will take effect at the end of your current subscription
			month. To cancel, go to{' '}
			<a href="http://manage.theguardian.com/">Manage My Account</a> or see our{' '}
			<a href="https://www.theguardian.com/info/2014/aug/06/guardian-observer-digital-subscriptions-terms-conditions">
				Terms
			</a>
			.
			<div css={marginTop}>
				By proceeding, you are agreeing to our{' '}
				<a href="https://www.theguardian.com/info/2014/aug/06/guardian-observer-digital-subscriptions-terms-conditions">
					Terms and Conditions
				</a>
				.{' '}
				<p css={marginTop}>
					To find out what personal data we collect and how we use it, please
					visit our <a href={privacyLink}>Privacy Policy</a>.
				</p>
			</div>
		</div>
	);
}
