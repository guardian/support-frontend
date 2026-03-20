import { css } from '@emotion/react';
import { space } from '@guardian/source/foundations';
import BulletPointedList from 'components/thankYou/utilityComponents/BulletPointedList';

export const signUpHeader = 'Complete your Guardian account';

const signUpSpacing = css`
	margin-top: ${space[4]}px;
`;

export function SignUpBodyCopy({
	isGuardianPrint,
}: {
	isGuardianPrint?: boolean;
}): JSX.Element {
	const topSignUpCopyPrint =
		'To finish creating your account, please check your inbox for an email from us. This step will complete your account setup and will allow you to manage your subscription.';
	const topSignUpCopyDigital =
		'Please validate your email address today so we can recognise you as a valued supporter when you visit our website or app. This means we will:';
	return (
		<>
			<p>{isGuardianPrint ? topSignUpCopyPrint : topSignUpCopyDigital}</p>
			{!isGuardianPrint && (
				<>
					<div css={signUpSpacing}>
						<BulletPointedList
							items={[
								'Show you far fewer requests for financial support',
								'Offer you a simple way to manage your support payments and newsletter subscriptions',
							]}
						/>
					</div>
					<p css={signUpSpacing}>
						Make sure you sign in on each of the devices you use to read our
						journalism – either today or next time you use them.
					</p>
				</>
			)}
		</>
	);
}
