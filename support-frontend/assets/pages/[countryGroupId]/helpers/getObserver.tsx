import type {
	ActiveProductKey,
	ActiveRatePlanKey,
} from 'helpers/productCatalog';
import { ObserverPrint } from 'pages/paper-subscription-landing/helpers/products';

const subscriptionCardProductsKey: ActiveProductKey[] = ['SubscriptionCard'];
const paperProductsKeys: ActiveProductKey[] = [
	'NationalDelivery',
	'HomeDelivery',
];

export default function getObserver(
	productKey: ActiveProductKey,
	ratePlanKey: ActiveRatePlanKey,
): ObserverPrint | undefined {
	if (ratePlanKey !== 'Sunday') {
		return undefined;
	}

	if (paperProductsKeys.includes(productKey)) {
		return ObserverPrint.Paper;
	}

	if (subscriptionCardProductsKey.includes(productKey)) {
		return ObserverPrint.SubscriptionCard;
	}
	return undefined;
}
