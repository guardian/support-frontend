// @flow
import type { ProductOptions } from 'helpers/productPrice/productOptions';
import {
  Everyday,
  EverydayPlus,
  Saturday,
  SaturdayPlus,
  Sixday,
  SixdayPlus,
  Sunday,
  SundayPlus,
  Weekend,
  WeekendPlus,
} from 'helpers/productPrice/productOptions';

import {
  getNextDaysOfTheWeek,
  numberOfWeeksWeDeliverTo,
} from 'helpers/subscriptionsForms/deliveryDays';

import type { Day } from 'helpers/subscriptionsForms/deliveryDays';

// The cut off for getting vouchers in two weeks is Wednesday (day #3 in ISO format) at 6 AM GMT
const voucherExtraDelayCutoffWeekday = 3;
const voucherExtraDelayCutoffHour = 6;
const voucherNormalDelayWeeks = 3;
const voucherExtraDelayWeeks = 4;

const getDeliveryDayForProduct = (product: ProductOptions): Day => {
  switch (product) {
    case SaturdayPlus:
    case Saturday:
    case Weekend:
    case WeekendPlus:
      return 6;
    case SundayPlus:
    case Sunday:
      return 0;
    case Sixday:
    case SixdayPlus:
    case Everyday:
    case EverydayPlus:
    default:
      return 1;
  }
};

const getVoucherDays = (today: number, product: ProductOptions): Date[] => {
  const now = new Date(today);
  const [currentWeekday, currentHour] = [now.getDay(), now.getHours()];
  const weeksToAdd =
    currentWeekday >= voucherExtraDelayCutoffWeekday && currentHour >= voucherExtraDelayCutoffHour
      ? voucherExtraDelayWeeks
      : voucherNormalDelayWeeks;
  return getNextDaysOfTheWeek(
    today,
    getDeliveryDayForProduct(product),
    numberOfWeeksWeDeliverTo + weeksToAdd,
  ).splice(weeksToAdd);
};

const getDeliveryDays = (today: number, product: ProductOptions): Date[] =>
  getNextDaysOfTheWeek(today, getDeliveryDayForProduct(product), numberOfWeeksWeDeliverTo);


export { getVoucherDays, getDeliveryDays };
