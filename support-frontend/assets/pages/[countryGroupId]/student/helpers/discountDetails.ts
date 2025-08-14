import type { IsoCountry } from '@modules/internationalisation/country';
import { BillingPeriod } from '@modules/product/billingPeriod';
import { simpleFormatAmount } from 'helpers/forms/checkouts';
import { currencies } from 'helpers/internationalisation/currency';
import type { ActiveRatePlanKey } from 'helpers/productCatalog';
import { productCatalog } from 'helpers/productCatalog';
import {
	getBillingPeriodNoun,
	ratePlanToBillingPeriod,
} from 'helpers/productPrice/billingPeriods';
import { allProductPrices } from 'helpers/productPrice/productPrices';
import { getPromotion } from 'helpers/productPrice/promotions';
import type { GeoId } from 'pages/geoIdConfig';
import { getGeoIdConfig } from 'pages/geoIdConfig';

export function getDiscountDuration({
	durationInMonths,
}: {
	durationInMonths: number;
}) {
	const isYearly = durationInMonths % 12 === 0;
	const duration = isYearly ? durationInMonths / 12 : durationInMonths;
	const billingPeriod = isYearly ? BillingPeriod.Annual : BillingPeriod.Monthly;

	const periodNoun = getBillingPeriodNoun(billingPeriod);

	switch (duration) {
		case 1:
			return `the first ${periodNoun}`;
		case 2:
			return `two ${periodNoun}s`;
		default:
			return `${duration} ${periodNoun}s`;
	}
}

export function getDiscountSummary({
	fullPriceWithCurrency,
	discountPriceWithCurrency,
	durationInMonths,
	billingPeriod,
	promoCount = 0,
}: {
	fullPriceWithCurrency: string;
	discountPriceWithCurrency: string;
	durationInMonths: number;
	billingPeriod: BillingPeriod;
	promoCount?: number;
}) {
	const periodNoun = getBillingPeriodNoun(billingPeriod);
	const discountDuration = getDiscountDuration({
		durationInMonths,
	});

	return `${discountPriceWithCurrency}/${periodNoun} for ${discountDuration}, then ${fullPriceWithCurrency}/${periodNoun}${'*'.repeat(
		promoCount,
	)}`;
}

type StudentDiscount = {
	fullPriceWithCurrency: string;
	amount: number;
	periodNoun: string;
	promoCode?: string;
	promoDuration?: string;
	discountSummary?: string;
	discountPriceWithCurrency?: string;
};

export function getStudentDiscount(
	geoId: GeoId,
	ratePlanKey: ActiveRatePlanKey,
): StudentDiscount {
	const { currencyKey } = getGeoIdConfig(geoId);
	const currency = currencies[currencyKey];
	const billingPeriod = ratePlanToBillingPeriod(ratePlanKey);
	const periodNoun = getBillingPeriodNoun(billingPeriod);

	const promotion = getPromotion(
		allProductPrices.SupporterPlus,
		geoId.toLocaleUpperCase() as IsoCountry,
		billingPeriod,
	);

	const productCatalogPrice = productCatalog.SupporterPlus?.ratePlans[
		ratePlanKey
	]?.pricing[currencyKey] as number;

	if (!promotion) {
		const regularBillingPeriodPrice = productCatalog.SupporterPlus?.ratePlans[
			billingPeriod
		]?.pricing[currencyKey] as number;

		const discountPriceWithCurrency = simpleFormatAmount(
			currency,
			productCatalogPrice,
		);

		const fullPriceWithCurrency = simpleFormatAmount(
			currency,
			regularBillingPeriodPrice,
		);

		return {
			amount: productCatalogPrice || regularBillingPeriodPrice,
			discountPriceWithCurrency,
			fullPriceWithCurrency,
			periodNoun,
		};
	}

	const fullPriceWithCurrency = simpleFormatAmount(
		currency,
		productCatalogPrice,
	);
	const discountPriceWithCurrency =
		promotion.discountedPrice !== undefined
			? simpleFormatAmount(currency, promotion.discountedPrice)
			: undefined;

	const durationInMonths = promotion.discount?.durationMonths;

	const promoDuration = durationInMonths
		? getDiscountDuration({ durationInMonths })
		: undefined;

	const discountSummary =
		durationInMonths && discountPriceWithCurrency
			? getDiscountSummary({
					fullPriceWithCurrency,
					discountPriceWithCurrency,
					durationInMonths,
					billingPeriod,
			  })
			: undefined;

	return {
		amount: promotion.discountedPrice ?? productCatalogPrice,
		discountPriceWithCurrency,
		fullPriceWithCurrency,
		promoDuration,
		periodNoun,
		promoCode: promotion.promoCode,
		discountSummary,
	};
}
