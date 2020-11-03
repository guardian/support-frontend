// flow

import {
  dateIsPast,
  dateIsOutsideRange,
  getRange,
  getLatestAvailableDateText,
} from './helpers';
import { monthText } from 'pages/paper-subscription-checkout/helpers/subsCardDays';


describe('dateIsPast', () => {
  it('should be able to indicate if a selected date is in the past', () => {
    const pastDate = new Date('09/23/2020');
    const now = new Date();
    const resultPast = dateIsPast(pastDate, now);
    expect(resultPast).toBe(true);

    const resultToday = dateIsPast(now, now);
    expect(resultToday).toBe(false);
  });

});

describe('dateIsOutsideRange', () => {
  it('should be able to indicate if a selected date is too far in advance', () => {
    const now = new Date();
    const dateWithinRange = !dateIsOutsideRange(now, now);
    expect(dateWithinRange).toBe(true);

    const rangeDate = new Date();
    rangeDate.setDate(rangeDate.getDate() + 93);
    const dateOutsideRange = dateIsOutsideRange(rangeDate, now);

    expect(dateOutsideRange).toBe(true);

  });

});

describe('getRange', () => {
  it('should be able to get the latest available date from now', () => {
    const now = new Date();
    const latestAvailable = getRange(now);
    const rangeDate = new Date();
    rangeDate.setDate(rangeDate.getDate() + 89);

    expect(latestAvailable).toEqual(rangeDate);

  });

});

describe('getLatestAvailableText', () => {
  it('should be able to get the latest available date from now', () => {
    const now = new Date();
    const latestAvailable = getRange(now);
    const latestAvailableText = getLatestAvailableDateText(now);

    expect(latestAvailableText).toBe(`${latestAvailable.getDate()} ${monthText[latestAvailable.getMonth()]} ${latestAvailable.getFullYear()}`);

  });

});

