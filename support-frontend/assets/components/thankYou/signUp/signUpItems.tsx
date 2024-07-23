import { css } from '@emotion/react';
import { space } from '@guardian/source/foundations';
import BulletPointedList from 'components/thankYou/utilityComponents/BulletPointedList';

const listContainer = css`
	margin-top: ${space[4]}px;
	margin-bottom: ${space[4]}px;
`;

export const signUpHeader = 'Create your Guardian account';

export function SignUpBodyCopy({
	isTier3,
}: {
	isTier3?: boolean;
}): JSX.Element {
	const upperCopy =
		'Please validate your email address today so we can recognise you as a valued supporter when you visit our website or app. This means we will:';
	const upperCopyTier3 =
		'To complete your account setup, please check your inbox for an email from us. Finishing this step will help us recognize you as a valued subscriber and allow you to:';
	const advantageList = [
		'Show you far fewer requests for financial support',
		'Offer you a simple way to manage your support payments and newsletter subscriptions',
	];
	const advantageListTier3 = [
		'Unlock all your subscription benefits.',
		'Easily manage your subscription online.',
		'See far fewer requests for financial support.',
	];
	return (
		<>
			<p>{isTier3 ? upperCopyTier3 : upperCopy}</p>

			<div css={listContainer}>
				<BulletPointedList
					items={isTier3 ? advantageListTier3 : advantageList}
				/>
			</div>

			<p>
				Make sure you sign in on each of the devices you use to read our
				journalism – either today or next time you use them.
			</p>
		</>
	);
}
