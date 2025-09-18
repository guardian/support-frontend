import { SupportRegionId } from '@modules/internationalisation/countryGroup';
import { BillingPeriod } from '@modules/product/billingPeriod';
import { simpleFormatAmount } from 'helpers/forms/checkouts';
import { currencies } from 'helpers/internationalisation/currency';
import type {
	ActiveProductKey,
	ActiveRatePlanKey,
} from 'helpers/productCatalog';
import { productCatalog } from 'helpers/productCatalog';
import {
	getBillingPeriodNoun,
	ratePlanToBillingPeriod,
} from 'helpers/productPrice/billingPeriods';
import type { Promotion } from 'helpers/productPrice/promotions';
import { getSupportRegionIdConfig } from '../../../supportRegionConfig';

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

export type StudentDiscount = {
	amount: number;
	periodNoun: string;
	discountPriceWithCurrency: string;
	fullPriceWithCurrency: string;
	promoCode?: string;
	promoDuration?: string;
	discountSummary?: string;
};

function isStudent(
	supportRegionId: SupportRegionId,
	ratePlanKey: ActiveRatePlanKey,
	productKey: ActiveProductKey,
	promotion?: Promotion,
	requirePromotion?: boolean,
): boolean {
	const isOneYearStudent =
		ratePlanKey === 'OneYearStudent' && supportRegionId !== SupportRegionId.AU;
	const isUTSStudent =
		supportRegionId === SupportRegionId.AU &&
		productKey === 'SupporterPlus' &&
		ratePlanKey === 'Monthly';
	const isUTSStudentWithPromoCode =
		isUTSStudent && promotion?.promoCode === 'UTS_STUDENT';
	return (
		isOneYearStudent ||
		(requirePromotion ? isUTSStudentWithPromoCode : isUTSStudent)
	);
}

export function getStudentDiscount(
	supportRegionId: SupportRegionId,
	ratePlanKey: ActiveRatePlanKey,
	productKey: ActiveProductKey,
	promotion?: Promotion,
	requirePromotion?: boolean,
): StudentDiscount | undefined {
	if (
		!isStudent(
			supportRegionId,
			ratePlanKey,
			productKey,
			promotion,
			requirePromotion,
		)
	) {
		return undefined;
	}
	const { currencyKey } = getSupportRegionIdConfig(supportRegionId);
	const currency = currencies[currencyKey];
	const billingPeriod = ratePlanToBillingPeriod(ratePlanKey);
	const periodNoun = getBillingPeriodNoun(billingPeriod);

	// full price
	const productCatalogFullPrice = productCatalog.SupporterPlus?.ratePlans[
		billingPeriod
	]?.pricing[currencyKey] as number;
	const fullPriceWithCurrency = simpleFormatAmount(
		currency,
		productCatalogFullPrice,
	);
	// student or promotional price
	const productCatalogDiscountPrice = productCatalog.SupporterPlus?.ratePlans[
		ratePlanKey
	]?.pricing[currencyKey] as number;
	const discountPriceCurrency = simpleFormatAmount(
		currency,
		promotion?.discountedPrice ?? productCatalogDiscountPrice,
	);
	const discountPriceWithCurrency =
		discountPriceCurrency !== fullPriceWithCurrency
			? discountPriceCurrency
			: ''; // no discount available

	// promotion offer
	const durationInMonths = promotion?.discount?.durationMonths;
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
		amount:
			promotion?.discountedPrice ??
			(productCatalogDiscountPrice || productCatalogFullPrice),
		discountPriceWithCurrency,
		fullPriceWithCurrency,
		periodNoun,
		promoDuration,
		promoCode: promotion?.promoCode,
		discountSummary,
	};
}
