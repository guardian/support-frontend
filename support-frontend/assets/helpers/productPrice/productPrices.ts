import type { CountryCode } from '@modules/internationalisation/country';
import type { CurrencyCode } from '@modules/internationalisation/currency';
import {
	type SupportRegion,
	supportRegionIds,
	supportRegions,
} from '@modules/internationalisation/supportRegion';
import type { BillingPeriod } from '@modules/product/billingPeriod';
import type { FulfilmentOptions } from '@modules/product/fulfilmentOptions';
import { NoFulfilmentOptions } from '@modules/product/fulfilmentOptions';
import type { ProductOptions } from '@modules/product/productOptions';
import { NoProductOptions } from '@modules/product/productOptions';
import { extendedGlyph, glyph } from 'helpers/internationalisation/currency';
import type { Promotion } from 'helpers/productPrice/promotions';
import { fixDecimals } from 'helpers/productPrice/subscriptions';

// ----- Types ----- //
export type ProductPrice = {
	price: number;
	savingVsRetail?: number;
	currency: CurrencyCode;
	fixedTerm: boolean;
	promotions?: Promotion[];
};

type BillingPeriods = Partial<
	Record<BillingPeriod, Partial<Record<CurrencyCode, ProductPrice>>>
>;

export type SupportRegionPrices = Partial<
	Record<FulfilmentOptions, Partial<Record<ProductOptions, BillingPeriods>>>
>;

type SupportRegionName =
	| 'United Kingdom'
	| 'United States'
	| 'Australia'
	| 'Europe'
	| 'International'
	| 'New Zealand'
	| 'Canada';

export type ProductPrices = Partial<
	Record<SupportRegionName, SupportRegionPrices>
>;

const isNumeric = (num?: number | null): num is number =>
	num !== null && num !== undefined && !Number.isNaN(num);

function getFirstValidPrice(
	...prices: Array<number | null | undefined>
): number {
	return prices.find(isNumeric) ?? 0;
}

function getSupportRegion(country: CountryCode): SupportRegion {
	const regionId =
		supportRegionIds.find((id) =>
			supportRegions[id].countries.includes(country),
		) ?? 'uk';
	return supportRegions[regionId];
}

function getProductPrice(
	productPrices: ProductPrices,
	country: CountryCode,
	billingPeriod: BillingPeriod,
	fulfilmentOption: FulfilmentOptions = NoFulfilmentOptions,
	productOption: ProductOptions = NoProductOptions,
): ProductPrice {
	const supportRegion = getSupportRegion(country);

	const productPrice =
		productPrices[supportRegion.name as SupportRegionName]?.[
			fulfilmentOption
		]?.[productOption]?.[billingPeriod]?.[supportRegion.currency.code];

	if (productPrice) {
		return productPrice;
	}

	throw new Error('getProductPrice: product price unavailable');
}

const showPrice = (p: ProductPrice, isExtended = true): string => {
	const showGlyph = isExtended ? extendedGlyph : glyph;
	return `${showGlyph(p.currency)}${fixDecimals(p.price)}`;
};

function getCurrency(country: CountryCode): CurrencyCode {
	return getSupportRegion(country).currency.code;
}

function hackRemoveMeDiscount(discountPercentage: number) {
	// We have had a misunderstanding around how to get the correct
	// rounding for discount percentages. This is a temporary fix
	if (discountPercentage === 49) {
		return 50;
	} else if (discountPercentage === 34) {
		return 35;
	}
	return discountPercentage;
}

/**
 * @param discountedPrice - price after promo discount applied to online price
 * @param onlineVsRetailPerc - % discount of normal online price vs retail price
 * @param discountedVsOnlinePerc - % discount of discountedPrice against normal online price
 */
const getDiscountVsRetail = (
	discountedPrice: number,
	onlineVsRetailPerc: number,
	discountedVsOnlinePerc: number,
): number => {
	const onlinePrice = discountedPrice / (1 - discountedVsOnlinePerc / 100);
	const retailPrice = onlinePrice / (1 - onlineVsRetailPerc / 100);
	const totalSavingVsRetail = (1 - discountedPrice / retailPrice) * 100;
	/**
	 * We should never overstate a discount,
	 * even by a fraction of a %. Therefore
	 * we always round down to the nearest whole number.
	 */
	return hackRemoveMeDiscount(Math.floor(totalSavingVsRetail));
};

const allProductPrices = window.guardian.allProductPrices;

const allCheckoutNudgeProductPrices =
	window.guardian.allCheckoutNudgeProductPrices;

export {
	getProductPrice,
	getFirstValidPrice,
	getCurrency,
	getSupportRegion,
	showPrice,
	isNumeric,
	getDiscountVsRetail,
	allProductPrices,
	allCheckoutNudgeProductPrices,
};
