import { css } from '@emotion/react';
import { error, neutral, space, textSans } from '@guardian/source-foundations';
import { isTestUser } from 'helpers/user/user';

const testUserBannerStyles = css`
	${textSans.large()};
	background-color: ${error[400]};
	color: ${neutral[100]};
	text-align: center;
	padding: ${space[2]}px 0;
`;

export function TestUserBanner(): JSX.Element | null {
	const testUser = isTestUser();

	if (testUser) {
		return (
			<div css={testUserBannerStyles}>
				<p>You are a test user</p>
			</div>
		);
	}
	return null;
}
