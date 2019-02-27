// @flow
import {
  Saturday,
  SaturdayPlus,
  Sunday,
  SundayPlus,
  Weekend,
  WeekendPlus,
  Sixday,
  SixdayPlus,
  Everyday,
  EverydayPlus,
  type PaperProductOptions,
} from 'helpers/productPrice/productOptions';

type Day = 0 | 1 | 2 | 3 | 4 | 5 | 6;

const milsInADay = 1000 * 60 * 60 * 24;

const maxWeeks = 4;

// The cut off for getting vouchers in two weeks is Wednesday (day #3 in ISO format) at 6 AM GMT
const cutoffWeekday = 3;
const cutoffHour = 6;

const voucherNormalDelayWeeks = 2;
const voucherExtraDelayWeeks = 3;

const getNextDayOfTheWeek = (today: number, day: Day): Date => {
  const diff = (7 + (day - new Date(today).getDay())) % 7;
  return new Date(today + (diff * milsInADay));
};

const getNextDaysOfTheWeek = (today: number, day: Day, length: number = maxWeeks): Date[] => {
  const initial = getNextDayOfTheWeek(today, day);
  const rt = [initial];
  for (let i = 1; i <= length; i += 1) {
    rt.push(new Date(rt[i - 1].getTime() + (7 * milsInADay)));
  }
  return rt;
};

const getDeliveryDayForProduct = (product: PaperProductOptions): Day => {
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

const getVoucherDays = (today: number, product: PaperProductOptions): Date[] => {
  const now = new Date(today);
  const [currentWeekday, currentHour] = [now.getDay(), now.getHours()];
  const weeksToAdd = currentWeekday >= cutoffWeekday && currentHour >= cutoffHour
    ? voucherExtraDelayWeeks : voucherNormalDelayWeeks;
  return getNextDaysOfTheWeek(today, getDeliveryDayForProduct(product), maxWeeks + weeksToAdd).splice(weeksToAdd);

};

const getDeliveryDays = (today: number, product: PaperProductOptions): Date[] =>
  getNextDaysOfTheWeek(today, getDeliveryDayForProduct(product), maxWeeks);


export { getNextDayOfTheWeek, getNextDaysOfTheWeek, getVoucherDays, getDeliveryDays };
