import {
	type ActiveProductKey,
	productCatalogDescription,
} from 'helpers/productCatalog';
import { ObserverPrint } from 'pages/paper-subscription-landing/helpers/products';

interface SubheadingProps {
	productKey: ActiveProductKey;
	observerPrint?: ObserverPrint;
	startDate?: string;
}

function Subheading({
	productKey,
	observerPrint,
	startDate,
}: SubheadingProps): JSX.Element {
	if (observerPrint === ObserverPrint.SubscriptionCard) {
		return (
			<>
				You should receive your subscription card in 1-2 weeks, but look out for
				an email landing in your inbox later today containing details of how you
				can pick up your newspaper before then.
			</>
		);
	}
	if (observerPrint === ObserverPrint.Paper) {
		return <>{`You will receive your newspapers from ${startDate}.`}</>;
	}
	const { thankyouMessage } = productCatalogDescription[productKey];
	return <>{thankyouMessage}</>;
}
export default Subheading;
