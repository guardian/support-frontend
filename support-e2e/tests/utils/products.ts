export enum ProductTierLabel {
	TierOne = 'Support',
	TierTwo = 'All-access digital',
	TierThree = 'Digital plus',
}

export function isPrintProduct(product: string): boolean {
	const printProducts: string[] = [
		'NationalDelivery',
		'HomeDelivery',
		'SubscriptionCard',
		'GuardianWeeklyDomestic',
		'GuardianWeeklyRestOfWorld',
	];
	return printProducts.includes(product);
}
