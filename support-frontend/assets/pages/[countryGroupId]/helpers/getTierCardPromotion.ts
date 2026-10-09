import type { CountryCode } from '@modules/internationalisation/country';
import type { SupportRegionId } from '@modules/internationalisation/countryGroup';
import type { BillingPeriod } from '@modules/product/billingPeriod';
import { allProductPrices } from 'helpers/productPrice/productPrices';
import { getPromotion, type Promotion } from 'helpers/productPrice/promotions';
import type { CardContent } from 'pages/supporter-plus-landing/components/threeTierCard';
import { getThreeTierProductOption } from './getTierCardContent';

export function getTierCardPromotion(
	supportRegionId: SupportRegionId,
	countryId: CountryCode,
	billingPeriod: BillingPeriod,
	cardContent: CardContent,
): Promotion | undefined {
	if (cardContent.product === 'Contribution') {
		return undefined;
	}

	const tierProductPrice = allProductPrices[cardContent.product];
	const tierProductOption = getThreeTierProductOption(
		cardContent.product,
		supportRegionId,
	);
	return getPromotion(
		tierProductPrice,
		countryId,
		billingPeriod,
		'NoFulfilmentOptions',
		tierProductOption,
	);
}
