// @flow

import { formatMachineDate } from 'helpers/dateConversions';
import { type ActivePaperProducts } from 'helpers/productPrice/productOptions';

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
