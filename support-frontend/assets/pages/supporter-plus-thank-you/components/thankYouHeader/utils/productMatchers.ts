import type {
	ActiveProductKey,
	ActiveRatePlanKey,
} from 'helpers/productCatalog';

const paperProductsKeys: ActiveProductKey[] = [
	'NationalDelivery',
	'HomeDelivery',
	'SubscriptionCard',
] as const;

const guardianWeeklyKeys: ActiveProductKey[] = [
	'GuardianWeeklyDomestic',
	'GuardianWeeklyRestOfWorld',
] as const;

const contributionProductKeys: ActiveProductKey[] = [
	'SupporterPlus',
	'Contribution',
	'OneTimeContribution',
] as const;

const printProductsKeys: ActiveProductKey[] = [
	...paperProductsKeys,
	...guardianWeeklyKeys,
];

export function isPrintProduct(productKey: ActiveProductKey): boolean {
	return printProductsKeys.includes(productKey);
}

export function isContributionProduct(productKey: ActiveProductKey): boolean {
	return contributionProductKeys.includes(productKey);
}

export function isGuardianWeeklyProduct(productKey: ActiveProductKey): boolean {
	return guardianWeeklyKeys.includes(productKey);
}

export function isGuardianWeeklyGiftProduct(
	productKey: ActiveProductKey,
	ratePlanKey: ActiveRatePlanKey,
): boolean {
	return (
		isGuardianWeeklyProduct(productKey) &&
		['ThreeMonthGift', 'OneYearGift'].includes(ratePlanKey)
	);
}

export function isGuardianWeeklyOrTierThreeProduct(
	productKey: ActiveProductKey,
): boolean {
	return (
		isGuardianWeeklyProduct(productKey) || ['TierThree'].includes(productKey)
	);
}
