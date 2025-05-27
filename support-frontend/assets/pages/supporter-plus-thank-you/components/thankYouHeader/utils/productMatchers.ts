import type { ActiveProductKey } from '@modules/product-catalog/productCatalog';

const paperProductsKeys: ActiveProductKey[] = [
	'NationalDelivery',
	'HomeDelivery',
	'SubscriptionCard',
];

const guardianWeeklyKeys: ActiveProductKey[] = [
	'GuardianWeeklyDomestic',
	'GuardianWeeklyRestOfWorld',
];

const printProductsKeys: ActiveProductKey[] = [
	...paperProductsKeys,
	...guardianWeeklyKeys,
];

export function isPrintProduct(productKey: ActiveProductKey): boolean {
	return printProductsKeys.includes(productKey);
}

export function isGuardianWeeklyProduct(productKey: ActiveProductKey): boolean {
	return guardianWeeklyKeys.includes(productKey);
}
