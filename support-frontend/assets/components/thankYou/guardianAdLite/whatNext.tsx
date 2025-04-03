import { palette } from '@guardian/source/foundations';
import OrderedList from 'components/list/orderedList';
import type { ObserverPrint } from 'pages/[countryGroupId]/components/thankYouComponent';
import BulletPointedList from '../utilityComponents/BulletPointedList';

type WhatNextProps = {
	amount: string;
	startDate?: string;
	isSignedIn?: boolean;
	isObserver?: ObserverPrint;
};

export function WhatNext({
	amount,
	startDate,
	isSignedIn = false,
	isObserver,
}: WhatNextProps): JSX.Element {
	const bulletAllItems = [
		'You will receive an email confirming the details of your subscription',
		`Your payment of £${amount}/month will be taken on ${startDate}`,
		'You can now start reading the Guardian website on all your devices without personalised advertising',
		'Look out for an email from us confirming your subscription. It has everything you need to know about how to manage it in the future.',
		`Your newspaper will be delivered to your door.`,
		'Visit your chosen participating newsagent to pick up your newspaper using your Subscription Card, or arrange a home delivery using your delivery letter.',
	];
	const displayBulletItems: string[] = bulletAllItems.filter((item, index) => {
		switch (index) {
			case 0:
				return !isObserver && item;
			case 1:
				return !isObserver && !!startDate;
			case 2:
				return !isObserver && isSignedIn;
			case 3:
			case 4:
				return !!isObserver;
			case 5:
				return isObserver === 'ObserverSubscriptionCard';
			default:
				return false;
		}
	});
	return (
		<>
			{isObserver ? (
				<OrderedList items={displayBulletItems} />
			) : (
				<BulletPointedList
					items={displayBulletItems}
					color={palette.neutral[7]}
				/>
			)}
		</>
	);
}
