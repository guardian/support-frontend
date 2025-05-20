import type { ActiveProductKey } from '@modules/product-catalog/productCatalog';

const printProductsKeys: ActiveProductKey[] = [
	'NationalDelivery',
	'HomeDelivery',
	'SubscriptionCard',
	'GuardianWeeklyDomestic',
	'GuardianWeeklyRestOfWorld',
];

export function isPrintProduct(productKey: ActiveProductKey): boolean {
	return printProductsKeys.includes(productKey);
}
