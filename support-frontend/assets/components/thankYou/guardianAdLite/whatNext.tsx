import { palette } from '@guardian/source/foundations';
import BulletPointedList from '../utilityComponents/BulletPointedList';

type WhatNextProps = {
	amount: string;
	startDate?: string;
	isSignedIn?: boolean;
};

export function WhatNext({
	amount,
	startDate,
	isSignedIn = false,
}: WhatNextProps): JSX.Element {
	const bulletAllItems = [
		'You will receive an email confirming the details of your subscription',
		`Your payment of £${amount}/month will be taken on ${startDate}`,
		'You can now start reading the Guardian website on all your devices without personalised advertising',
	];
	const displayBulletItems: string[] = bulletAllItems.filter((item, index) => {
		switch (index) {
			case 0:
				return item;
			case 1:
				return !!startDate;
			case 2:
				return isSignedIn;
			default:
				return false;
		}
	});
	return (
		<BulletPointedList items={displayBulletItems} color={palette.neutral[7]} />
	);
}
