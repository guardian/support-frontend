import BulletPointedList from '../utilityComponents/BulletPointedList';

type WhatNextProps = {
	amount: string;
	startDate: string;
	isSignedIn?: boolean;
};

export function WhatNext({
	amount,
	startDate,
	isSignedIn,
}: WhatNextProps): JSX.Element {
	const bulletItems = [
		'You will receive an email confirming the detail of your offer',
		`Your payment of £${amount}/month will be taken on ${startDate}`,
	];
	const bulletPointSignedIn = bulletItems.concat([
		'You can now start reading the Guardian on this device in a reject all state',
	]);
	return (
		<>
			<BulletPointedList
				items={isSignedIn ? bulletPointSignedIn : bulletItems}
			/>
		</>
	);
}
