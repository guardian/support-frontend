import { css } from '@emotion/react';
import { error, neutral, space, textSans } from '@guardian/source-foundations';
import { useContributionsSelector } from 'helpers/redux/storeHooks';

const testUserBannerStyles = css`
	${textSans.large()};
	background-color: ${error[400]};
	color: ${neutral[100]};
	text-align: center;
	padding: ${space[2]}px 0;
`;

export function TestUserBanner(): JSX.Element | null {
	const isTestUser = useContributionsSelector(
		(state) => state.page.user.isTestUser,
	);

	if (isTestUser) {
		return (
			<div css={testUserBannerStyles}>
				<p>You are a test user</p>
			</div>
		);
	}
	return null;
}
