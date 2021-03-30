// @flow
import type { ProductOptions } from 'helpers/productPrice/productOptions';
import { HomeDelivery, type FulfilmentOptions } from 'helpers/productPrice/fulfilmentOptions';
import { type ProductPrice } from 'helpers/productPrice/productPrices';
import {
  billingPeriodNoun,
  type BillingPeriod,
} from 'helpers/billingPeriods';

const productOptionDisplayNames: { [key: ProductOptions]: string } = {
  Saturday: 'Saturday',
  SaturdayPlus: 'Saturday',
  Sunday: 'Sunday',
  SundayPlus: 'Sunday',
  Weekend: 'Weekend',
  WeekendPlus: 'Weekend',
  Sixday: 'Six day',
  SixdayPlus: 'Six day',
  Everyday: 'Every day',
  EverydayPlus: 'Every day',
};

export function getOrderSummaryTitle(
  productOption: ProductOptions,
  fulfilmentOption: FulfilmentOptions,
  useDigitalVoucher: ?boolean = false,
) {
  const collectionOption = useDigitalVoucher ? 'Subscription card' : 'Voucher booklet';
  const fulfilmentOptionDescriptor = fulfilmentOption === HomeDelivery ? 'Paper' : collectionOption;
  return `${productOptionDisplayNames[productOption]} ${fulfilmentOptionDescriptor.toLowerCase()}`;
}

export function sensiblyGenerateDigiSubPrice(totalPrice: ProductPrice, paperPrice: ProductPrice): ProductPrice {
  const total = totalPrice.price;
  const paper = paperPrice.price;
  const digiSubPrice = ((total * 100) - (paper * 100)) / 100;

  return {
    ...totalPrice,
    price: digiSubPrice,
  };
}

export function getPriceSummary(price: string, billingPeriod: BillingPeriod) {
  return `${price}/${billingPeriodNoun(billingPeriod).toLowerCase()}`;
}
