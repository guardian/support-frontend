import type { ProductKey } from '@modules/product-catalog/productCatalog';
import type { ActiveRatePlanKey } from 'helpers/productCatalog';

export const isSundayOnlyNewspaperSub = (
	productKey: ProductKey,
	ratePlanKey: ActiveRatePlanKey,
): boolean =>
	['HomeDelivery', 'SubscriptionCard'].includes(productKey) &&
	ratePlanKey === 'Sunday';
