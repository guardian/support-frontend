import { palette } from '@guardian/source/foundations';
import OrderedList from 'components/list/orderedList';
import type { ObserverPrint } from 'pages/paper-subscription-landing/helpers/products';
import BulletPointedList from '../utilityComponents/BulletPointedList';
import { helpCenterCta, myAccountCta } from './whatNextCta';

export function WhatNext({
	amount,
	isGuardianPrint,
	isGuardianWeekly,
	isSubscriptionCard,
	observerPrint,
	startDate,
	isSignedIn = false,
}: {
	amount: string;
	isGuardianPrint: boolean;
	isGuardianWeekly: boolean;
	isSubscriptionCard: boolean;
	startDate?: string;
	isSignedIn?: boolean;
	observerPrint?: ObserverPrint;
}): JSX.Element {
	if (isGuardianWeekly) {
		const guardianWeeklyItems = [
			'Look out for an email from us confirming your subscription. It has everything you need to know about how to manage it in the future.',
			'Your magazine will be delivered to your door. Please allow 1 to 7 days after publication date for your magazine to arrive, depending on national post services.',
			<>
				You can manage your subscription by visiting {myAccountCta}. For any
				other queries please visit the {helpCenterCta}.
			</>,
		];

		return <OrderedList items={printProductItems} />;
	}

	if (observerPrint ?? isGuardianPrint) {
		const observerItem =
			'The Observer team will be in touch shortly via email to welcome you. Check your spam folder or add the observer.co.uk domain to your preferred sender list.';

		const subscriptionCardItems = [
			'You should receive an email confirming the details of your subscription, and another email shortly afterwards that contains details of how you can pick up your newspapers from tomorrow.',
			'You will receive your Subscription Card in your subscriber pack in the post, along with your home delivery letter.',
			'Visit your chosen participating newsagent to pick up your newspaper using your Subscription Card, or arrange a home delivery using your delivery letter.',
		];

		const paperItems = [
			'Look out for an email from us confirming your subscription. It has everything you need to know about how to manage it in the future.',
			'Your newspaper will be delivered to your door.',
		];

		const baseItems = isSubscriptionCard ? subscriptionCardItems : paperItems;
		const allItems = [...baseItems, observerPrint && observerItem];

		return <OrderedList items={allItems.filter(Boolean)} />;
	}

	const fallbackItems = [
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
			items={fallbackItems.filter(Boolean)}
			color={palette.neutral[7]}
		/>
	);
}
