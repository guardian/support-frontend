import type { IsoCountry } from '@modules/internationalisation/country';
import { CountryGroup } from 'helpers/internationalisation/classes/countryGroup';
import type {
	CountryGroupName,
	CountryGroup as CountryGroupType,
} from 'helpers/internationalisation/countryGroup';
import {
	countryGroups,
	GBPCountries,
} from 'helpers/internationalisation/countryGroup';
import type { IsoCurrency } from 'helpers/internationalisation/currency';
import { extendedGlyph, glyph } from 'helpers/internationalisation/currency';
import type { BillingPeriod } from 'helpers/productPrice/billingPeriods';
import type { FulfilmentOptions } from 'helpers/productPrice/fulfilmentOptions';
import { NoFulfilmentOptions } from 'helpers/productPrice/fulfilmentOptions';
import type { ProductOptions } from 'helpers/productPrice/productOptions';
import { NoProductOptions } from 'helpers/productPrice/productOptions';
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
	return Math.floor(totalSavingVsRetail);
};

export {
	getProductPrice,
	getFirstValidPrice,
	getCurrency,
	getCountryGroup,
	showPrice,
	isNumeric,
	getDiscountVsRetail,
};
