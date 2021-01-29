// @flow
import type { ProductOptions } from 'helpers/productPrice/productOptions';
import { HomeDelivery, type FulfilmentOptions } from 'helpers/productPrice/fulfilmentOptions';

const productOptionDisplayNames: { [key: ProductOptions]: string } = {
  Saturday: 'Saturday',
  SaturdayPlus: 'Saturday',
  Sunday: 'Sunday',
  SundayPlus: 'Sunday',
  Weekend: 'Weekend',
  WeekendPlus: 'Weekend',
  Sixday: 'Sixday',
  SixdayPlus: 'Sixday',
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
