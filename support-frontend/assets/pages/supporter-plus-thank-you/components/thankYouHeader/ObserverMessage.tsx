import { ObserverPrint } from 'pages/paper-subscription-landing/helpers/products';

export default function ObserverMessage({
	observerPrint,
}: {
	observerPrint: ObserverPrint;
}) {
	if (observerPrint === ObserverPrint.SubscriptionCard) {
		return (
			<p>
				You should receive your subscription card in 1-2 weeks, but look out for
				an email landing in your inbox later today containing details of how you
				can pick up your newspaper before then.
			</p>
		);
	}
	return null;
}
