import { css } from '@emotion/react';
import { space } from '@guardian/source/foundations';
import {
	LinkButton,
	SvgArrowRightStraight,
} from '@guardian/source/react-components';
import BulletPointedList from 'components/thankYou/utilityComponents/BulletPointedList';

const expandableContainer = css`
	margin-top: ${space[4]}px;

	// selectors apply to first two nested classes
	& > * + * {
		margin-top: ${space[4]}px;
	}
`;

export const signedInHeader = 'Continue to your account';

export function SignedInBodyCopy(): JSX.Element {
	const upperCopy = `By signing in, you help us to recognise you as a valued supporter when you visit our website or app. This means we can:`;
	const lowerCopy = `Make sure you sign in on each of the devices you use to read our journalism – either today or next time you use them.`;
	const advantagesList = [
		'Show you far fewer requests for financial support',
		'Offer you a simple way to manage your support payments and newsletter subscriptions',
	];

	return (
		<>
			<p>
				<span>{upperCopy}</span>
			</p>
			<div>
				<div css={expandableContainer}>
					<BulletPointedList items={advantagesList} />

					<p>{lowerCopy}</p>
				</div>
			</div>
		</>
	);
}

export function SignedInCTA(): JSX.Element {
	return (
		<LinkButton
			href={'https://theguardian.com'}
			target="_blank"
			rel="noopener noreferrer"
			priority="primary"
			size="default"
			icon={<SvgArrowRightStraight />}
			iconSide="right"
			nudgeIcon
		>
			Continue
		</LinkButton>
	);
}
