// @flow

import type {
  PaperProductOptions,
  ProductOptions,
} from 'helpers/productPrice/productOptions';
import {
  ActivePaperProductTypes,
  Everyday,
} from 'helpers/productPrice/productOptions';
import { paperHasDeliveryEnabled } from 'helpers/subscriptions';
import type {
  FulfilmentOptions,
  PaperFulfilmentOptions,
} from 'helpers/productPrice/fulfilmentOptions';
import {
  Collection,
  HomeDelivery,
} from 'helpers/productPrice/fulfilmentOptions';
import { getQueryParameter } from 'helpers/url';
import { getVoucherDays } from 'pages/paper-subscription-checkout/helpers/voucherDeliveryDays';
import { getHomeDeliveryDays } from 'pages/paper-subscription-checkout/helpers/homeDeliveryDays';
import { formatMachineDate } from 'helpers/dateConversions';

export type PaperSubscriptions = 'Everyday' | 'Sixday' | 'Weekend' | 'Sunday' | null;

const additionalDays = [
  {
    Everyday: 8, Sixday: 8, Weekend: 13, Sunday: 14,
  }, // Sunday
  {
    Everyday: 10, Sixday: 10, Weekend: 12, Sunday: 13,
  }, // Monday
  {
    Everyday: 9, Sixday: 9, Weekend: 11, Sunday: 12,
  }, // Tuesday
  {
    Everyday: 8, Sixday: 8, Weekend: 10, Sunday: 11,
  }, // Wednesday
  {
    Everyday: 11, Sixday: 11, Weekend: 16, Sunday: 17,
  }, // Thursday
  {
    Everyday: 10, Sixday: 10, Weekend: 15, Sunday: 16,
  }, // Friday
  {
    Everyday: 9, Sixday: 9, Weekend: 14, Sunday: 15,
  }, // Saturday
];

const monthText = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function getProductOption(): PaperProductOptions {
  const productInUrl = getQueryParameter('product');
  // $FlowIgnore - flow doesn't recognise that we've checked the value of productInUrl
  return ActivePaperProductTypes.includes(productInUrl) ? productInUrl : Everyday;
}

function getFulfilmentOption(): PaperFulfilmentOptions {
  const fulfilmentInUrl = getQueryParameter('fulfilment');
  return paperHasDeliveryEnabled() && (fulfilmentInUrl === 'HomeDelivery') ? HomeDelivery : Collection;
}

function getDays(fulfilmentOption: FulfilmentOptions, productOption: ProductOptions) {
  return (fulfilmentOption === HomeDelivery ? getHomeDeliveryDays(Date.now(), productOption)
    : getVoucherDays(Date.now(), productOption));
}

const getStartDate = (fulfilmentOption: FulfilmentOptions, productOption: ProductOptions) =>
  formatMachineDate(getDays(fulfilmentOption, productOption)[0]) || null;

const getPaymentStartDate = (date: number, productOption: PaperSubscriptions) => {
  if (!productOption) {
    return 'date not available';
  }
  const day = new Date(date).getDay();
  const delay = additionalDays[day][productOption];
  const milsInADay = 1000 * 60 * 60 * 24;
  const delayInMils = delay * milsInADay;
  const startDate = new Date(date + delayInMils);
  const machineDateArray = formatMachineDate(startDate).split('-');
  return `${machineDateArray[2]} ${monthText[startDate.getMonth()]} ${machineDateArray[0]}`;
};


export { getProductOption, getFulfilmentOption, getDays, getStartDate, getPaymentStartDate };
