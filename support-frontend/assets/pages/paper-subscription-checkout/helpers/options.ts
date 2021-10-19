import type { PaperProductOptions, ProductOptions } from "helpers/productPrice/productOptions";
import { ActivePaperProductTypes, Everyday } from "helpers/productPrice/productOptions";
import { paperHasDeliveryEnabled } from "helpers/productPrice/subscriptions";
import type { FulfilmentOptions, PaperFulfilmentOptions } from "helpers/productPrice/fulfilmentOptions";
import { Collection, HomeDelivery } from "helpers/productPrice/fulfilmentOptions";
import { getQueryParameter } from "helpers/urls/url";
import { getVoucherDays } from "pages/paper-subscription-checkout/helpers/voucherDeliveryDays";
import { getHomeDeliveryDays } from "pages/paper-subscription-checkout/helpers/homeDeliveryDays";
import { formatMachineDate } from "helpers/utilities/dateConversions";

function getProductOption(): PaperProductOptions {
  const productInUrl = getQueryParameter('product');
  // $FlowIgnore - flow doesn't recognise that we've checked the value of productInUrl
  return ActivePaperProductTypes.includes(productInUrl) ? productInUrl : Everyday;
}

function getFulfilmentOption(): PaperFulfilmentOptions {
  const fulfilmentInUrl = getQueryParameter('fulfilment');
  return paperHasDeliveryEnabled() && fulfilmentInUrl === 'HomeDelivery' ? HomeDelivery : Collection;
}

function getDays(fulfilmentOption: FulfilmentOptions, productOption: ProductOptions) {
  return fulfilmentOption === HomeDelivery ? getHomeDeliveryDays(Date.now(), productOption) : getVoucherDays(Date.now(), productOption);
}

const getStartDate = (fulfilmentOption: FulfilmentOptions, productOption: ProductOptions) => formatMachineDate(getDays(fulfilmentOption, productOption)[0]) || null;

export { getProductOption, getFulfilmentOption, getDays, getStartDate };