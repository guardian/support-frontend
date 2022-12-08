import { css } from '@emotion/react';
import { error, neutral, space, textSans } from '@guardian/source-foundations';
import { useLocation } from 'react-router-dom';
import { isTestUser } from 'helpers/user/user';
import { ThankYouUserTypeSelector } from './thankYouUserTypeSelector';

const testUserBannerStyles = css`
	${textSans.large()};
	background-color: ${error[400]};
	color: ${neutral[100]};
	text-align: center;
	padding: ${space[2]}px 0;
	font-weight: bold;
`;

export function TestUserBanner(): JSX.Element | null {
	const testUser = isTestUser();

	if (testUser) {
		const location = useLocation();
		const isThankYouPage = location.pathname.includes('thankyou');

		return (
			<div css={testUserBannerStyles}>
				<p>You are a test user</p>
				{isThankYouPage && <ThankYouUserTypeSelector />}
			</div>
		);
	}
	return null;
}
