import type {
	CountryGroupId,
	CountryGroupName,
} from './internationalisation/countryGroup';
import { countryGroups } from './internationalisation/countryGroup';
import type { IsoCurrency } from './internationalisation/currency';
import type { BillingPeriod } from './productPrice/billingPeriods';
import { NoFulfilmentOptions } from './productPrice/fulfilmentOptions';
import { NoProductOptions } from './productPrice/productOptions';
import type { ProductPrices } from './productPrice/productPrices';
import type { Promotion } from './productPrice/promotions';

export function getPromotions(
	countryGroupId: CountryGroupId,
	productPrices?: ProductPrices,
	currencyId?: IsoCurrency,
	billingPeriod?: BillingPeriod,
): Promotion[] | undefined {
	if (!productPrices || !currencyId || !billingPeriod) return;

	const countryGroupName: CountryGroupName = countryGroups[countryGroupId].name;
	const productOptions =
		productPrices[countryGroupName][NoFulfilmentOptions][NoProductOptions];

	// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- can be undefined on Digi Subs Gifting LP
	if (!productOptions[billingPeriod]) {
		return;
	}

	const productPrice = productOptions[billingPeriod][currencyId];

	if (productPrice.promotions) {
		return productPrice.promotions;
	}
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
