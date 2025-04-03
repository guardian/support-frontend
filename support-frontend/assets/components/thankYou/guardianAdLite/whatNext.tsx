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
	const whatNextItems = [
		!isObserver
			? 'You will receive an email confirming the details of your subscription'
			: '',
		!isObserver && !!startDate
			? `Your payment of £${amount}/month will be taken on ${startDate}`
			: '',
		!isObserver && isSignedIn
			? 'You can now start reading the Guardian website on all your devices without personalised advertising'
			: '',
		isObserver
			? 'Look out for an email from us confirming your subscription. It has everything you need to know about how to manage it in the future.'
			: '',
		isObserver ? `Your newspaper will be delivered to your door.` : '',
		isObserver === 'ObserverSubscriptionCard'
			? 'Visit your chosen participating newsagent to pick up your newspaper using your Subscription Card, or arrange a home delivery using your delivery letter.'
			: '',
	];

	const bulletItems: string[] = whatNextItems.filter((item) => item);

	return (
		<>
			{isObserver ? (
				<OrderedList items={bulletItems} />
			) : (
				<BulletPointedList items={bulletItems} color={palette.neutral[7]} />
			)}
		</>
	);
}
