import { palette } from '@guardian/source/foundations';
import OrderedList from 'components/list/orderedList';
import type { ObserverPaperType } from 'pages/[countryGroupId]/components/thankYouComponent';
import BulletPointedList from '../utilityComponents/BulletPointedList';

type WhatNextProps = {
	amount: string;
	startDate: string;
	isSignedIn?: boolean;
	isObserver?: ObserverPaperType;
};

export function WhatNext({
	amount,
	startDate,
	isSignedIn = false,
	isObserver,
}: WhatNextProps): JSX.Element {
	const bulletItems = [
		'You will receive an email confirming the details of your subscription',
		`Your payment of £${amount}/month will be taken on ${startDate}`,
	];
	const bulletPointSignedIn = bulletItems.concat([
		'You can now start reading the Guardian website on all your devices without personalised advertising',
	]);
	const observerPaperItems = [
		'Look out for an email from us confirming your subscription. It has everything you need to know about how to manage it in the future.',
		`Your newspaper will be delivered to your door.`,
	];
	const observerSubscriptionCardItems = observerPaperItems.concat([
		'Visit your chosen participating newsagent to pick up your newspaper using your Subscription Card, or arrange a home delivery using your delivery letter.',
	]);
	return (
		<>
			{isObserver ? (
				<OrderedList
					items={
						isObserver === 'ObserverPaper'
							? observerPaperItems
							: observerSubscriptionCardItems
					}
				/>
			) : (
				<BulletPointedList
					items={isSignedIn ? bulletPointSignedIn : bulletItems}
					color={palette.neutral[7]}
				/>
			)}
		</>
	);
}
