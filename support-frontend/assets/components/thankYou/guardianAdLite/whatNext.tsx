import { css } from '@emotion/react';
import { palette } from '@guardian/source/foundations';
import OrderedList from 'components/list/orderedList';
import { sendTrackingEventsOnClick } from 'helpers/productPrice/subscriptions';
import { helpCentreUrl, manageSubsUrl } from 'helpers/urls/externalLinks';
import { ObserverPrint } from 'pages/paper-subscription-landing/helpers/products';
import BulletPointedList from '../utilityComponents/BulletPointedList';

const neutralFontColor = css`
	color: ${palette.neutral[0]};
`;
type WhatNextProps = {
	amount: string;
	startDate?: string;
	isSignedIn?: boolean;
	isPrintProduct: boolean;
	observerPrint?: ObserverPrint;
};

export function WhatNext({
	amount,
	startDate,
	isSignedIn = false,
	observerPrint,
	isPrintProduct,
}: WhatNextProps): JSX.Element {
	if (observerPrint) {
		const observerPrintItem =
			'The Observer team will be in touch shortly via email to welcome you. Check your spam folder or add the observer.co.uk domain to your preferred sender list.';
		const observerSubscriptionCardItems = [
			'You should receive an email confirming the details of your subscription, and another email shortly afterwards that contains details of how you can pick up your newspapers from tomorrow.',
			'You will receive your Subscription Card in your subscriber pack in the post, along with your home delivery letter.',
			'Visit your chosen participating newsagent to pick up your newspaper using your Subscription Card, or arrange a home delivery using your delivery letter.',
			observerPrintItem,
		];
		const observerPaperItems = [
			'Look out for an email from us confirming your subscription. It has everything you need to know about how to manage it in the future.',
			'Your newspaper will be delivered to your door.',
			observerPrintItem,
		];
		const observerListItems =
			observerPrint === ObserverPrint.Paper
				? observerPaperItems
				: observerSubscriptionCardItems;
		return <OrderedList items={observerListItems} />;
	}

	if (isPrintProduct) {
		const myAccountLink = (
			<a
				css={neutralFontColor}
				href={manageSubsUrl}
				onClick={sendTrackingEventsOnClick({
					id: 'checkout_my_account',
					product: 'Paper',
					componentType: 'ACQUISITIONS_BUTTON',
				})}
			>
				Manage My Account
			</a>
		);

		const helpCenterLink = (
			<a
				css={neutralFontColor}
				href={helpCentreUrl}
				onClick={sendTrackingEventsOnClick({
					id: 'checkout_help_centre',
					product: 'Paper',
					componentType: 'ACQUISITIONS_BUTTON',
				})}
			>
				Help Centre
			</a>
		);

		const printProductItems = [
			'Look out for an email from us confirming your subscription. It has everything you need to know about how to manage it in the future.',
			'Your magazine will be delivered to your door. Please allow 1 to 7 days after publication date for your magazine to arrive, depending on national post services.',
			<>
				You can manage your subscription by visiting {myAccountLink}. For any
				other queries please visit the {helpCenterLink}.
			</>,
		];

		return <OrderedList items={printProductItems} />;
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
