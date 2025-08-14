import { palette } from '@guardian/source/foundations';
import OrderedList from 'components/list/orderedList';
import type {
	ActiveProductKey,
	ActiveRatePlanKey,
} from 'helpers/productCatalog';
import type { ObserverPrint } from 'pages/paper-subscription-landing/helpers/products';
import {
	isGuardianWeeklyGiftProduct,
	isGuardianWeeklyProduct,
	isPrintProduct,
} from 'pages/supporter-plus-thank-you/components/thankYouHeader/utils/productMatchers';
import BulletPointedList from '../utilityComponents/BulletPointedList';
import { helpCenterCta, myAccountCta } from './whatNextCta';

export function WhatNext({
	productKey,
	ratePlanKey,
	amount,
	observerPrint,
	startDate,
	isSignedIn = false,
}: {
	productKey: ActiveProductKey;
	ratePlanKey: ActiveRatePlanKey;
	amount: string;
	startDate?: string;
	isSignedIn?: boolean;
	observerPrint?: ObserverPrint;
}) {
	const isSubscriptionCard = productKey === 'SubscriptionCard';
	const isGuardianAdLite = productKey === 'GuardianAdLite';
	const isGuardianWeekly = isGuardianWeeklyProduct(productKey);
	const isGuardianPrint = isPrintProduct(productKey) && !observerPrint;

	if (isGuardianWeekly) {
		const lookoutForEmailCopy =
			'Look out for an email from us confirming your subscription. It has everything you need to know about how to manage it in the future.';
		const manageSubscriptionComponent = (
			<>
				You can manage your subscription by visiting {myAccountCta}. For any
				other queries please visit the {helpCenterCta('Help centre')}.
			</>
		);
		const guardianWeeklyItems = [
			lookoutForEmailCopy,
			'Your magazine will be delivered to your door. Please allow 1 to 7 days after publication date for your magazine to arrive, depending on national post services.',
			manageSubscriptionComponent,
		];
		const guardianWeeklyGiftItems = [
			lookoutForEmailCopy,
			'We’re unable to contact the gift recipient directly - make sure to let them know the gift is on its way',
			<>
				Each copy will be delivered to the gift recipient’s door. Here’s a
				reminder of {helpCenterCta('how home delivery works')}.
			</>,
			manageSubscriptionComponent,
		];

		const isGuardianWeeklyGift = isGuardianWeeklyGiftProduct(
			productKey,
			ratePlanKey,
		);
		return (
			<OrderedList
				items={
					isGuardianWeeklyGift ? guardianWeeklyGiftItems : guardianWeeklyItems
				}
			/>
		);
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

	if (isGuardianAdLite) {
		const guardianAdLiteItems = [
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
				items={guardianAdLiteItems.filter(Boolean)}
				color={palette.neutral[7]}
			/>
		);
	}

	return null;
}
