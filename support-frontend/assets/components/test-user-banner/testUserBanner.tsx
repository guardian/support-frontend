import { css } from '@emotion/react';
import {
	error,
	neutral,
	space,
	textSans20,
} from '@guardian/source/foundations';
import { isTestUser } from 'helpers/user/user';
import { isServer } from 'helpers/utilities/isServer';
import { ThankYouUserTypeSelector } from './thankYouUserTypeSelector';

const testUserBannerStyles = css`
	${textSans20};
	background-color: ${error[400]};
	color: ${neutral[100]};
	text-align: center;
	padding: ${space[2]}px 0;
	font-weight: bold;
`;

export function TestUserBanner(): JSX.Element | null {
	// Don't attempt to render on the server as we rely on the window object
	if (isServer()) {
		return null;
	}

	const testUser = isTestUser();

	if (testUser) {
		const isThankYouPage = window.location.pathname.includes('thankyou');

		return (
			<div css={testUserBannerStyles} role="banner">
				<p>You are a test user</p>
				{isThankYouPage && <ThankYouUserTypeSelector />}
			</div>
		);
	}
	return null;
}
