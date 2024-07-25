import { css } from '@emotion/react';
import { space } from '@guardian/source/foundations';
import BulletPointedList from 'components/thankYou/utilityComponents/BulletPointedList';

export const signUpHeader = 'Create your Guardian account';

export function SignUpBodyCopy({
	isTier3,
}: {
	isTier3?: boolean;
}): JSX.Element {
	const upperCopy =
		'Please validate your email address today so we can recognise you as a valued supporter when you visit our website or app. This means we will:';
	const upperCopyTier3 =
		'After creating an account, please check your inbox for an email from us. Finishing this step will complete your account setup.';
	const lowerCopy =
		'Make sure you sign in on each of the devices you use to read our journalism – either today or next time you use them.';
	const lowerCopyTier3 =
		'Make sure you sign in on all your devices when browsing our website and app. This helps us recognise you as a valued subscriber so you can enjoy all the benefits included in your subscription.';
	return (
		<>
			<p>{isTier3 ? upperCopyTier3 : upperCopy}</p>
			{!isTier3 && (
				<div
					css={css`
						margin-top: ${space[4]}px;
					`}
				>
					<BulletPointedList
						items={[
							'Show you far fewer requests for financial support',
							'Offer you a simple way to manage your support payments and newsletter subscriptions',
						]}
					/>
				</div>
			)}
			<p
				css={css`
					margin-top: ${space[4]}px;
				`}
			>
				{isTier3 ? lowerCopyTier3 : lowerCopy}
			</p>
		</>
	);
}
