import { palette } from '@guardian/source/foundations';
import BulletPointedList from '../utilityComponents/BulletPointedList';

type WhatNextProps = {
	amount: string;
	startDate: string;
	isSignedIn?: boolean;
};

export function WhatNext({
	amount,
	startDate,
	isSignedIn = false,
}: WhatNextProps): JSX.Element {
	const bulletItems = [
		'You will receive an email confirming the details of your subscription',
		`Your payment of £${amount}/month will be taken on ${startDate}`,
	];
	const bulletPointSignedIn = bulletItems.concat([
		'You can now start reading the Guardian website on all your devices without personalised advertising',
	]);
	return (
		<BulletPointedList
			items={isSignedIn ? bulletPointSignedIn : bulletItems}
			color={palette.neutral[7]}
		/>
	);
}
