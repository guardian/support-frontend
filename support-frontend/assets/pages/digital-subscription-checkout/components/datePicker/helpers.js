// @flow

import { DateUtils } from 'react-day-picker';
import { monthText } from 'pages/paper-subscription-checkout/helpers/subsCardDays';
import { daysFromNowForGift } from 'pages/digital-subscription-checkout/components/helpers';

const getRange = (now: Date) => {
  const rangeDate = new Date(now);
  rangeDate.setDate(rangeDate.getDate() + daysFromNowForGift);
  return rangeDate;
};

const getLatestAvailableDateText = (now: Date) => {
  const rangeDate = getRange(now);
  return `${rangeDate.getDate()} ${monthText[rangeDate.getMonth()]} ${rangeDate.getFullYear()}`;
};

const dateIsPast = (date: Date) => DateUtils.isPastDay(date);

const dateIsOutsideRange = (date: Date, now: Date) => {
  const rangeDate = getRange(now);
  return DateUtils.isDayAfter(date, rangeDate);
};

export {
  dateIsPast,
  dateIsOutsideRange,
  getRange,
  getLatestAvailableDateText,
};
