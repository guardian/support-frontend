import { css } from '@emotion/react';
import { from, space } from '@guardian/source/foundations';

const paragraphCheckInbox = css`
	font-weight: bold;
	margin-top: ${space[5]}px;
	${from.tablet} {
		margin-top: ${space[6]}px;
	}
`;

export function ActivateSubscriptionReminder(): JSX.Element {
	return (
		<>
			<p>
				While your subscription is ready to use on this device, you will need to
				finish setting up your account to read the Guardian website with
				non-personalised advertising on other devices or browsers. You will also
				be able to manage your subscription.
			</p>
			<p css={paragraphCheckInbox}>
				Check your inbox, find the email with the subject line ‘Complete your
				Guardian account’, and follow the link to set your password.
			</p>
		</>
	);
}
