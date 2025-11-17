import { palette } from '@guardian/source/foundations';
import type { IsoCurrency } from '@modules/internationalisation/currency';
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
import { glyph } from '../../../helpers/internationalisation/currency';
import BulletPointedList from '../utilityComponents/BulletPointedList';
import { helpCenterCta, myAccountCta } from './whatNextCta';

export function WhatNext({
	productKey,
	ratePlanKey,
	currency,
	amount,
	observerPrint,
	startDate,
	isSignedIn = false,
}: {
	productKey: ActiveProductKey;
	ratePlanKey: ActiveRatePlanKey;
	currency: IsoCurrency;
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

		return (
			<OrderedList
				items={
					isGuardianWeeklyGiftProduct(productKey, ratePlanKey)
						? guardianWeeklyGiftItems
						: guardianWeeklyItems
				}
			/>
		);
	}

	if (isGuardianAdLite) {
		const guardianAdLiteItems = [
			'You will receive an email confirming the details of your subscription',
			startDate
				? `Your payment of ${glyph(
						currency,
				  )}${amount}/month will be taken on ${startDate}`
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

	const guardianSubscriptionCardItems = [
		'You should receive an email confirming the details of your subscription, and another email shortly afterwards that contains details of how you can pick up your newspapers from tomorrow.',
		'You will receive your Subscription Card in your subscriber pack in the post, along with your home delivery letter.',
		'Visit your chosen participating newsagent to pick up your newspaper using your Subscription Card, or arrange a home delivery using your delivery letter.',
	];
	if (isGuardianPrint) {
		const guardianHomeDeliveryItems = [
			'Look out for an email from us confirming your subscription. It has everything you need to know about how to manage it in the future.',
			'Your newspaper will be delivered to your door.',
		];
		const guardianItems = isSubscriptionCard
			? guardianSubscriptionCardItems
			: guardianHomeDeliveryItems;
		return <OrderedList items={guardianItems.filter(Boolean)} />;
	}

	if (observerPrint) {
		const observerLink = (
			<a href="https://www.observer.co.uk">Observer.co.uk</a>
		);
		const observerWelcome = (
			<>
				The Observer will be in touch shortly via email to welcome you. Check
				your spam folder or add the {observerLink} domain to your preferred
				sender list. Log in to {observerLink} or The Observer app now for full
				digital access.
			</>
		);
		const observerSubscriptionCardItems = [
			...guardianSubscriptionCardItems,
			observerWelcome,
		];
		const observerHomeDeliveryItems = [
			'Look out for an email from The Guardian confirming your subscription. It has everything you need to know about how to manage your Observer digital & print subscription in the future.',
			observerWelcome,
		];
		const observerItems = isSubscriptionCard
			? observerSubscriptionCardItems
			: observerHomeDeliveryItems;
		return <OrderedList items={observerItems.filter(Boolean)} />;
	}

	return null;
}
