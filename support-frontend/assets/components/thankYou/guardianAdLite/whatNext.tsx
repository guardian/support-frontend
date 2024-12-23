import BulletPointedList from '../utilityComponents/BulletPointedList';

type WhatNextProps = {
	amount: string;
	startDate: string;
};

export function WhatNext({ amount, startDate }: WhatNextProps): JSX.Element {
	return (
		<>
			<BulletPointedList
				items={[
					'You will receive an email confirming the detail of your offer',
					`Your payment of £${amount}/month will be taken on ${startDate}`,
					'You can now start reading the Guardian on this device in a reject all state',
				]}
			/>
		</>
	);
}
