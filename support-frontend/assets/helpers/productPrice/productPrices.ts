import type { IsoCountry } from '@modules/internationalisation/country';
import type {
	CountryGroupName,
	CountryGroup as CountryGroupType,
} from '@modules/internationalisation/countryGroup';
import {
	countryGroups,
	GBPCountries,
} from '@modules/internationalisation/countryGroup';
import type { IsoCurrency } from '@modules/internationalisation/currency';
import type { BillingPeriod } from '@modules/product/billingPeriod';
import type { FulfilmentOptions } from '@modules/product/fulfilmentOptions';
import { NoFulfilmentOptions } from '@modules/product/fulfilmentOptions';
import type { ProductOptions } from '@modules/product/productOptions';
import { NoProductOptions } from '@modules/product/productOptions';
import { CountryGroup } from 'helpers/internationalisation/classes/countryGroup';
import { extendedGlyph, glyph } from 'helpers/internationalisation/currency';
import type { Promotion } from 'helpers/productPrice/promotions';
import { fixDecimals } from 'helpers/productPrice/subscriptions';

// ----- Types ----- //
export type ProductPrice = {
	price: number;
	savingVsRetail?: number;
	currency: IsoCurrency;
	fixedTerm: boolean;
	promotions?: Promotion[];
};

type BillingPeriods = {
	[K in BillingPeriod]?: { [K in IsoCurrency]?: ProductPrice };
};

export type CountryGroupPrices = {
	[K in FulfilmentOptions]?: { [K in ProductOptions]?: BillingPeriods };
};

export type ProductPrices = {
	[K in CountryGroupName]?: CountryGroupPrices;
};

const isNumeric = (num?: number | null): num is number =>
	num !== null && num !== undefined && !Number.isNaN(num);

function getFirstValidPrice(
	...prices: Array<number | null | undefined>
): number {
	return prices.find(isNumeric) ?? 0;
}

function getCountryGroup(country: IsoCountry): CountryGroupType {
	return countryGroups[CountryGroup.fromCountry(country) ?? GBPCountries];
}

function getProductPrice(
	productPrices: ProductPrices,
	country: IsoCountry,
	billingPeriod: BillingPeriod,
	fulfilmentOption: FulfilmentOptions = NoFulfilmentOptions,
	productOption: ProductOptions = NoProductOptions,
): ProductPrice {
	const countryGroup = getCountryGroup(country);

	const productPrice =
		productPrices[countryGroup.name]?.[fulfilmentOption]?.[productOption]?.[
			billingPeriod
		]?.[countryGroup.currency];

	if (productPrice) {
		return productPrice;
	}

	throw new Error('getProductPrice: product price unavailable');
}

const showPrice = (p: ProductPrice, isExtended = true): string => {
	const showGlyph = isExtended ? extendedGlyph : glyph;
	return `${showGlyph(p.currency)}${fixDecimals(p.price)}`;
};

function getCurrency(country: IsoCountry): IsoCurrency {
	const { currency } = getCountryGroup(country);
	return currency;
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

export {
	getProductPrice,
	getFirstValidPrice,
	getCurrency,
	getCountryGroup,
	showPrice,
	isNumeric,
	getDiscountVsRetail,
	allProductPrices,
};
