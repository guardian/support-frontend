// @flow

import {
  getDeliveryDays,
  numberOfWeeksWeDeliverTo,
} from 'helpers/subscriptionsForms/deliveryDays';
import { formatUserDate } from 'helpers/dateConversions';

const extraDelayCutoffWeekday = 3;
const normalDelayWeeks = 1;
const extraDelayWeeks = 2;

const getWeeklyDays = (today: ?number): Date[] => {
  const now = new Date(today || new Date().getTime());
  const currentWeekday = now.getDay();
  const isChrismassy = (d: Date) => d.getDate() === 27 && d.getMonth() === 11;
  const weeksToAdd =
      currentWeekday > extraDelayCutoffWeekday ||
      currentWeekday === 0 // Sunday is considered the last day of the week
        ? extraDelayWeeks
        : normalDelayWeeks;

  const allDeliveryDays = getDeliveryDays(
    now.getTime(),
    5,
    numberOfWeeksWeDeliverTo + weeksToAdd,
  );

  const nonChrismassy = allDeliveryDays.filter(d => !isChrismassy(d));

  const numberOfChrismassyDays = allDeliveryDays.length - nonChrismassy.length;

  return nonChrismassy.splice(weeksToAdd - numberOfChrismassyDays);
};

function getDisplayDays(): string[] {
  const today = new Date().getTime();
  return getWeeklyDays(today).map(day => formatUserDate(day));
}

export { getWeeklyDays, getDisplayDays };
