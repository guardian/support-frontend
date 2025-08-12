import type { IsoCountry } from '@modules/internationalisation/country';
import { BillingPeriod } from '@modules/product/billingPeriod';
import { simpleFormatAmount } from 'helpers/forms/checkouts';
import { currencies } from 'helpers/internationalisation/currency';
import { productCatalog } from 'helpers/productCatalog';
import { getBillingPeriodNoun } from 'helpers/productPrice/billingPeriods';
import { getPromotion } from 'helpers/productPrice/promotions';
import { getDiscountDuration } from 'pages/[countryGroupId]/student/helpers/discountDetails';
import type { GeoId } from 'pages/geoIdConfig';
import { getGeoIdConfig } from 'pages/geoIdConfig';

export type StudentCTA = {
	label: string;
	url: string;
};

type PromotionData = {
	promoPriceWithCurrency: string;
	priceWithCurrency: string;
	promoDuration: string;
	periodNoun: string;
	promoCode?: string;
};

export default function getPromotionData(geoId: GeoId): PromotionData {
	const billingPeriod =
		geoId === 'au' ? BillingPeriod.Monthly : BillingPeriod.Annual;

	const { currencyKey } = getGeoIdConfig(geoId);
	const price = productCatalog.SupporterPlus?.ratePlans[billingPeriod]?.pricing[
		currencyKey
	] as number;

	const promotion = getPromotion(
		window.guardian.allProductPrices.SupporterPlus,
		geoId.toLocaleUpperCase() as IsoCountry,
		billingPeriod,
	);

	const currency = currencies[currencyKey];
	const periodNoun = getBillingPeriodNoun(billingPeriod);
	const priceWithCurrency = simpleFormatAmount(currency, price);
	const promoPriceWithCurrency = simpleFormatAmount(
		currency,
		promotion?.discountedPrice ?? 0,
	);
	const durationInMonths = promotion?.discount?.durationMonths ?? 0;

	const promoDuration = getDiscountDuration({ durationInMonths });

	return {
		promoPriceWithCurrency,
		priceWithCurrency,
		promoDuration,
		periodNoun,
		promoCode: promotion?.promoCode,
	};
}
