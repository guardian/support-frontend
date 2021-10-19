import type { ProductOptions } from "helpers/productPrice/productOptions";
import type { Day } from "helpers/subscriptionsForms/deliveryDays";
import { getDeliveryDays, jsDayToFulfilmentDay, numberOfWeeksWeDeliverTo } from "helpers/subscriptionsForms/deliveryDays";
const everyDayAndSixDay = [3, 3, 3, 3, 6, 5, 4];
const weekendAndSaturday = [6, 5, 4, 3, 9, 8, 7];
const sunday = [7, 6, 5, 4, 10, 9, 8];

const getDaysToAdd = (today: number, product: ProductOptions): number => {
  switch (product) {
    case 'Everyday':
    case 'EverydayPlus':
    case 'Sixday':
    case 'SixdayPlus':
      return everyDayAndSixDay[today];

    case 'Weekend':
    case 'WeekendPlus':
    case 'Saturday':
    case 'SaturdayPlus':
      return weekendAndSaturday[today];

    default:
      return sunday[today];
  }
};

const daysTillNextDelivery = (currentWeekDay: number, deliveryDay: number): number => currentWeekDay > deliveryDay ? 7 - currentWeekDay + deliveryDay : deliveryDay - currentWeekDay;

const canDeliverOnNextDeliveryDay = (currentWeekDay: number, deliveryDay: number, delayDays: number): boolean => daysTillNextDelivery(currentWeekDay, deliveryDay) >= delayDays;

const getHomeDeliveryDays = (today: number, product: ProductOptions): Date[] => {
  const currentWeekday = new Date(today).getDay();
  const delayDays = getDaysToAdd(currentWeekday, product);
  const deliveryDay: Day = ((currentWeekday + delayDays) % 7 as any);
  const canMakeNextDelivery = canDeliverOnNextDeliveryDay(currentWeekday, deliveryDay, delayDays);
  const deliveryIsThisWeek = jsDayToFulfilmentDay(deliveryDay) > jsDayToFulfilmentDay(currentWeekday);
  const weeksToAdd = canMakeNextDelivery && deliveryIsThisWeek ? 0 : 1;
  return getDeliveryDays(today, deliveryDay, numberOfWeeksWeDeliverTo + weeksToAdd).splice(weeksToAdd);
};

export { getHomeDeliveryDays, canDeliverOnNextDeliveryDay, daysTillNextDelivery };