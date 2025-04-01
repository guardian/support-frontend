import { palette } from '@guardian/source/foundations';
import OrderedList from 'components/list/orderedList';
import BulletPointedList from '../utilityComponents/BulletPointedList';

export type ListStyle = 'bullet' | 'order';

type WhatNextProps = {
	amount: string;
	startDate: string;
	isSignedIn?: boolean;
	listStyle?: ListStyle;
};

export function WhatNext({
	amount,
	startDate,
	isSignedIn = false,
	listStyle = 'bullet',
}: WhatNextProps): JSX.Element {
	const bulletItems = [
		'You will receive an email confirming the details of your subscription',
		`Your payment of £${amount}/month will be taken on ${startDate}`,
	];
	const bulletPointSignedIn = bulletItems.concat([
		'You can now start reading the Guardian website on all your devices without personalised advertising',
	]);
	return (
		<>
			{listStyle === 'bullet' ? (
				<BulletPointedList
					items={isSignedIn ? bulletPointSignedIn : bulletItems}
					color={palette.neutral[7]}
				/>
			) : (
				/*
				 * Used for Observer Sunday Paper Thankyou only
				 * story and test will flag a difference if this was to change in future
				 */
				<OrderedList items={bulletItems} />
			)}
		</>
	);
}
