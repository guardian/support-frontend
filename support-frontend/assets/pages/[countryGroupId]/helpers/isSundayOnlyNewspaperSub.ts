import type { ProductKey } from '@modules/product-catalog/productCatalog';

export const isSundayOnlyNewspaperSub = (
	productKey: ProductKey,
	ratePlanKey: string,
): boolean =>
	['HomeDelivery', 'SubscriptionCard'].includes(productKey) &&
	ratePlanKey === 'Sunday';
