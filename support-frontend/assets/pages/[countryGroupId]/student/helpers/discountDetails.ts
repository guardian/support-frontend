import { SupportRegionId } from '@modules/internationalisation/countryGroup';
import { getCurrencyByCode } from '@modules/internationalisation/currency';
import { BillingPeriod } from '@modules/product/billingPeriod';
import { simpleFormatAmount } from 'helpers/forms/checkouts';
import { Country } from 'helpers/internationalisation/classes/country';
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
import { useStudentBeansRegionValid } from 'pages/[countryGroupId]/helpers/useStudentBeansRegionValid';
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
	shortFormat = false,
}: {
	fullPriceWithCurrency: string;
	discountPriceWithCurrency: string;
	durationInMonths: number;
	billingPeriod: BillingPeriod;
	promoCount?: number;
	shortFormat?: boolean;
}) {
	const periodNoun = getBillingPeriodNoun(billingPeriod);
	const discountDuration = getDiscountDuration({
		durationInMonths,
	});

	const discountOffer = shortFormat
		? discountPriceWithCurrency
		: `${discountPriceWithCurrency}/${periodNoun}`;

	return `${discountOffer} for ${discountDuration}, then ${fullPriceWithCurrency}/${periodNoun}${'*'.repeat(
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
	// excludes Australian institutions with ratePlan OneYearStudent when switch enableStudentBeansEurope On
	const excludeAustralianInstitutions =
		supportRegionId === SupportRegionId.AU &&
		ratePlanKey === 'OneYearStudent' &&
		useStudentBeansRegionValid(supportRegionId, Country.detect());

	const universityInstitutionRegions = excludeAustralianInstitutions
		? [SupportRegionId.NZ]
		: [SupportRegionId.AU, SupportRegionId.NZ];

	const isOneYearStudent =
		ratePlanKey === 'OneYearStudent' &&
		!universityInstitutionRegions.includes(supportRegionId);
	const isInstitutionDiscountSpecificStudent =
		universityInstitutionRegions.includes(supportRegionId) &&
		productKey === 'SupporterPlus' &&
		ratePlanKey === 'Monthly';
	const isInstitutionDiscountSpecificStudentWithPromoCode =
		isInstitutionDiscountSpecificStudent && promotion?.promoCode != undefined;
	return (
		isOneYearStudent ||
		(requirePromotion
			? isInstitutionDiscountSpecificStudentWithPromoCode
			: isInstitutionDiscountSpecificStudent)
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
	const currency = getCurrencyByCode(currencyKey);
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
