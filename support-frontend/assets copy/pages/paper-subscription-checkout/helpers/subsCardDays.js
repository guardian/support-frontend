// @flow

import { formatMachineDate } from 'helpers/utilities/dateConversions';
import { type ActivePaperProducts } from 'helpers/productPrice/productOptions';

const additionalDays = [{
  Everyday: 8, Sixday: 8, Weekend: 13, Sunday: 14, EverydayPlus: 8, SixdayPlus: 8, WeekendPlus: 13, SundayPlus: 14,
}, {
  Everyday: 10, Sixday: 10, Weekend: 12, Sunday: 13, EverydayPlus: 10, SixdayPlus: 10, WeekendPlus: 12, SundayPlus: 13,
}, {
  Everyday: 9, Sixday: 9, Weekend: 11, Sunday: 12, EverydayPlus: 9, SixdayPlus: 9, WeekendPlus: 11, SundayPlus: 12,
}, {
  Everyday: 8, Sixday: 8, Weekend: 10, Sunday: 11, EverydayPlus: 8, SixdayPlus: 8, WeekendPlus: 10, SundayPlus: 11,
}, {
  Everyday: 11, Sixday: 11, Weekend: 16, Sunday: 17, EverydayPlus: 11, SixdayPlus: 11, WeekendPlus: 16, SundayPlus: 17,
}, {
  Everyday: 10, Sixday: 10, Weekend: 15, Sunday: 16, EverydayPlus: 10, SixdayPlus: 10, WeekendPlus: 15, SundayPlus: 16,
}, {
  Everyday: 9, Sixday: 9, Weekend: 14, Sunday: 15, EverydayPlus: 9, SixdayPlus: 9, WeekendPlus: 14, SundayPlus: 15,
}];

const monthText = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const milsInADay = 1000 * 60 * 60 * 24;

const getFormattedStartDate = (startDate: Date) => {
  if (startDate) {
    const machineDateArray = formatMachineDate(startDate).split('-');
    return `${machineDateArray[2]} ${monthText[startDate.getMonth()]} ${machineDateArray[0]}`;
  }
  return 'date to be confirmed';
};

const getPaymentStartDate = (date: number, productOption: ActivePaperProducts) => {
  const day = new Date(date).getDay();
  const delay = additionalDays[day][productOption];
  const delayInMils = delay * milsInADay;
  return new Date(date + delayInMils);
};

export { getFormattedStartDate, getPaymentStartDate, monthText };
