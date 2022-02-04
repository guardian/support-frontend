import type {
	CountryGroupId,
	CountryGroupName,
} from './internationalisation/countryGroup';
import { countryGroups } from './internationalisation/countryGroup';
import type { IsoCurrency } from './internationalisation/currency';
import { NoFulfilmentOptions } from './productPrice/fulfilmentOptions';
import { NoProductOptions } from './productPrice/productOptions';
import type { ProductPrices } from './productPrice/productPrices';
import type { Promotion } from './productPrice/promotions';

export function getPromotions(
	countryGroupId: CountryGroupId,
	productPrices?: ProductPrices,
	currencyId?: IsoCurrency,
): Promotion[] | undefined {
	if (!productPrices || !currencyId) return;

	const countryGroupName: CountryGroupName = countryGroups[countryGroupId].name;
	const billingPeriods =
		productPrices[countryGroupName][NoFulfilmentOptions][NoProductOptions];

	return Object.values(billingPeriods)[0][currencyId].promotions;
}

export function userIsPatron(promotions: Promotion[] | undefined): boolean {
	return (
		promotions?.find(
			(promotion: Promotion) =>
				promotion.numberOfDiscountedPeriods &&
				promotion.numberOfDiscountedPeriods >= 100,
		) !== undefined
	);
}
