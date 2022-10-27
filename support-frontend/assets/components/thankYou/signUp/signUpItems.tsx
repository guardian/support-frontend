import { css } from '@emotion/react';
import { space } from '@guardian/source-foundations';
import BulletPointedList from 'pages/contributions-landing/components/ContributionThankYou/components/BulletPointedList';

const listContainer = css`
	margin-top: ${space[4]}px;
`;

export const signUpHeader = 'Check your inbox';

export function SignUpBodyCopy(): JSX.Element {
	return (
		<>
			<p>
				As a supporter, you can benefit from a more tailored Guardian
				experience. So we can recognise you correctly, please open the email
				we’ve sent you and set a password – it takes less than a minute. By
				registering, and staying signed in to your account in the future, we
				will:
			</p>

			<div css={listContainer}>
				<BulletPointedList
					items={[
						'Reduce the number of messages we show asking you for financial support',
						'Make it easy to manage your contributions, subscriptions and newsletters in one place',
					]}
				/>
			</div>
		</>
	);
}
