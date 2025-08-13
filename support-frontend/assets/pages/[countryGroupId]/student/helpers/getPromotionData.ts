import type { IsoCountry } from '@modules/internationalisation/country';
import { BillingPeriod } from '@modules/product/billingPeriod';
import { simpleFormatAmount } from 'helpers/forms/checkouts';
import { currencies } from 'helpers/internationalisation/currency';
import { productCatalog } from 'helpers/productCatalog';
import { getBillingPeriodNoun } from 'helpers/productPrice/billingPeriods';
import { getPromotion } from 'helpers/productPrice/promotions';
import {
	getDiscountDuration,
	getDiscountSummary,
} from 'pages/[countryGroupId]/student/helpers/discountDetails';
import type { GeoId } from 'pages/geoIdConfig';
import { getGeoIdConfig } from 'pages/geoIdConfig';

type PromotionData = {
	discountPriceWithCurrency: string | undefined;
	priceWithCurrency: string;
	promoDuration: string | undefined;
	periodNoun: string;
	discountSummary: string | undefined;
	promoCode: string | undefined;
};

export default function getPromotionData(geoId: GeoId): PromotionData {
	const billingPeriod =
		geoId === 'au' ? BillingPeriod.Monthly : BillingPeriod.Annual;

	const promotion = getPromotion(
		window.guardian.allProductPrices.SupporterPlus,
		geoId.toLocaleUpperCase() as IsoCountry,
		billingPeriod,
	);

	const { currencyKey } = getGeoIdConfig(geoId);
	const price = productCatalog.SupporterPlus?.ratePlans[billingPeriod]?.pricing[
		currencyKey
	] as number;

	const currency = currencies[currencyKey];
	const periodNoun = getBillingPeriodNoun(billingPeriod);
	const priceWithCurrency = simpleFormatAmount(currency, price);
	const discountPriceWithCurrency =
		promotion?.discountedPrice !== undefined
			? simpleFormatAmount(currency, promotion.discountedPrice)
			: undefined;

	const durationInMonths = promotion?.discount?.durationMonths;

	const promoDuration = durationInMonths
		? getDiscountDuration({ durationInMonths })
		: undefined;

	const discountSummary =
		durationInMonths && discountPriceWithCurrency
			? getDiscountSummary({
					priceWithCurrency,
					discountPriceWithCurrency,
					durationInMonths,
					billingPeriod,
			  })
			: undefined;

	return {
		discountPriceWithCurrency,
		priceWithCurrency,
		promoDuration,
		periodNoun,
		promoCode: promotion?.promoCode,
		discountSummary,
	};
}
