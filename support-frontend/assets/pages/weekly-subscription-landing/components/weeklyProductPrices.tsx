import React from "react";
import type { WeeklyBillingPeriod } from "helpers/productPrice/billingPeriods";
import { billingPeriodTitle, weeklyBillingPeriods, weeklyGiftBillingPeriods } from "helpers/productPrice/billingPeriods";
import { sendTrackingEventsOnClick, sendTrackingEventsOnView } from "helpers/productPrice/subscriptions";
import { getAppliedPromo } from "helpers/productPrice/promotions";
import Prices from "./content/prices";
import type { Product } from "components/product/productOption";
import "components/product/productOption";
import { getProductPrice, getFirstValidPrice } from "helpers/productPrice/productPrices";
import { getSimplifiedPriceDescription } from "helpers/productPrice/priceDescriptions";
import { getWeeklyFulfilmentOption } from "helpers/productPrice/fulfilmentOptions";
import { getOrigin, getQueryParameter } from "helpers/urls/url";
import type { Promotion } from "helpers/productPrice/promotions";
import { promoQueryParam } from "helpers/productPrice/promotions";
import type { ProductPrice } from "helpers/productPrice/productPrices";
import { currencies } from "helpers/internationalisation/currency";
import { fixDecimals } from "helpers/productPrice/subscriptions";
import type { IsoCurrency } from "helpers/internationalisation/currency";
import type { IsoCountry } from "helpers/internationalisation/country";
import type { ProductPrices } from "helpers/productPrice/productPrices";

const getCheckoutUrl = (billingPeriod: WeeklyBillingPeriod, orderIsGift: boolean): string => {
  const promoCode = getQueryParameter(promoQueryParam);
  const promoQuery = promoCode ? `&${promoQueryParam}=${promoCode}` : '';
  const gift = orderIsGift ? '/gift' : '';
  return `${getOrigin()}/subscribe/weekly/checkout${gift}?period=${billingPeriod.toString()}${promoQuery}`;
};

const getCurrencySymbol = (currencyId: IsoCurrency): string => currencies[currencyId].glyph;

const getPriceWithSymbol = (currencyId: IsoCurrency, price: number) => getCurrencySymbol(currencyId) + fixDecimals(price);

const getPromotionLabel = (promotion: Promotion | null) => {
  if (!promotion || !promotion.discount) {
    return null;
  }

  return `Save ${Math.round(promotion.discount.amount)}%`;
};

const getMainDisplayPrice = (productPrice: ProductPrice, promotion?: Promotion | null): number => {
  if (promotion) {
    const introductoryPrice = promotion.introductoryPrice && promotion.introductoryPrice.price;
    return getFirstValidPrice(promotion.discountedPrice, introductoryPrice, productPrice.price);
  }

  return productPrice.price;
};

const weeklyProductProps = (billingPeriod: WeeklyBillingPeriod, productPrice: ProductPrice, orderIsAGift = false) => {
  const promotion = getAppliedPromo(productPrice.promotions);
  const mainDisplayPrice = getMainDisplayPrice(productPrice, promotion);
  const offerCopy = promotion && promotion.landingPage && promotion.landingPage.roundel || '';
  const trackingProperties = {
    id: orderIsAGift ? `subscribe_now_cta_gift-${billingPeriod}` : `subscribe_now_cta-${billingPeriod}`,
    product: 'GuardianWeekly',
    componentType: 'ACQUISITIONS_BUTTON'
  };
  return {
    title: billingPeriodTitle(billingPeriod, orderIsAGift),
    price: getPriceWithSymbol(productPrice.currency, mainDisplayPrice),
    offerCopy,
    priceCopy: <span>
        {getSimplifiedPriceDescription(productPrice, billingPeriod)}
      </span>,
    buttonCopy: 'Subscribe now',
    href: getCheckoutUrl(billingPeriod, orderIsAGift),
    label: getPromotionLabel(promotion) || '',
    onClick: sendTrackingEventsOnClick(trackingProperties),
    onView: sendTrackingEventsOnView(trackingProperties)
  };
};

type WeeklyProductPricesProps = {
  countryId: IsoCountry;
  productPrices: ProductPrices | null | undefined;
  orderIsAGift: boolean;
};

const getProducts = ({
  countryId,
  productPrices,
  orderIsAGift
}: WeeklyProductPricesProps): Product[] => {
  const billingPeriodsToUse = orderIsAGift ? weeklyGiftBillingPeriods : weeklyBillingPeriods;
  return billingPeriodsToUse.map(billingPeriod => {
    const productPrice = productPrices ? getProductPrice(productPrices, countryId, billingPeriod, getWeeklyFulfilmentOption(countryId)) : {
      price: 0,
      fixedTerm: false,
      currency: 'GBP'
    };
    return weeklyProductProps(billingPeriod, productPrice, orderIsAGift);
  });
};

function WeeklyProductPrices({
  countryId,
  productPrices,
  orderIsAGift
}: WeeklyProductPricesProps) {
  if (!productPrices) {
    return null;
  }

  const products = getProducts({
    countryId,
    productPrices,
    orderIsAGift
  });
  return <Prices products={products} orderIsAGift={orderIsAGift} />;
} // ----- Exports ----- //


export default WeeklyProductPrices;