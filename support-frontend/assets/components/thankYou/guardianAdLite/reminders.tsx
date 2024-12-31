import { css } from '@emotion/react';
import {
	from,
	space,
	textEgyptianBold15,
	textEgyptianBold17,
} from '@guardian/source/foundations';

export function ReminderToSignIn(): JSX.Element {
	return (
		<p>
			To enjoy reading the Guardian with non-personalised advertising on all
			your devices. please remember to sign in on each device or browser
			session. This will ensure you to read with non-personalised advertising no
			matter where you log in.
		</p>
	);
}

const paragraphCheckInbox = css`
	margin-top: ${space[5]}px;
	${textEgyptianBold15};
	${from.tablet} {
		margin-top: ${space[6]}px;
		${textEgyptianBold17};
	}
`;

export function ReminderToActivateSubscription(): JSX.Element {
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
