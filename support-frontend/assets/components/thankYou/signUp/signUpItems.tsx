import { css } from '@emotion/react';
import { space } from '@guardian/source-foundations';
import BulletPointedList from 'pages/contributions-landing/components/ContributionThankYou/components/BulletPointedList';

const listContainer = css`
	margin-top: ${space[4]}px;
`;

export const signUpHeader = 'Create your Guardian account';

export function SignUpBodyCopy(): JSX.Element {
	return (
		<>
			<p>
				Please validate your email address today so we can recognise you as a
				valued supporter when you visit our website or app. This means we will:
			</p>

			<div css={listContainer}>
				<BulletPointedList
					items={[
						'Show you far fewer requests for financial support',
						'Offer you a simple way to manage your support payments and newsletter subscriptions',
					]}
				/>
			</div>

			<p>
				Make sure you sign in on each of the devices you use to read our
				journalism – either today or next time you use them.
			</p>
		</>
	);
}
