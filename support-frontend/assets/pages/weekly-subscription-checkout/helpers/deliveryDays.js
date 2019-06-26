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
  const weeksToAdd =
      currentWeekday > extraDelayCutoffWeekday
        ? extraDelayWeeks
        : normalDelayWeeks;
  return getDeliveryDays(
    now.getTime(),
    5,
    numberOfWeeksWeDeliverTo + weeksToAdd,
  ).splice(weeksToAdd);
};

function getDisplayDays(): string[] {
  const today = new Date().getTime();
  return getWeeklyDays(today).map(day => formatUserDate(day));
}

export { getWeeklyDays, getDisplayDays };
