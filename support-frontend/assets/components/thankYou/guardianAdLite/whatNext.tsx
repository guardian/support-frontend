import { palette } from '@guardian/source/foundations';
import OrderedList from 'components/list/orderedList';
import { ObserverPrint } from 'pages/paper-subscription-landing/helpers/products';
import BulletPointedList from '../utilityComponents/BulletPointedList';

type WhatNextProps = {
	amount: string;
	startDate?: string;
	isSignedIn?: boolean;
	observerPrint?: ObserverPrint;
};

export function WhatNext({
	amount,
	startDate,
	isSignedIn = false,
	observerPrint,
}: WhatNextProps): JSX.Element {
	if (observerPrint) {
		const observerListItems = [
			'Look out for an email from us confirming your subscription. It has everything you need to know about how to manage it in the future.',
			'Your newspaper will be delivered to your door.',
			observerPrint === ObserverPrint.SubscriptionCard &&
				'Visit your chosen participating newsagent to pick up your newspaper using your Subscription Card, or arrange a home delivery using your delivery letter.',
			<span>
				The Observer team will be in touch shortly via email to welcome you.
				Check your spam folder or add the{' '}
				<a href="https://www.observer.co.uk">observer.co.uk</a> domain to your
				preferred sender list.
			</span>,
		];
		return <OrderedList items={observerListItems.filter(Boolean)} />;
	}

	const listItems = [
		'You will receive an email confirming the details of your subscription',
		startDate
			? `Your payment of £${amount}/month will be taken on ${startDate}`
			: '',
		isSignedIn
			? 'You can now start reading the Guardian website on all your devices without personalised advertising'
			: '',
	];

	return (
		<BulletPointedList
			items={listItems.filter(Boolean)}
			color={palette.neutral[7]}
		/>
	);
}
