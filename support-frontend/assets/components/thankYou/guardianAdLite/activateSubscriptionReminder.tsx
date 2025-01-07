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
				Completing your account set up is required to read with non-personalised
				advertising on other devices or browsers and manage your subscription.
			</p>
			<p css={paragraphCheckInbox}>
				Check your inbox, find the email “Complete your Guardian account” and
				follow the link to set your password.
			</p>
		</>
	);
}
