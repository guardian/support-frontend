import { WeeklyPricesProps } from '../components/content/prices';
import {
    countryGroups,
    currencies,
    fromCountry,
    CountryCode,
    CountryGroupName,
    IsoCurrency,
} from './internationalisation';

type ProductOptions = 'NoProductOptions';

type FulfilmentOptions = 'Domestic' | 'RestOfWorld' | 'NoFulfilmentOptions';

type BillingPeriod = 'SixWeekly' | 'Annual' | 'Monthly' | 'Quarterly';

const weeklyBillingPeriods: BillingPeriod[] = ['SixWeekly', 'Quarterly', 'Annual'];

function billingPeriodTitle(billingPeriod: BillingPeriod, fixedTerm: boolean = false) {
    switch (billingPeriod) {
        case 'Annual':
            return fixedTerm ? '12 months' : billingPeriod;
        case 'Quarterly':
            return fixedTerm ? '3 months' : billingPeriod;
        case 'SixWeekly':
            return '6 for 6';
        default:
            return billingPeriod;
    }
}

const getCurrencySymbol = (currencyId: IsoCurrency): string => currencies[currencyId].glyph;

const getPriceWithSymbol = (currencyId: IsoCurrency, price: number) =>
    getCurrencySymbol(currencyId) + price.toFixed(2);

type CountryGroupPrices = {
    [key in FulfilmentOptions]: {
        [key in ProductOptions]: {
            [key in BillingPeriod]: {
                [key in IsoCurrency]: ProductPrice;
            };
        };
    };
};

export type ProductPrices = {
    [key in CountryGroupName]: CountryGroupPrices;
};

type ProductPrice = {
    price: number;
    currency: IsoCurrency;
    fixedTerm: boolean;
    savingVsRetail?: number;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    promotions?: any[];
};

const getWeeklyFulfilmentOption = (country: string) =>
    countryGroups.International.supportInternationalisationId === country
        ? 'RestOfWorld'
        : 'Domestic';

function getProductPrice(
    productPrices: ProductPrices,
    country: string,
    billingPeriod: BillingPeriod,
    fulfilmentOption: FulfilmentOptions = 'NoFulfilmentOptions',
    productOption: ProductOptions = 'NoProductOptions',
): ProductPrice {
    const countryGroup = countryGroups[fromCountry(country)] || countryGroups.GBPCountries;

    return productPrices[countryGroup.name][fulfilmentOption][productOption][billingPeriod][
        countryGroup.currency
    ];
}

function weeklyProductProps(billingPeriod: BillingPeriod, productPrice: ProductPrice) {
    const promotion = productPrice?.promotions?.[0];
    const introductoryPrice = promotion?.introductoryPrice?.price;
    const discountedPrice = promotion?.discountedPrice;
    const mainDisplayPrice = introductoryPrice || discountedPrice || productPrice.price;
    const offerCopy = promotion?.landingPage?.roundel ?? '';
    const label = promotion?.discount?.amount ? `Save ${promotion?.discount?.amount}%` : '';

    return {
        title: billingPeriodTitle(billingPeriod),
        price: getPriceWithSymbol(productPrice.currency, mainDisplayPrice),
        offerCopy,
        priceCopy: '',
        buttonCopy: 'Subscribe now',
        href: '/',
        label,
        onClick: () => undefined,
        onView: () => undefined,
    };
}

export default function getProductPrices(
    productPrices: ProductPrices,
    countryId: CountryCode,
): WeeklyPricesProps {
    return {
        products: weeklyBillingPeriods.map((billingPeriod) => {
            const defaultPrice: ProductPrice = { price: 0, fixedTerm: false, currency: 'GBP' };
            const productPrice = productPrices
                ? getProductPrice(
                      productPrices,
                      countryId,
                      billingPeriod,
                      getWeeklyFulfilmentOption(countryId),
                  )
                : defaultPrice;
            return weeklyProductProps(billingPeriod, productPrice);
        }),
    };
}
